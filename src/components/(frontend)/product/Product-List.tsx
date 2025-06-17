import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@prisma/client';

interface ProductWithMedia extends Product {
  medias: {
    id: string;
    url: string;
    altText: string;
  }[];
}

interface ProductListProps {
  products: ProductWithMedia[];
  subcategories?: Category[];
}

export function ProductList({ products, subcategories }: ProductListProps) {
  return (
    <div className="mt-8">
      {/* Alt Kategoriler (Eğer varsa) */}
      {subcategories && subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Alt Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ürün Listesi */}
      <h2 className="text-xl font-semibold mb-4">Ürünler</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">Bu kategoride ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductWithMedia }) {
  const mainImage = product.medias.find(media => media.url) || {
    url: '/placeholder-product.jpg',
    altText: 'Ürün görseli yok'
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={mainImage.url}
          alt={mainImage.altText || product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-lg">{product.price.toFixed(2)} TL</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toFixed(2)} TL
            </span>
          )}
        </div>
        {product.stockQuantity && (
          <p className="text-xs text-gray-500 mt-1">
            Stok: {product.stockQuantity > 0 ? `${product.stockQuantity} adet` : 'Tükendi'}
          </p>
        )}
      </div>
    </Link>
  );
}