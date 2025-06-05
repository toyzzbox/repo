'use client';

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailTabsProps {
  descriptionHtml: string;
  comments: React.ReactNode;
  questions: React.ReactNode;
}

export function ProductDetailTabs({
  descriptionHtml,
  comments,
  questions,
}: ProductDetailTabsProps) {
  useEffect(() => {
    console.log("descriptionHtml:", descriptionHtml);
  }, [descriptionHtml]);

  return (
    <Tabs defaultValue="description" className="w-full mt-6">
      <TabsList className="w-full flex justify-start border-b">
        <TabsTrigger value="description">Açıklama</TabsTrigger>
        <TabsTrigger value="comments">Yorumlar</TabsTrigger>
        <TabsTrigger value="questions">Sorular</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div
          className="prose prose-sm max-w-none mt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
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
