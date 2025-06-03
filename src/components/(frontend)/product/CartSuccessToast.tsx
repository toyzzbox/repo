import { CheckCircle2 } from "lucide-react";

export default function CartSuccessToast({ productName }: { productName: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="text-green-600 mt-0.5 w-6 h-6" />
      <div className="text-sm">
        <p className="font-semibold text-green-700">Ürün sepete eklendi</p>
        <p className="text-gray-600">{productName} başarıyla sepete eklendi.</p>
      </div>
    </div>
  );
}
