import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allGenres } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

export function GenreFilter({ selectedGenre, onSelectGenre }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      <Button
        variant={selectedGenre === null ? "default" : "outline"}
        size="sm"
        className={cn(
          "rounded-full",
          selectedGenre === null ? "bg-primary" : "bg-black/20 border-white/20"
        )}
        onClick={() => onSelectGenre(null)}
      >
        {selectedGenre === null && <Check className="mr-1 h-4 w-4" />}
        All
      </Button>
      
      {allGenres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full",
            selectedGenre === genre ? "bg-primary" : "bg-black/20 border-white/20"
          )}
          onClick={() => onSelectGenre(genre)}
        >
          {selectedGenre === genre && <Check className="mr-1 h-4 w-4" />}
          {genre}
        </Button>
      ))}
    </div>
  );
}