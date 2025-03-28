import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContentCard } from '@/components/content/ContentCard';
import { GenreFilter } from '@/components/content/GenreFilter';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';

const BrowsePage = () => {
  const { contents, searchQuery, selectedGenre, setSelectedGenre } = useStore();
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  
  // Filter contents based on search query and selected genre
  useEffect(() => {
    let filtered = [...contents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(query) || 
        content.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedGenre) {
      filtered = filtered.filter(content => 
        content.genres.includes(selectedGenre)
      );
    }
    
    setFilteredContents(filtered);
  }, [contents, searchQuery, selectedGenre]);
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Browse'}
          </h1>
          
          <GenreFilter 
            selectedGenre={selectedGenre} 
            onSelectGenre={setSelectedGenre} 
          />
          
          {filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No results found</h2>
              <p className="text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-8">
              {filteredContents.map(content => (
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

export default BrowsePage;