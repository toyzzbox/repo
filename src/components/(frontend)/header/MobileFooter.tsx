import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Link from "next/link"
   
  export default function Mobile() {
    return (
  
                    <div> <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Tüm Kategoriler</AccordionTrigger>
       
          <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Oyuncaklar</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Anne & Bebek</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Spor & Outdoor</Link>  
            </div>
                 </AccordionContent>
                 
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Fırsatlar</Link>  
            </div>
                 </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Popüler Markalar</AccordionTrigger>
         
          <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Oyuncaklar</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Anne & Bebek</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Spor & Outdoor</Link>  
            </div>
                 </AccordionContent>
                 
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Fırsatlar</Link>  
            </div>
                 </AccordionContent>
        </AccordionItem>
     
        <AccordionItem value="item-3">
          <AccordionTrigger>Popüler Markalar</AccordionTrigger>
         
          <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Oyuncaklar</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Anne & Bebek</Link>  
            </div>
                 </AccordionContent>
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Spor & Outdoor</Link>  
            </div>
                 </AccordionContent>
                 
                 <AccordionContent>
          <div className="flex flex-col space-y-2 font-bold">
          <Link href="/">Fırsatlar</Link>  
            </div>
                 </AccordionContent>
        </AccordionItem>
      </Accordion>

     
        </div>
     
    )
  }