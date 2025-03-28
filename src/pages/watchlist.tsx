import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContentCard } from '@/components/content/ContentCard';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';

const WatchlistPage = () => {
  const { contents, watchlist } = useStore();
  const [watchlistContents, setWatchlistContents] = useState<Content[]>([]);
  
  // Get watchlist contents
  useEffect(() => {
    const items = contents.filter(content => 
      watchlist.some(item => item.contentId === content.id)
    );
    
    setWatchlistContents(items);
  }, [contents, watchlist]);
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {watchlistContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Your list is empty</h2>
              <p className="text-gray-400">
                Add movies and shows to your list to watch them later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-8">
              {watchlistContents.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WatchlistPage;