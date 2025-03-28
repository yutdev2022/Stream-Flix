import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Play, Plus, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@/lib/types';
import { useStore } from '@/lib/store';

interface FeaturedContentProps {
  content: Content;
}

export function FeaturedContent({ content }: FeaturedContentProps) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const inWatchlist = isInWatchlist(content.id);
  
  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content.id);
    }
  };
  
  const handlePlay = () => {
    setIsLoading(true);
    navigate(`/watch/${content.id}`);
  };
  
  const handleMoreInfo = () => {
    navigate(`/content/${content.id}`);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src={content.thumbnailUrl} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-16 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{content.title}</h1>
        
        <div className="flex items-center text-sm md:text-base text-white/90 space-x-4 mb-4">
          <span className="text-green-400 font-semibold">{content.rating.toFixed(1)} Rating</span>
          <span>{content.releaseYear}</span>
          <span>{content.type === 'movie' ? `${content.duration} min` : 'Series'}</span>
        </div>
        
        <p className="text-white/80 text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-4">
          {content.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {content.genres.map((genre) => (
            <span key={genre} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90 gap-2"
            onClick={handlePlay}
            disabled={isLoading}
          >
            <Play className="h-5 w-5 fill-black" />
            {isLoading ? 'Loading...' : 'Play'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 bg-black/30 hover:bg-black/50 gap-2"
            onClick={handleWatchlistToggle}
          >
            {inWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {inWatchlist ? 'In My List' : 'Add to List'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 bg-black/30 hover:bg-black/50 gap-2"
            onClick={handleMoreInfo}
          >
            <Info className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}