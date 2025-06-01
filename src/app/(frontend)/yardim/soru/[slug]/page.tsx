import { notFound } from "next/navigation";

const helpArticles: Record<string, { title: string; content: string }> = {
  "siparis-takibi": {
    title: "Siparişimi nasıl takip ederim?",
    content:
      "Siparişiniz kargoya verildikten sonra tarafınıza bir takip numarası gönderilir. Bu numara ile kargo firması web sitesinden siparişinizi takip edebilirsiniz.",
  },
  "kargo-suresi": {
    title: "Kargom ne zaman gelir?",
    content:
      "Siparişler 1-3 iş günü içinde kargoya verilir. Yoğun dönemlerde bu süre uzayabilir.",
  },
  "kargo-iletisim": {
    title: "Kargo firması ile iletişim kuramıyorum.",
    content:
      "Kargo firması ile yaşadığınız sorunlar için bize ulaşın, gerekli yönlendirmeyi sağlayalım.",
  },
};

type Props = {
  params: { slug: string };
};

export default function HelpArticlePage({ params }: Props) {
  const article = helpArticles[params.slug];

  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-700 leading-7">{article.content}</p>
    </div>
  );
}
