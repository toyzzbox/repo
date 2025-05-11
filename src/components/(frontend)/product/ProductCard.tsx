type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-gray-600">{product.price}₺</p>
    </div>
  );
}