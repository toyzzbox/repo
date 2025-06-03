// app/account/addresses/AddressCard.tsx

type Address = {
    id: string;
    fullName: string;
    city: string;
    district: string;
    postalCode: string;
    addressLine: string;
    phone: string;
    isDefault?: boolean;
  };
  
  type Props = {
    address: Address;
    onEdit?: (address: Address) => void;
    onDelete?: (id: string) => void;
  };
  
  export default function AddressCard({ address, onEdit, onDelete }: Props) {
    return (
      <div className="border rounded-lg p-4 shadow-sm relative bg-white">
        {address.isDefault && (
          <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Varsayılan
          </span>
        )}
  
        <div className="space-y-1 text-sm text-gray-800">
          <p className="font-semibold">{address.fullName}</p>
          <p>{address.addressLine}</p>
          <p>
            {address.district}, {address.city} {address.postalCode}
          </p>
          <p className="text-gray-600">{address.phone}</p>
        </div>
  
        <div className="mt-4 flex gap-4 text-sm">
          {onEdit && (
            <button
              onClick={() => onEdit(address)}
              className="text-blue-600 hover:underline"
            >
              Düzenle
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(address.id)}
              className="text-red-600 hover:underline"
            >
              Sil
            </button>
          )}
        </div>
      </div>
    );
  }
  