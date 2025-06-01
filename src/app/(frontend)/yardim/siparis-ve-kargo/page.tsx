import Link from "next/link";

const articles = [
  {
    title: "Siparişimi nasıl takip ederim?",
    slug: "siparis-takibi",
  },
  {
    title: "Kargom ne zaman gelir?",
    slug: "kargo-suresi",
  },
  {
    title: "Kargo firması ile iletişim kuramıyorum.",
    slug: "kargo-iletisim",
  },
];

export default function SiparisVeKargo() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Sipariş ve Kargo Yardımı</h1>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/yardim/soru/${article.slug}`}
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
