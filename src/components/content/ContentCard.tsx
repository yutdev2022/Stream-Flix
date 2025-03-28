import { useState } from 'react';
import { Link } from 'react-router';
import { Play, Plus, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: Content;
  featured?: boolean;
}

export function ContentCard({ content, featured = false }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  
  const inWatchlist = isInWatchlist(content.id);
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content.id);
    }
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-md transition-all duration-300",
        featured ? "aspect-[16/8]" : "aspect-[2/3]",
        isHovered ? "scale-105 z-10 shadow-xl" : "scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/content/${content.id}`}>
        <img 
          src={content.thumbnailUrl} 
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100" />
        
        {/* Content info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-sm md:text-base truncate">{content.title}</h3>
          
          <div className="flex items-center text-xs space-x-2 mt-1">
            <span className="text-green-400">{content.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{content.releaseYear}</span>
            <span>•</span>
            <span>{content.type === 'movie' ? `${content.duration}m` : 'Series'}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {content.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        {/* Hover controls */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 bg-black/40 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button size="sm" variant="default" className="rounded-full bg-white text-black hover:bg-white/90">
            <Play className="h-4 w-4 fill-black" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full border-white/40 bg-black/30 hover:bg-black/50"
            onClick={handleWatchlistToggle}
          >
            {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full border-white/40 bg-black/30 hover:bg-black/50"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </Link>
    </div>
  );
}