import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Play, Plus, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContentCarousel } from '@/components/content/ContentCarousel';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';

const ContentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contents, addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  const [content, setContent] = useState<Content | null>(null);
  const [relatedContents, setRelatedContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inWatchlist = content ? isInWatchlist(content.id) : false;
  
  // Find the content and related contents
  useEffect(() => {
    if (!id) return;
    
    const foundContent = contents.find(c => c.id === id);
    
    if (foundContent) {
      setContent(foundContent);
      
      // Find related contents based on genres
      const related = contents
        .filter(c => 
          c.id !== id && 
          c.genres.some(genre => foundContent.genres.includes(genre))
        )
        .slice(0, 12);
      
      setRelatedContents(related);
    }
  }, [id, contents]);
  
  const handleWatchlistToggle = () => {
    if (!content) return;
    
    if (inWatchlist) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content.id);
    }
  };
  
  const handlePlay = () => {
    if (!content) return;
    setIsLoading(true);
    navigate(`/watch/${content.id}`);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (!content) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Content not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero section */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={content.thumbnailUrl} 
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
          
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-black/20 z-10"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          {/* Content details */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-16 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{content.title}</h1>
            
            <div className="flex items-center text-sm md:text-base space-x-4 mb-4">
              <span className="text-green-400 font-semibold">{content.rating.toFixed(1)} Rating</span>
              <span>{content.releaseYear}</span>
              <span>{content.type === 'movie' ? `${content.duration} min` : 'Series'}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {content.genres.map((genre) => (
                <span key={genre} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="text-white/80 text-sm md:text-base mb-8">
              {content.description}
            </p>
            
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
            </div>
          </div>
        </div>
        
        {/* Cast section */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="flex flex-wrap gap-4">
            {content.cast.map((actor) => (
              <div key={actor} className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm">{actor.charAt(0)}</span>
                </div>
                <span>{actor}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Related content */}
        {relatedContents.length > 0 && (
          <div className="container mx-auto px-0 md:px-4 py-8">
            <ContentCarousel title="More Like This" contents={relatedContents} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentDetailPage;