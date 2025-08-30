"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import ProductImageGallery from "./ProductImageGallery";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductDetailTabs from "./ProductDetailTab";
import CartSuccessToast from "./CartSuccessToast";
import { toggleFavorite } from "@/app/(admin)/administor/favorites/action";
import { BsHeartFill } from "react-icons/bs";
import CommentForm from "../comment/CommentForm";
import { ProductCard } from "./ProductCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { FavoriteButton } from "./FavoriteButton";

interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductDetailsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    discount: number;
    price: number;
    barcode: number;
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
  product,
  relatedProducts,
  isFavorited,
  comments,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const variants = product.group?.products ?? [];
  const [selectedVariant, setSelectedVariant] = useState<typeof variants[0] | null>(
    variants.find((v) => v.id === product.id) ?? null
  );

  useEffect(() => {
    setSelectedVariant(variants.find((v) => v.id === product.id) ?? null);
  }, [product]);

  const activeVariant = selectedVariant ?? product;
  const imageUrl = activeVariant.medias?.[0]?.urls?.[0] ?? "";

  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: activeVariant.id,
        slug: activeVariant.slug,
        name: activeVariant.name,
        price: activeVariant.price,
        quantity,
        image: imageUrl, // Resim URL'sini doğru field'a ekle
        medias: activeVariant.medias, // Tam medias array'ini de ekle
        url: imageUrl, // // Fallback için de ekle
      })  
    );
    toast.custom(() => <CartSuccessToast productName={activeVariant.name} />);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const imageUrls =
  activeVariant?.medias?.length && activeVariant?.medias[0]?.media?.urls?.length
    ? activeVariant.medias.map((m) => m.media.urls[0])
    : product.medias.map((m) => m.media.urls[0]);

const productGroupImages = product.group?.products
  ?.filter(p => p.id !== activeVariant.id)
  ?.flatMap(p => p.medias?.map(m => m.media.urls[0]) || [])
  ?.filter(Boolean) || [];

const imageToProductMap = new Map();
product.group?.products
  ?.filter(p => p.id !== activeVariant.id)
  ?.forEach(p => {
    p.medias?.forEach(m => {
      const url = m.media.urls[0];
      if (url) imageToProductMap.set(url, p);
    });
  });

  // Grup resmine tıklandığında o ürüne git
  const handleGroupImageClick = (imageUrl: string) => {
    const targetProduct = imageToProductMap.get(imageUrl);
    if (targetProduct) {
      router.push(`/product/${targetProduct.slug}`);
    }
  };

  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        const res = await toggleFavorite(activeVariant.id);
        setFavorited(res.status === "added");
      } catch {
        toast.error("Favorilere eklemek için giriş yapmalısınız.");
      }
    });
  };

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
          productGroupImages={productGroupImages}
          onGroupImageClick={handleGroupImageClick}
        />

        <div className="flex flex-col gap-4 text-slate-600 text-sm">
          <h2 className="text-3xl font-semibold text-slate-800">
            {product.group?.name
              ? `${product.group.name} – ${activeVariant.name}`
              : activeVariant.name}
          </h2>

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
                <div key={variant.id} className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/product/${variant.slug}`)}
                    className={`border rounded px-3 py-2 flex flex-col items-center gap-1 w-24 ${
                      activeVariant.id === variant.id
                        ? "border-orange-500 bg-orange-100"
                        : "border-gray-300"
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
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-red-600">
                  {product.discount.toFixed(2)} TL
                </h1>
                <span className="line-through text-gray-500">
                  {product.price.toFixed(2)} TL
                </span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-black">
                {product.price.toFixed(2)} TL
              </h1>
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
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white py-2 px-4 rounded"
            >
              Sepete Ekle
            </button>
            <FavoriteButton productId={activeVariant.id} initialIsFavorite={isFavorited} />

          </div>

          <h2 className="p-2">En geç <b className="text-orange-400">yarın</b> kargoda.</h2>
        </div>
      </div>

      <div className="mt-8">
      <ProductDetailTabs
  product={{
    description: `${
      activeVariant.description ??
      product.description ??
      "Henüz açıklama bulunmamaktadır."
    }${
      activeVariant.barcode || product.barcode
        ? `\n\nBarkod: ${activeVariant.barcode || product.barcode}`
        : ""
    }`,
    group: product.group
      ? { description: product.group.description ?? null }
      : undefined,
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
                          <Image
                            src={comment.user.image}
                            alt={comment.user.name || "Kullanıcı"}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-sm text-yellow-500">Puan: {comment.rating} / 5</p>
                    </li>
                  ))}
                </ul>
              )}
              <CommentForm productId={product.id} />
            </>
          }
          questions={<div>Henüz soru bulunmamaktadır.</div>}
        />
      </div>

      <h2 className="text-lg font-semibold mt-4">Benzer Ürünler</h2>
      {relatedProducts.length === 0 ? (
        <p className="text-center text-gray-500">Ürün bulunamadı.</p>
      ) : (
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {relatedProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};

export default DesktopProductDetails;