"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductImageGallery from "./ProductImageGallery";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductDetailTabs from "./ProductDetailTab";
import CartSuccessToast from "./CartSuccessToast";
import { FavoriteButton } from "./FavoriteButton";
import { addToCart } from "@/actions/cart"; // Server Action
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface ProductDetailsProps {
  userId?: string; // Kendi auth sisteminle userId
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    discount: number;
    price: number;
    barcode?: string;
    medias: { urls: string[] }[];
    categories?: { id: string; name: string; slug: string; parent?: { name: string; slug: string } }[];
    brands?: { id: string; name: string; slug: string }[];
    group?: {
      name: string;
      description?: string | null;
      products: {
        id: string;
        slug: string;
        name: string;
        price: number;
        stock?: number | null;
        medias: { urls: string[] }[];
        description?: string | null;
      }[];
    };
  };
  relatedProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
    medias: { urls: string[] }[];
  }[];
  isFavorited: boolean;
  comments: Comment[];
}

// Guest Cart Interface
interface GuestCartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

// Guest Cart Helper Functions
const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const setGuestCart = (cart: GuestCartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Guest cart kaydetme hatası:', error);
  }
};

const addToGuestCart = (item: GuestCartItem): void => {
  const cart = getGuestCart();
  const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);
  
  if (existingItemIndex > -1) {
    // Varolan ürünün miktarını artır
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    // Yeni ürün ekle
    cart.push(item);
  }
  
  setGuestCart(cart);
};

// Guest cartı veritabanına aktarma fonksiyonu (server action olarak implement edilmeli)
const migrateGuestCartToDatabase = async (userId: string): Promise<void> => {
  const guestCart = getGuestCart();
  if (guestCart.length === 0) return;

  try {
    // Her guest cart item'ını veritabanına ekle
    for (const item of guestCart) {
      await addToCart(userId, item.productId, item.quantity);
    }
    
    // Guest cart'ı temizle
    localStorage.removeItem('guestCart');
    
    toast.success(`${guestCart.length} ürün sepetinize aktarıldı!`);
  } catch (error) {
    console.error('Guest cart migration hatası:', error);
    toast.error('Sepet aktarımında hata oluştu.');
  }
};

const DesktopProductDetails: React.FC<ProductDetailsProps> = ({
  userId,
  product,
  relatedProducts,
  isFavorited,
  comments,
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();

  // Varyantlar
  const variants = product.group?.products ?? [];
  const [selectedVariant, setSelectedVariant] = useState<typeof variants[0] | null>(
    variants.find((v) => v.id === product.id) ?? null
  );
  const activeVariant = selectedVariant ?? product;
  const imageUrl = activeVariant.medias?.[0]?.urls?.[0] ?? "";

  useEffect(() => {
    setSelectedVariant(variants.find((v) => v.id === product.id) ?? null);
  }, [product]);

  // Kullanıcı giriş yaptığında guest cart'ı migrate et
  useEffect(() => {
    if (userId) {
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        // Kullanıcıya guest cart'ı aktarmak isteyip istemediğini sor
        const shouldMigrate = window.confirm(
          `Sepetinizde ${guestCart.length} ürün var. Bunları hesabınıza aktarmak ister misiniz?`
        );
        
        if (shouldMigrate) {
          migrateGuestCartToDatabase(userId);
        } else {
          localStorage.removeItem('guestCart');
        }
      }
    }
  }, [userId]);

  // Quantity
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 🛒 Server Action ile sepete ekleme (Guest + User)
  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        if (userId) {
          // Kullanıcı giriş yapmışsa veritabanına kaydet
          await addToCart(userId, activeVariant.id, quantity);
        } else {
          // Guest kullanıcı için localStorage'a kaydet
          const guestCartItem: GuestCartItem = {
            productId: activeVariant.id,
            productName: activeVariant.name,
            quantity: quantity,
            price: product.discount || product.price,
            imageUrl: activeVariant.medias?.[0]?.urls?.[0],
            addedAt: new Date().toISOString(),
          };
          
          addToGuestCart(guestCartItem);
        }
        
        // Her iki durumda da success toast göster
        toast.custom(() => <CartSuccessToast productName={activeVariant.name} />);
      } catch (err) {
        toast.error("Sepete eklerken bir hata oluştu.");
      }
    });
  };

  // Şimdi Al
  const handleBuyNow = () => {
    startTransition(async () => {
      try {
        if (userId) {
          // Kullanıcı giriş yapmışsa veritabanına kaydet
          await addToCart(userId, activeVariant.id, quantity);
        } else {
          // Guest kullanıcı için localStorage'a kaydet
          const guestCartItem: GuestCartItem = {
            productId: activeVariant.id,
            productName: activeVariant.name,
            quantity: quantity,
            price: product.discount || product.price,
            imageUrl: activeVariant.medias?.[0]?.urls?.[0],
            addedAt: new Date().toISOString(),
          };
          
          addToGuestCart(guestCartItem);
        }
        
        // Her iki durumda da sepet sayfasına yönlendir
        router.push("/cart");
      } catch {
        toast.error("Sepete eklerken bir hata oluştu.");
      }
    });
  };

  // Favori toggle (server action) - Sadece giriş yapmış kullanıcılar için
  const handleToggleFavorite = () => {
    if (!userId) {
      toast.error("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    startTransition(async () => {
      try {
        // toggleFavorite kendi server action'un olabilir
        // const res = await toggleFavorite(activeVariant.id);
        // setFavorited(res.status === "added");
      } catch {
        toast.error("Favorilere eklemek için giriş yapmalısınız.");
      }
    });
  };

  // Grup resim tıklama
  const imageToProductMap = new Map();
  product.group?.products
    ?.filter((p) => p.id !== activeVariant.id)
    ?.forEach((p) => {
      p.medias?.forEach((m) => {
        const url = m.urls?.[0];
        if (url) imageToProductMap.set(url, p);
      });
    });
  const handleGroupImageClick = (url: string) => {
    const target = imageToProductMap.get(url);
    if (target) router.push(`/product/${target.slug}`);
  };

  // Tüm ürün resimleri
  const imageUrls =
    activeVariant?.medias?.length > 0
      ? activeVariant.medias
          .map((m) => m.urls?.[0])
          .filter(Boolean) // undefined/null değerleri filtrele
      : product.medias
          .map((m) => m.urls?.[0])
          .filter(Boolean);

  // Eğer hiç resim yoksa placeholder ekle
  if (imageUrls.length === 0) {
    imageUrls.push('/placeholder.png');
  }

  return (
    <div className="p-4">
      <ProductBreadcrumb
        parentCategory={product.categories?.[0]?.parent}
        category={product.categories?.[0]}
        groupName={product.group?.name}
        productName={activeVariant.name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <ProductImageGallery
          images={imageUrls}
          productName={activeVariant.name}
          productGroupImages={product.group?.products
            ?.filter((p) => p.id !== activeVariant.id)
            ?.flatMap((p) => p.medias?.map((m) => m.urls?.[0]) || [])
            ?.filter(Boolean)}
          onGroupImageClick={handleGroupImageClick}
        />

        <div className="flex flex-col gap-4 text-slate-600 text-sm">
          <h2 className="text-3xl font-semibold text-slate-800">{activeVariant.name}</h2>

          {product.brands?.length > 0 && (
            <div className="flex items-center gap-2">
              {product.brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/marka/${brand.slug}`}
                  className="hover:text-orange-600 font-medium hover:transition-colors"
                >
                  {brand.name} <span className="text-orange-500">diğer ürünleri</span>
                </Link>
              ))}
            </div>
          )}

          {variants.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => router.push(`/product/${variant.slug}`)}
                  className={`border rounded px-3 py-2 flex flex-col items-center gap-1 w-24 ${
                    activeVariant.id === variant.id ? "border-orange-500 bg-orange-100" : "border-gray-300"
                  }`}
                >
                  <div className="w-full h-16 relative">
                    <Image
                      src={variant.medias?.[0]?.urls?.[0] || "/placeholder.png"}
                      alt={variant.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>
                  <span className="text-xs">{variant.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-2">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-red-600">{product.discount.toFixed(2)} TL</h1>
                <span className="line-through text-gray-500">{product.price.toFixed(2)} TL</span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-black">{product.price.toFixed(2)} TL</h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Adet:</span>
            <div className="flex items-center bg-gray-100 rounded px-3 py-1">
              <button onClick={decrementQuantity} className="px-2 text-lg">−</button>
              <span className="px-3">{quantity}</span>
              <button onClick={incrementQuantity} className="px-2 text-lg">+</button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBuyNow}
              className="bg-white border border-orange-400 hover:bg-orange-600 text-orange-400 hover:text-white py-4 px-6 rounded transition"
            >
              Şimdi Al
            </button>
            <button onClick={handleAddToCart} className="bg-orange-500 text-white py-2 px-4 rounded">
              Sepete Ekle
            </button>
            <FavoriteButton productId={activeVariant.id} initialIsFavorite={favorited} />
          </div>

          {!userId && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <p className="text-blue-700">
                💡 Sepetiniz geçici olarak kaydedildi. Giriş yaparak kalıcı olarak kaydedin!
                <Link href="/login" className="ml-2 text-blue-600 hover:underline font-medium">
                  Giriş Yap
                </Link>
              </p>
            </div>
          )}

          <h2 className="p-2">En geç <b className="text-orange-400">yarın</b> kargoda.</h2>
        </div>
      </div>

      <div className="mt-8">
        <ProductDetailTabs
          product={{
            description: `${activeVariant.description ?? product.description ?? "Henüz açıklama bulunmamaktadır."}${
              activeVariant.barcode || product.barcode ? `\n\nBarkod: ${activeVariant.barcode ?? product.barcode}` : ""
            }`,
            group: product.group ? { description: product.group.description ?? null } : undefined,
          }}
          comments={
            <>
              {comments.length === 0 ? (
                <div>Henüz yorum bulunmamaktadır.</div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="border p-4 rounded shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        {comment.user.image && (
                          <Image src={comment.user.image} alt={comment.user.name || "Kullanıcı"} width={32} height={32} className="rounded-full" />
                        )}
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-sm text-yellow-500">Puan: {comment.rating} / 5</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
          questions={<div>Henüz soru bulunmamaktadır.</div>}
        />
      </div>
    </div>
  );
};

export default DesktopProductDetails;