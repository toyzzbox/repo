'use client';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

type CartItemProps = {
  item: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      stock: number | null;
      medias: Array<{
        media: {
          urls: string[];
        };
      }>;
    };
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isPending: boolean;
};

export function CartItem({ item, onUpdateQuantity, onRemove, isPending }: CartItemProps) {
  const imageUrl =
    item.product.medias?.[0]?.media?.urls?.[0] || // Prisma yapısına göre
    null;

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-white">
      {/* Resim */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">Görsel Yok</span>
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.product.name}</h3>
        <p className="text-gray-600 mt-1">₺{item.price.toFixed(2)}</p>

        {/* Miktar */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={isPending || item.quantity <= 1}
            className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={
              isPending ||
              (item.product.stock !== null && item.quantity >= item.product.stock)
            }
            className="p-1 rounded border hover:bg-gray-100 disabled:opacity-50 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Stok uyarısı */}
        {item.product.stock !== null && item.product.stock < 5 && (
          <p className="text-orange-600 text-sm mt-2">Son {item.product.stock} adet!</p>
        )}
      </div>

      {/* Sil + Toplam */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          disabled={isPending}
          className="text-red-500 hover:text-red-700 p-2 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <p className="font-bold text-lg">
          ₺{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}