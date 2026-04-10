
import React from 'react';
import { AnimatedText } from './AnimatedText';
import { useAuth } from './AuthContext';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const Header: React.FC = () => {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-legal-900 border-b border-legal-100 dark:border-legal-800 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.location.href = '/'}
        >
          <div className="w-10 h-10 bg-legal-900 dark:bg-legal-50 rounded flex items-center justify-center text-legal-50 dark:text-legal-900 font-serif font-bold text-2xl shadow-md border border-legal-800 dark:border-legal-100">
            §
          </div>
          <h1 className="text-2xl font-serif tracking-tight text-legal-900 dark:text-legal-50 flex items-center gap-2">
            <AnimatedText text="Legal Assistant" delayOffset={0.1} />
            <AnimatedText text="Workspace" className="text-legal-gold font-normal italic" delayOffset={0.6} />
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-legal-900/60 dark:text-legal-50/60 mr-4">
            <span className="uppercase tracking-widest text-xs">Secure Analysis</span>
            <span className="w-1 h-1 rounded-full bg-legal-gold"></span>
            <span className="uppercase tracking-widest text-xs">AI-Powered</span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-legal-900 dark:text-legal-50">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-legal-200 dark:border-legal-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-legal-100 dark:bg-legal-800 flex items-center justify-center border border-legal-200 dark:border-legal-700">
                    <UserIcon size={16} />
                  </div>
                )}
                <span className="hidden md:inline-block">{user.displayName || user.email}</span>
              </div>
              <button 
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-legal-900 dark:text-legal-50 hover:bg-legal-100 dark:hover:bg-legal-800 rounded transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline-block">Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="flex items-center gap-2 px-4 py-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 transition-colors text-sm font-medium shadow-sm"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
