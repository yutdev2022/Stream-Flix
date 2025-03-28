import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Content, User, WatchHistoryItem, WatchlistItem } from './types';
import { mockContents } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

interface StoreState {
  user: User | null;
  contents: Content[];
  watchlist: WatchlistItem[];
  watchHistory: WatchHistoryItem[];
  currentContent: Content | null;
  searchQuery: string;
  selectedGenre: string | null;
  users: User[];
  
  // Actions
  setUser: (user: User | null) => void;
  setContents: (contents: Content[]) => void;
  setCurrentContent: (content: Content | null) => void;
  addToWatchlist: (contentId: string) => void;
  removeFromWatchlist: (contentId: string) => void;
  updateWatchHistory: (contentId: string, duration: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string | null) => void;
  isInWatchlist: (contentId: string) => boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  
  // Admin actions
  addContent: (content: Omit<Content, 'id'>) => void;
  updateContent: (id: string, content: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  getUsers: () => User[];
  deleteUser: (id: string) => void;
}

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@streamflix.com',
    role: 'admin' as const,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    role: 'user' as const,
    createdAt: new Date(),
  }
];

// Mock passwords (in a real app, these would be hashed and stored securely)
const mockPasswords: Record<string, string> = {
  'admin@streamflix.com': 'admin123',
  'user@example.com': 'password123'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      contents: mockContents,
      watchlist: [],
      watchHistory: [],
      currentContent: null,
      searchQuery: '',
      selectedGenre: null,
      users: mockUsers,
      
      setUser: (user) => set({ user }),
      setContents: (contents) => set({ contents }),
      setCurrentContent: (content) => set({ currentContent: content }),
      
      addToWatchlist: (contentId) => {
        const { watchlist } = get();
        if (!watchlist.some(item => item.contentId === contentId)) {
          set({ 
            watchlist: [...watchlist, { contentId, addedAt: new Date() }] 
          });
        }
      },
      
      removeFromWatchlist: (contentId) => {
        const { watchlist } = get();
        set({ 
          watchlist: watchlist.filter(item => item.contentId !== contentId) 
        });
      },
      
      updateWatchHistory: (contentId, duration) => {
        const { watchHistory } = get();
        const existingIndex = watchHistory.findIndex(item => item.contentId === contentId);
        
        if (existingIndex >= 0) {
          const updatedHistory = [...watchHistory];
          updatedHistory[existingIndex] = {
            contentId,
            watchedDuration: duration,
            lastWatched: new Date()
          };
          set({ watchHistory: updatedHistory });
        } else {
          set({
            watchHistory: [
              ...watchHistory,
              { contentId, watchedDuration: duration, lastWatched: new Date() }
            ]
          });
        }
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedGenre: (genre) => set({ selectedGenre: genre }),
      
      isInWatchlist: (contentId) => {
        return get().watchlist.some(item => item.contentId === contentId);
      },
      
      // Auth methods
      login: async (email, password) => {
        // In a real app, this would make an API call
        const { users } = get();
        const user = users.find(u => u.email === email);
        
        if (user && mockPasswords[email] === password) {
          set({ user });
          return user;
        }
        
        return null;
      },
      
      signup: async (name, email, password) => {
        // In a real app, this would make an API call
        const { users } = get();
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
          return null;
        }
        
        const newUser: User = {
          id: uuidv4(),
          name,
          email,
          role: 'user',
          createdAt: new Date()
        };
        
        // Add user and password
        mockPasswords[email] = password;
        const updatedUsers = [...users, newUser];
        
        set({ 
          users: updatedUsers,
          user: newUser
        });
        
        return newUser;
      },
      
      logout: () => {
        set({ user: null });
      },
      
      // Admin methods
      addContent: (contentData) => {
        const { contents } = get();
        const newContent: Content = {
          ...contentData,
          id: uuidv4()
        };
        
        set({ contents: [...contents, newContent] });
      },
      
      updateContent: (id, contentData) => {
        const { contents } = get();
        const contentIndex = contents.findIndex(c => c.id === id);
        
        if (contentIndex >= 0) {
          const updatedContents = [...contents];
          updatedContents[contentIndex] = {
            ...updatedContents[contentIndex],
            ...contentData
          };
          
          set({ contents: updatedContents });
        }
      },
      
      deleteContent: (id) => {
        const { contents } = get();
        set({ contents: contents.filter(c => c.id !== id) });
      },
      
      getUsers: () => {
        return get().users;
      },
      
      deleteUser: (id) => {
        const { users } = get();
        set({ users: users.filter(u => u.id !== id) });
      }
    }),
    {
      name: 'video-streaming-storage',
      partialize: (state) => ({ 
        watchlist: state.watchlist,
        watchHistory: state.watchHistory,
        user: state.user
      }),
    }
  )
);