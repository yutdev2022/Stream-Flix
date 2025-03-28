import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContentTable } from '@/components/admin/ContentTable';
import { UserTable } from '@/components/admin/UserTable';
import { ContentForm } from '@/components/admin/ContentForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Content</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Content</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new movie or TV show.
                  </DialogDescription>
                </DialogHeader>
                <ContentForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Content Library</h2>
                <ContentTable />
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
                <UserTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;