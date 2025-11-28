import React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "../core/carousel";
import { cn } from "../../../lib/utils";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface LogosCarouselProps {
  logos?: Logo[];
  className?: string;
  imageClassName?: string;
}

const defaultLogos: Logo[] = [
  {
    id: "teknopark",
    description: "Teknopark İstanbul",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/teknoparklogo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "tanhukuk",
    description: "Tan Hukuk",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/tanhukuklogo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "monster",
    description: "Monster Notebook",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/monsterlogo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "marmara",
    description: "Marmara Üniversitesi",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/marmaraunilogo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "lenovo",
    description: "Lenovo",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/lenovologo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "kiralarsin",
    description: "Kiralarsin.com",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/kiralarsin.com_.png.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  },
  {
    id: "ikas",
    description: "İkas",
    image: "https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/ikaslogo.webp",
    className: "h-16 md:h-20 w-auto object-contain",
  }
];

const LogosCarousel = ({
  logos = defaultLogos,
  className,
  imageClassName
}: LogosCarouselProps) => {
  return (
    <div className={cn("relative overflow-hidden py-2 md:py-4", className)}>
      <div className="relative mx-auto flex items-center justify-center max-w-[1600px]">
        <Carousel
          opts={{
            loop: true,
            align: "center",
            skipSnaps: false,
            containScroll: "trimSnaps"
          }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 1,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              rootNode: (emblaRoot) => emblaRoot.parentElement as HTMLElement,
              direction: "rtl"
            })
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-8">
            {[...logos, ...logos].map((logo, index) => (
              <CarouselItem
                key={`${logo.id}-${index}`}
                className="pl-4 md:pl-8 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 min-w-0"
              >
                <div className="group relative flex items-center justify-center h-24 md:h-32 px-4">
                  {/* Logo Image */}
                  <img
                    src={logo.image}
                    alt={logo.description}
                    className={cn(
                      "relative opacity-60 transition-all duration-500 filter contrast-125 brightness-125",
                      logo.className,
                      imageClassName
                    )}
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export { LogosCarousel };