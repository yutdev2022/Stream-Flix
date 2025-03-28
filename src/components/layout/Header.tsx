import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Bell, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, user, logout } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/browse');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-red-600">StreamFlix</h1>
        </Link>

        {/* Navigation - Desktop */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-300 transition">Home</Link>
            <Link to="/browse" className="text-white hover:text-gray-300 transition">Browse</Link>
            {user && (
              <Link to="/watchlist" className="text-white hover:text-gray-300 transition">My List</Link>
            )}
          </nav>
        )}

        {/* Search and User Actions */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search titles..."
              className="bg-black/30 border-gray-700 text-white w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </form>

          {!isMobile && (
            <>
              <Button variant="ghost" size="icon" className="text-white">
                <Bell className="h-5 w-5" />
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="text-white border-white/30 hover:bg-white/10">
                  Sign In
                </Button>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-black/95 z-40 flex flex-col pt-20 px-6 transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {isMenuOpen && (
          <>
            <form onSubmit={handleSearch} className="relative mb-8">
              <Input
                type="search"
                placeholder="Search titles..."
                className="bg-black/30 border-gray-700 text-white w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
            <nav className="flex flex-col space-y-6 text-lg">
              <Link to="/" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/browse" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Browse</Link>
              
              {user ? (
                <>
                  <Link to="/watchlist" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>My List</Link>
                  <Link to="/profile" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button 
                    className="text-white hover:text-gray-300 transition text-left"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-white hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </>
        )}
      </div>
    </header>
  );
}