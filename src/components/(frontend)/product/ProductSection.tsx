import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
    title: string;
    products: Product[];
  }
  
  export const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => (
    <section>
      <h2 className="text-2xl font-bold text-center p-5">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Hiç ürün bulunamadı.
          </p>
        )}
      </div>
    </section>
  );
  