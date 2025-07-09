"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { BsHeartFill } from "react-icons/bs";

import ProductImageGallery from "./ProductImageGallery";
import ProductDetailTabsMobile from "./ProductDetailTabsMobile";
import ProductBreadcrumb from "./ProductBreadcrumb";
import { toggleFavorite } from "@/app/(admin)/administor/favorites/action";
import CommentForm from "../comment/CommentForm";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";

interface MobileProductDetailsProps {
  product: any;
  relatedProducts: any[];
  isFavorited: boolean;
  comments?: any[]; // 🟢 Yorumlar
}

export default function MobileProductDetails({
  product,
  relatedProducts,
  isFavorited,
  comments = [],
}: MobileProductDetailsProps) {
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

  const [favorited, setFavorited] = useState(isFavorited);
  const [isFavPending, startFavTransition] = useTransition();

  const handleToggleFavorite = () => {
    startFavTransition(async () => {
      try {
        const res = await toggleFavorite(activeVariant.id);
        setFavorited(res.status === "added");
      } catch {
        alert("Favorilere eklemek için lütfen giriş yapın.");
      }
    });
  };

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: activeVariant.id,
        slug: activeVariant.slug,
        name: activeVariant.name,
        price: activeVariant.price,
        quantity,
        url: activeVariant.medias?.[0]?.urls?.[0] ?? "",
      }),
    );
    toast.success("Ürün sepete eklendi", {
      description: `${activeVariant.name} başarıyla sepete eklendi.`,
    });
    
  };

  const imageUrls =
    activeVariant?.medias?.length && activeVariant?.medias[0]?.urls?.length
      ? activeVariant.medias.map((m: any) => m.urls[0])
      : product.medias.map((m: any) => m.urls[0]);

  return (
    <>
      {/* Breadcrumb + Galeri + Favori */}
      <div className="relative">
        <ProductBreadcrumb
          category={product.categories?.[0]}
          groupName={product.group?.name}
          productName={activeVariant.name}
        />
        <ProductImageGallery images={imageUrls} productName={activeVariant.name} />
        <button
          onClick={handleToggleFavorite}
          disabled={isFavPending}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow transition hover:scale-110"
        >
          {favorited ? (
            <BsHeartFill className="w-6 h-6 text-red-500" />
          ) : (
            <Heart className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4 pb-24 text-slate-600 text-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          {product.group?.name
            ? `${product.group.name} – ${activeVariant.name}`
            : activeVariant.name}
        </h1>

        {/* Varyantlar */}
        {variants.length > 1 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {variants.map((variant) => (
              <div key={variant.id}>
                <button
                  onClick={() => router.push(`/${variant.slug}`)}
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
                    />
                  </div>
                  <span className="text-xs">{variant.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fiyat */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-black">
            {(activeVariant.price * quantity).toFixed(2)} TL
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-6">
  <ProductDetailTabsMobile
    product={{
      description:
        activeVariant.description ??
        product.description ??
        "Henüz açıklama bulunmuyor.",
    }}
    comments={
      <>
        {comments.length ? (
          <ul className="space-y-2">
            {comments.map((c: any) => (
              <li key={c.id}>
                <strong>{c.user.name ?? "Kullanıcı"}:</strong> {c.content}{" "}
                <span className="text-yellow-500">({c.rating}⭐)</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Henüz yorum bulunmamaktadır.</div>
        )}

        {/* ✅ Yorum ekleme formunu mobilde de gösteriyoruz */}
        <CommentForm productId={product.id} />
      </>
    }
    questions={<div>Henüz soru bulunmamaktadır.</div>}
  />
</div>
{/* Benzer Ürünler */}
<h2 className="text-lg font-semibold mb-4">Benzer Ürünler</h2>
{relatedProducts.length > 0 && (
  <div className="mt-8">
    <div className="flex overflow-x-auto gap-4">
      {relatedProducts.map((related) => (
        <div
          key={related.id}
          className="flex-shrink-0 w-32"
        >
          <ProductCard product={related} />
        </div>
      ))}
    </div>
  </div>
)}
      </div>

      {/* Sabit Sepete Ekle Butonu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-3 shadow md:hidden">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
        >
          Sepete Ekle
        </button>
      </div>
    </>
  );
}
