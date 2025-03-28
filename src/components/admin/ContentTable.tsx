import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ContentForm } from './ContentForm';
import { useStore } from '@/lib/store';
import { Content } from '@/lib/types';
import { useNavigate } from 'react-router';

export function ContentTable() {
  const { contents, deleteContent } = useStore();
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    deleteContent(id);
  };
  
  const handleView = (id: string) => {
    navigate(`/content/${id}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <TableRow key={content.id}>
              <TableCell className="font-medium">{content.title}</TableCell>
              <TableCell>{content.type === 'movie' ? 'Movie' : 'TV Show'}</TableCell>
              <TableCell>{content.releaseYear}</TableCell>
              <TableCell>{content.rating.toFixed(1)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleView(content.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(content)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{content.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(content.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Make changes to the content details below.
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <ContentForm 
              content={selectedContent} 
              onSuccess={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}