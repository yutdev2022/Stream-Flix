import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { AuthForm } from '@/components/auth/AuthForm';
import { useStore } from '@/lib/store';

const SignupPage = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="p-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-red-600">StreamFlix</h1>
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Create an Account</h2>
          <AuthForm type="signup" />
        </div>
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignupPage;