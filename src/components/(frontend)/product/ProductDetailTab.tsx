'use client';


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailTabsProps {
  product: {
    description: string;
  };
  comments: React.ReactNode;
  questions: React.ReactNode;
}
export default function ProductDetailTabs({
  product,
  comments,
  questions,
}: ProductDetailTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full mt-6">
      <TabsList className="w-full flex justify-start border-b">
        <TabsTrigger value="description">Açıklama</TabsTrigger>
        <TabsTrigger value="comments">Yorumlar</TabsTrigger>
        <TabsTrigger value="questions">Sorular</TabsTrigger>
      </TabsList>

      <TabsContent value="description">

      <div
    className="text-sm text-gray-700"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
      </TabsContent>

      <TabsContent value="comments">
        <div className="mt-4">{comments}</div>
      </TabsContent>

      <TabsContent value="questions">
        <div className="mt-4">{questions}</div>
      </TabsContent>
    </Tabs>
  );
}
