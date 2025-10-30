import { useState } from "react";

interface GalleryProps {
  images: {
    src: string;
    alt: string;
    href?: string;
    title?: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const prevImage = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  return (
    <div className="relative w-full overflow-x-visible rounded-xl">
      <div className="w-full md:max-w-3xl bg-black/40 relative overflow-hidden rounded-xl border border-white/20 h-[20rem] md:h-[36rem] mx-0 md:mx-auto">
        {/* Imágenes */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {image.href ? (
              <a
                href={image.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </a>
            ) : (
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                <p className="text-lg font-bold">{image.title}</p>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-20 hover:bg-black/90 transition-colors border border-white/30"
          aria-label="Imagen anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-20 hover:bg-black/90 transition-colors border border-white/30"
          aria-label="Siguiente imagen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Dots de navegación */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === activeIndex ? "bg-green-500" : "bg-green-300/40"
            }`}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
