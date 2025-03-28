import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeaturedContent } from '@/components/content/FeaturedContent';
import { ContentCarousel } from '@/components/content/ContentCarousel';
import { useStore } from '@/lib/store';

const HomePage = () => {
  const { contents } = useStore();
  
  // Set dark mode for the entire app
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  // Get a random featured content
  const featuredContent = contents[Math.floor(Math.random() * contents.length)];
  
  // Filter contents by type and genre
  const movies = contents.filter(content => content.type === 'movie');
  const shows = contents.filter(content => content.type === 'show');
  const actionContents = contents.filter(content => content.genres.includes('Action'));
  const dramaContents = contents.filter(content => content.genres.includes('Drama'));
  const scifiContents = contents.filter(content => content.genres.includes('Sci-Fi'));
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Featured Content */}
        <FeaturedContent content={featuredContent} />
        
        {/* Content Carousels */}
        <div className="container mx-auto px-0 md:px-4 space-y-6 py-8">
          <ContentCarousel title="Trending Now" contents={contents} />
          <ContentCarousel title="Movies" contents={movies} />
          <ContentCarousel title="TV Shows" contents={shows} />
          <ContentCarousel title="Action" contents={actionContents} />
          <ContentCarousel title="Drama" contents={dramaContents} />
          <ContentCarousel title="Sci-Fi" contents={scifiContents} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;