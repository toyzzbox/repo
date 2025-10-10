import { getAddresses } from "@/actions/getAddresses";
import AddAddressDialog from "../../account/adress/AddAddressDialog";

const AddressSection = async () => {
  const addresses = await getAddresses();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Adreslerim</h1>
          <p className="text-sm text-muted-foreground">
            Teslimat adreslerinizi burada yönetebilirsiniz.
          </p>
        </div>
        <AddAddressDialog />
      </div>
      
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">Henüz kayıtlı adresiniz yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-base mb-2">{address.title}</h3>
              <p className="text-sm text-gray-700 mb-1">{address.name}</p>
              <p className="text-sm text-gray-600 mb-1">Telefon: {address.phone}</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {address.address}, {address.city} {address.postalCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSection;