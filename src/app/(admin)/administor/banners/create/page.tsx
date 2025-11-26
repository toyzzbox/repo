import CreateBannerForm from "@/components/admin/banners/CreateBannerForm";

export default function CreateBannerPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Yeni Banner Ekle</h1>
      <CreateBannerForm />
    </div>
  );
}
