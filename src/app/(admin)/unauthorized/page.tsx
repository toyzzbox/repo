export default function UnauthorizedPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600">Yetkisiz Giriş 🚫</h1>
        <p className="mt-2 text-gray-600">Bu sayfaya erişim izniniz bulunmamaktadır.</p>
      </div>
    );
  }
  