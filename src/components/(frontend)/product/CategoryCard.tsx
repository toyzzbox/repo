"use client"

import { useRouter } from "next/navigation";

type CategoryCardProps = {
  category: {
    name: string;
    slug?: string | null;
  };
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();

  const handleClick = () => {
    if (category.slug) {
      router.push(`/category/${category.slug}`);
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
        <h3 className="text-lg font-semibold">{category.name}</h3>
    </div>
    </div>
  );
};

export default CategoryCard;
