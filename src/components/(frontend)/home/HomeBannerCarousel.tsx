"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

interface MediaVariant {
  cdnUrl: string;
}

interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  placement: "HOME" | "CATEGORY";
  linkType: "NONE" | "PRODUCT" | "CATEGORY" | "BRAND" | "CUSTOM";
  linkUrl?: string;
  device: "ALL" | "DESKTOP" | "MOBILE";
  media: {
    variants: MediaVariant[];
  };
}

interface Props {
  banners: Banner[];
}

export default function HomeBannerCarousel({ banners }: Props) {
  const visibleBanners = banners.filter(
    (b) => b.placement === "HOME" && b.isActive !== false
  );

  if (!visibleBanners.length) return null;

  return (
    <div className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {visibleBanners.map((banner) => {
            const imageUrl = banner.media?.variants?.[0]?.cdnUrl;

            const content = (
              <div className="relative w-full h-[260px] md:h-[420px] overflow-hidden rounded-xl">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={banner.title || "banner"}
                    fill
                    className="object-contain"
                    priority
                  />
                )}

                {/* ✅ Overlay */}
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-6 md:px-16">
                  {banner.title && (
                    <h2 className="text-white text-2xl md:text-4xl font-bold">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-white mt-2 text-sm md:text-lg">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );

            if (banner.linkType !== "NONE" && banner.linkUrl) {
              return (
                <CarouselItem key={banner.id}>
                  <Link href={banner.linkUrl}>{content}</Link>
                </CarouselItem>
              );
            }

            return <CarouselItem key={banner.id}>{content}</CarouselItem>;
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
