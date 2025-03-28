import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contents } = useStore();
  const [content, setContent] = useState<Content | null>(null);
  
  // Find the content
  useEffect(() => {
    if (!id) return;
    
    const foundContent = contents.find(c => c.id === id);
    
    if (foundContent) {
      setContent(foundContent);
    }
  }, [id, contents]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  useEffect(() => {
    // Set fullscreen mode for video
    document.documentElement.classList.add('overflow-hidden');
    
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, []);
  
  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <VideoPlayer content={content} onBack={handleBack} />
    </div>
  );
};

export default WatchPage;