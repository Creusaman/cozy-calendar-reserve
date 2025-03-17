
import * as React from "react";
import { ChevronLeft, ChevronRight, Image, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  type: "image" | "video";
  src: string;
  thumbnail?: string;
}

interface RoomCarouselProps {
  media: MediaItem[];
  className?: string;
}

export function RoomCarousel({ media, className }: RoomCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (media[currentIndex].type === "video") {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  React.useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  return (
    <div className={cn("relative overflow-hidden group", className)}>
      <div className="relative w-full h-full rounded-t-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Image className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
        
        {media[currentIndex].type === "image" ? (
          <img
            src={media[currentIndex].src}
            alt={`Room image ${currentIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="relative w-full h-full">
            {!isPlaying && media[currentIndex].thumbnail && (
              <img
                src={media[currentIndex].thumbnail}
                alt={`Video thumbnail ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <video
              ref={videoRef}
              src={media[currentIndex].src}
              className={cn(
                "w-full h-full object-cover",
                !isPlaying ? "opacity-0" : "opacity-100"
              )}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
              >
                <div className="rounded-full bg-white/90 p-3 shadow-lg">
                  <Play className="h-8 w-8 text-primary fill-primary" />
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handlePrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
        {media.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              index === currentIndex
                ? "bg-white w-3"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
