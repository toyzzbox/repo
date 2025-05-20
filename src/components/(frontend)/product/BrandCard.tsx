"use client"

import { useRouter } from "next/navigation";

type BrandCardProps = {
  brand: {
    name: string;
    slug?: string | null;
  };
};

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const router = useRouter();

  const handleClick = () => {
    if (brand.slug) {
      router.push(`/brand/${brand.slug}`);
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
        <h3 className="text-lg font-semibold">{brand.name}</h3>
    </div>
    </div>
  );
};

export default BrandCard;
