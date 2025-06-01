import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Size nasıl yardımcı olabiliriz?</h1>
        <Input placeholder="Sorununuzu yazın... (örn. 'Siparişim nerede?')" className="w-full max-w-lg mx-auto" />
      </section>

      {/* Kategori Kartları */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Sipariş ve Kargo", href: "/yardim/siparis-ve-kargo" },
          { title: "Ödeme İşlemleri", href: "/yardim/odeme-islemleri" },
          { title: "İade & Değişim", href: "/yardim/iade-ve-degisim" },
          { title: "Hesap İşlemleri", href: "/yardim/hesap-islemleri" },
          { title: "Ürün Bilgileri", href: "/yardim/urun-bilgileri" },
          { title: "Destek Talebi Oluştur", href: "#form" },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="border rounded-xl p-5 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
          </Link>
        ))}
      </section>

      {/* SSS - Accordion */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Sık Sorulan Sorular</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Siparişimi nasıl takip ederim?</AccordionTrigger>
            <AccordionContent>
              Sipariş takip sayfasından kargo numaranız ile kolayca takip edebilirsiniz.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>İade süresi kaç gün?</AccordionTrigger>
            <AccordionContent>
              Teslimat tarihinden itibaren 14 gün içinde iade başvurusu yapabilirsiniz.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Kargom hasarlı geldi, ne yapmalıyım?</AccordionTrigger>
            <AccordionContent>
              Lütfen hasarın fotoğrafını çekip destek formunu doldurarak bize iletin.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Destek Formu */}
      <section id="form" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">Destek Talebi Oluştur</h2>
        <form className="space-y-4">
          <Input placeholder="Adınız Soyadınız" required />
          <Input type="email" placeholder="E-posta adresiniz" required />
          <Input placeholder="Konu" required />
          <Textarea placeholder="Mesajınız..." rows={4} required />
          <Button type="submit">Gönder</Button>
        </form>
      </section>

      {/* AI Destekli Alan (Mock) */}
      <section className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">🤖 Yapay Zeka Yardımcısı</h2>
        <p className="text-sm text-muted-foreground mb-2">
          AI destekli asistanımıza sorunuzu yazın, otomatik öneriler alın:
        </p>
        <Input placeholder="Örn: 'Siparişim neden gecikti?'" />
      </section>
    </div>
  );
}
