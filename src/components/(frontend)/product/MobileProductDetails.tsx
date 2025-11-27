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
import { addToCartAction, mergeCartsAction } from "../../../actions/cart.actions"; // 🔥 YENİ SERVER ACTIONS
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface ProductDetailsProps {
  userId?: string;
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
  const [cartMerged, setCartMerged] = useState(false);

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

  // 🔥 Kullanıcı giriş yaptığında sepetleri otomatik birleştir
  useEffect(() => {
    if (userId && !cartMerged) {
      startTransition(async () => {
        const result = await mergeCartsAction();
        
        if (result.success && result.data?.cart) {
          // Sepet birleştirildi mesajını göster
          const itemCount = result.data.cart.items?.length || 0;
          if (itemCount > 0) {
            toast.success(`Sepetiniz birleştirildi! ${itemCount} ürün mevcut.`);
          }
        }
        
        setCartMerged(true);
      });
    }
  }, [userId, cartMerged]);

  // Quantity
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // 🛒 YENİ: Sepete ekleme (Hem üye hem misafir)
  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        const result = await addToCartAction(activeVariant.id, quantity);
        
        if (result.success) {
          toast.custom(() => <CartSuccessToast productName={activeVariant.name} />);
          router.refresh(); // Sepet badge'ini güncelle
        } else {
          toast.error(result.error || "Sepete eklerken bir hata oluştu.");
        }
      } catch (err) {
        toast.error("Sepete eklerken bir hata oluştu.");
      }
    });
  };

  // 🛒 YENİ: Şimdi Al
  const handleBuyNow = () => {
    startTransition(async () => {
      try {
        const result = await addToCartAction(activeVariant.id, quantity);
        
        if (result.success) {
          router.push("/cart");
        } else {
          toast.error(result.error || "Sepete eklerken bir hata oluştu.");
        }
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
          .filter(Boolean)
      : product.medias
          .map((m) => m.urls?.[0])
          .filter(Boolean);

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
              disabled={isPending}
              className="bg-white border border-orange-400 hover:bg-orange-600 text-orange-400 hover:text-white py-4 px-6 rounded transition disabled:opacity-50"
            >
              {isPending ? "Ekleniyor..." : "Şimdi Al"}
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={isPending}
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition disabled:opacity-50"
            >
              {isPending ? "Ekleniyor..." : "Sepete Ekle"}
            </button>
            <FavoriteButton productId={activeVariant.id} initialIsFavorite={favorited} />
          </div>

         

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