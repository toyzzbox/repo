'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailTabsProps {
  description: string;
  comments: React.ReactNode;
  questions: React.ReactNode;
}

export function ProductDetailTabs({ description, comments, questions }: ProductDetailTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full mt-6">
      <TabsList className="w-full flex justify-start border-b">
        <TabsTrigger value="description">Açıklama</TabsTrigger>
        <TabsTrigger value="comments">Yorumlar</TabsTrigger>
        <TabsTrigger value="questions">Sorular</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">{description}</div>
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
