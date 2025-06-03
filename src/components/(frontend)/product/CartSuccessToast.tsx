import { CheckCircle2 } from "lucide-react";

export default function CartSuccessToast({ productName }: { productName: string }) {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-md p-4 shadow-md">
      <CheckCircle2 className="text-green-600 bg-white rounded-full w-8 h-8 p-0.5" />
      <div className="text-sm">
        <p className="font-semibold text-green-700">Ürün sepete eklendi</p>
        <p className="text-gray-700">{productName} başarıyla sepete eklendi.</p>
      </div>
    </div>
  );
}
