"use client";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  medias: { urls: string[] }[];
}

const RelatedProducts = ({ products }: { products: Product[] }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">İlgili Ürünler</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-2 rounded">
            <img
              src={product.medias?.[0]?.urls?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            />
            <div className="text-sm mt-2">{product.name}</div>
            <div className="text-sm font-bold">{product.price} TL</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
