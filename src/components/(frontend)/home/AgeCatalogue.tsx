import Image from "next/image";

const AgeCatalogue = () => {
  const images = [
    "/0-1yas.jpg",
    "/1-3yas.jpg",
    "/3-5yas.jpg",
    "/5-8yas.jpg",
    "/8-13yas.jpg",
    "/13yas.jpg",
  ];

  return (
    <div className="overflow-x-auto pt-3">
      <div className="flex gap-3 w-fit px-2">
        {images.map((src, i) => (
          <div
            key={i}
            className="
              shrink-0 
              min-w-[48%]       // Mobilde 2 adet (%50-%2 padding)
              sm:min-w-[23%]    // Tablette yaklaşık 4 adet
              lg:min-w-[190px]  // Büyük ekranda sabit boyutta, hepsi sığabiliyorsa sığsın
            "
          >
            <Image
              src={src}
              width={190}
              height={190}
              alt={`Yaş grubu ${src}`}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeCatalogue;
