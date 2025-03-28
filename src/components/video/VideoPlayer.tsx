import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Content } from '@/lib/types';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  content: Content;
  onBack: () => void;
}

export function VideoPlayer({ content, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { updateWatchHistory } = useStore();
  
  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      updateWatchHistory(content.id, video.currentTime);
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [content.id, updateWatchHistory]);
  
  // Handle controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
    };
    
    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [isPlaying, controlsTimeout]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };
  
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      ref={playerRef}
      className="relative w-full h-full bg-black"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full"
        poster={content.thumbnailUrl}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Controls overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-black/20"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <h2 className="ml-4 text-white text-lg font-medium">{content.title}</h2>
        </div>
        
        {/* Center play/pause button */}
        {!isPlaying && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={togglePlay}
            >
              <Play className="h-12 w-12 fill-white" />
            </Button>
          </div>
        )}
        
        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-black/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-black/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-black/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-black/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}