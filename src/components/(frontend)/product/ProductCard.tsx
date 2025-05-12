"use client"

import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  product: {
    name: string;
    slug?: string | null;

    price: number;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    if (product.slug) {
      router.push(`/product/${product.slug}`);
    }
  };

  // Determine the image URL based on the product's URLs array
 

  return (
    <div 
      className="border rounded-lg shadow-lg p-4 cursor-pointer" 
      onClick={handleClick}
    >
      resim
      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <h3 className="text-lg font-semibold">{formatPrice(product.price)}</h3>      </div>
    </div>
  );
};

export default ProductCard;
