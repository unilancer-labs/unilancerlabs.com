import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "../../../lib/utils";
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react";
import { Button } from "./button";

type CarouselApi = EmblaCarouselType | undefined;
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        // 📌 Ekranda 4 kart için: lg'de 1/4 genişlik
        "md:basis-1/2 lg:basis-1/4 xl:basis-1/4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-10 w-10 rounded-full",
        "left-2 top-1/2 -translate-y-1/2",
        className,
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-10 w-10 rounded-full",
        "right-2 top-1/2 -translate-y-1/2",
        className,
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export interface Service {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-[280px] md:h-[340px] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white dark:bg-dark-light border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Background Gradient - Very Subtle */}
      <div className={cn(
        "absolute inset-0 opacity-[0.08] group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br",
        service.gradient
      )} />
      
      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
        {/* Title - Top Left */}
        <h3 className="text-[15px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-tight z-20 max-w-[80%]">
          {service.title}
        </h3>

        {/* Large Icon/Image - Center */}
        <div className="absolute inset-0 flex items-center justify-center pt-6 md:pt-8">
             <div className="relative w-full flex justify-center">
                {/* Glow effect behind icon */}
                <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 blur-[50px] md:blur-[60px] opacity-40 rounded-full bg-gradient-to-tr", service.gradient)} />
                
                <service.icon 
                  strokeWidth={1.5}
                  className="w-20 h-20 md:w-24 md:h-24 text-slate-800 dark:text-slate-200 relative z-10 drop-shadow-2xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500" 
                />
             </div>
        </div>

        {/* Details Button/Indicator */}
        <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-20">
            <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-slate-100 dark:border-white/5 shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                <span className="text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-white">İncele</span>
                <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-600 dark:text-slate-300 group-hover:text-white" />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ServiceCarousel = ({ services }: { services: Service[] }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
      <Carousel
        ref={ref}
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative"
      >
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.1 }}
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {services.map((service, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="h-full p-1">
                  <ServiceCard service={service} index={index} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-center gap-4 md:hidden">
          <CarouselPrevious className="static translate-y-0 border-slate-200 dark:border-white/10" />
          <CarouselNext className="static translate-y-0 border-slate-200 dark:border-white/10" />
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-slate-200 dark:border-white/10 bg-white/80 dark:bg-dark-light/80 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg" />
            <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-slate-200 dark:border-white/10 bg-white/80 dark:bg-dark-light/80 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg" />
        </div>
      </Carousel>
    </div>
  );
};
