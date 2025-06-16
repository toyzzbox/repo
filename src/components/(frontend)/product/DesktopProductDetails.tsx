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
    price: number;
    medias: { urls: string[] }[];
    categories?: { id: string; name: string }[];
    brands?: { id: string; name: string; slug: string }[];
    group?: {
      name: string;
      products: {
        id: string;
        slug: string;
        name: string;
        price: number;
        stock?: number | null;
        medias: { urls: string[] }[];
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
        url: activeVariant.medias?.[0]?.urls?.[0] ?? "",
      })
    );
    toast.custom(() => <CartSuccessToast productName={activeVariant.name} />);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const imageUrls =
    activeVariant?.medias?.length && activeVariant?.medias[0]?.urls?.length
      ? activeVariant.medias.map((m) => m.urls[0])
      : product.medias.map((m) => m.urls[0]);

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
        category={product.categories?.[0]}
        groupName={product.group?.name}
        productName={activeVariant.name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <ProductImageGallery images={imageUrls} productName={activeVariant.name} />

        <div className="flex flex-col gap-4 text-slate-600 text-sm">
          <h2 className="text-3xl font-semibold text-slate-800">
            {product.group?.name
              ? `${product.group.name} – ${activeVariant.name}`
              : activeVariant.name}
          </h2>

          {/* Marka Linki */}
          {product.brands?.length > 0 && (
  <div className="flex items-center gap-2">
   
    {product.brands.map((brand) => (
      <Link 
        key={brand.id}
        href={`/markalar/${brand.slug}`}
        className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors"
      >
        {brand.name} <span className="text-gray-500">diğer ürünleri</span>
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
                    onClick={() => router.push(`/products/${variant.slug}`)}
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
            <h1 className="text-2xl font-bold text-black">
              {(activeVariant.price * quantity).toFixed(2)} TL
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Adet:</span>
              <div className="flex items-center bg-gray-100 rounded px-3 py-1">
                <button onClick={decrementQuantity} className="px-2 text-lg">−</button>
                <span className="px-3">{quantity}</span>
                <button onClick={incrementQuantity} className="px-2 text-lg">+</button>
              </div>
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
            <button
              onClick={handleToggleFavorite}
              disabled={isPending}
              className="p-2 rounded-full hover:bg-red-100 transition"
              aria-label="Favorilere ekle/kaldır"
            >
              {favorited ? (
                <BsHeartFill className="w-6 h-6 text-red-500" />
              ) : (
                <Heart className="w-6 h-6 text-gray-500" />
              )}
            </button>
          </div>
          <h2 className="p-2">En geç <b className="text-orange-400">yarın</b>  kargoda.</h2>
        </div>
      </div>

      {/* Açıklama / Yorumlar / Sorular */}
      <div className="mt-8">
        <ProductDetailTabs
          product={{
            description:
              activeVariant.description ??
              product.description ??
              "Henüz açıklama bulunmamaktadır.",
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

              {/* ✅ Server Action tabanlı form */}
              <CommentForm productId={product.id} />
            </>
          }
          questions={<div>Henüz soru bulunmamaktadır.</div>}
        />
      </div>
    </div>
  );
};

export default DesktopProductDetails;