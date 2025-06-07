'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDetailTabsProps {
  product: {
    description: string;
  };
  comments: React.ReactNode;
  questions: React.ReactNode;
}

export default function ProductDetailTabsMobile({
  product,
  comments,
  questions,
}: ProductDetailTabsProps) {
  return (
    <div className="block sm:hidden mt-6">
      <Accordion type="multiple">
        <AccordionItem value="description">
          <AccordionTrigger>Açıklama</AccordionTrigger>
          <AccordionContent>
  <div
    className="text-sm text-gray-700"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
</AccordionContent>
        </AccordionItem>

        <AccordionItem value="comments">
          <AccordionTrigger>Yorumlar</AccordionTrigger>
          <AccordionContent>{comments}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="questions">
          <AccordionTrigger>Sorular</AccordionTrigger>
          <AccordionContent>{questions}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
