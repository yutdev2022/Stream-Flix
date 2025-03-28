import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard } from './ContentCard';
import { Content } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ContentCarouselProps {
  title: string;
  contents: Content[];
  className?: string;
}

export function ContentCarousel({ title, contents, className }: ContentCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = current.clientWidth * 0.75;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (contents.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative py-4", className)}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white pl-4 md:pl-8">{title}</h2>
      
      <div className="group relative">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {/* Carousel container */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 md:gap-4 px-4 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {contents.map((content) => (
            <div 
              key={content.id} 
              className="flex-none w-[180px] md:w-[220px] snap-start"
            >
              <ContentCard content={content} />
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}