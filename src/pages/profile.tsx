import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, watchHistory, watchlist, contents } = useStore();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Get recently watched content
  const recentlyWatched = watchHistory
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
    .slice(0, 5)
    .map(item => {
      const content = contents.find(c => c.id === item.contentId);
      return {
        ...item,
        content
      };
    })
    .filter(item => item.content);
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account Type</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
              </CardFooter>
            </Card>
            
            {/* Recently Watched */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Recently Watched</CardTitle>
                <CardDescription>Continue watching where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                {recentlyWatched.length > 0 ? (
                  <ul className="space-y-4">
                    {recentlyWatched.map(item => (
                      <li key={item.contentId} className="flex items-center gap-3">
                        <img 
                          src={item.content?.thumbnailUrl} 
                          alt={item.content?.title} 
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.content?.title}</p>
                          <p className="text-xs text-gray-400">
                            Watched {new Date(item.lastWatched).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/watch/${item.contentId}`)}
                        >
                          Resume
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">You haven't watched anything yet.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Watchlist Summary */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>My List</CardTitle>
                <CardDescription>Content saved to watch later</CardDescription>
              </CardHeader>
              <CardContent>
                {watchlist.length > 0 ? (
                  <div className="space-y-4">
                    <p className="font-medium">{watchlist.length} items in your list</p>
                    <div className="flex flex-wrap gap-2">
                      {watchlist.slice(0, 5).map(item => {
                        const content = contents.find(c => c.id === item.contentId);
                        return content ? (
                          <img 
                            key={item.contentId}
                            src={content.thumbnailUrl} 
                            alt={content.title} 
                            className="w-16 h-20 object-cover rounded"
                          />
                        ) : null;
                      })}
                      {watchlist.length > 5 && (
                        <div className="w-16 h-20 bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-sm">+{watchlist.length - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Your list is empty.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/watchlist')}>
                  View My List
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;