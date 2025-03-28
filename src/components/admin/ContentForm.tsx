import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';
import { allGenres } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface ContentFormProps {
  content?: Content;
  onSuccess: () => void;
}

const contentSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  releaseYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5),
  duration: z.coerce.number().int().min(1, { message: 'Duration must be at least 1 minute' }),
  thumbnailUrl: z.string().url({ message: 'Please enter a valid URL' }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL' }),
  trailerUrl: z.string().url({ message: 'Please enter a valid URL' }),
  type: z.enum(['movie', 'show']),
  genres: z.array(z.string()).min(1, { message: 'Select at least one genre' }),
  castString: z.string().transform(val => val.split(',').map(item => item.trim()).filter(Boolean)),
  rating: z.coerce.number().min(0).max(5).step(0.1),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export function ContentForm({ content, onSuccess }: ContentFormProps) {
  const { addContent, updateContent } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: content ? {
      ...content,
      castString: content.cast.join(', ')
    } : {
      title: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      duration: 90,
      thumbnailUrl: '',
      videoUrl: '',
      trailerUrl: '',
      type: 'movie',
      genres: [],
      castString: '',
      rating: 4.0,
    },
  });
  
  const onSubmit = async (values: ContentFormValues) => {
    setIsLoading(true);
    try {
      // Extract cast from castString
      const { castString, ...restValues } = values;
      const contentData = {
        ...restValues,
        cast: castString
      };
      
      if (content) {
        updateContent(content.id, contentData);
        toast({
          title: 'Success',
          description: 'Content updated successfully.',
        });
      } else {
        addContent(contentData as Omit<Content, 'id'>);
        toast({
          title: 'Success',
          description: 'Content added successfully.',
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter description" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/video.mp4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="trailerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trailer URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/trailer.mp4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="show">TV Show</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="genres"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Genres</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allGenres.map((genre) => (
                  <FormField
                    key={genre}
                    control={form.control}
                    name="genres"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={genre}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(genre)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, genre])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== genre
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {genre}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="castString"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cast (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="Actor 1, Actor 2, Actor 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : content ? 'Update Content' : 'Add Content'}
        </Button>
      </form>
    </Form>
  );
}