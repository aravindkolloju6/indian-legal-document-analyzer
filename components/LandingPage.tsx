import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Zap, Lock, Users, Scale } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

interface LandingPageProps {
  onSelectPortal: (portal: 'client' | 'advocate') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal }) => {
  return (
    <motion.div 
      className="min-h-screen bg-legal-50 dark:bg-legal-900 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="max-w-5xl w-full space-y-16 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto bg-legal-900 dark:bg-legal-50 rounded-2xl flex items-center justify-center text-legal-50 dark:text-legal-900 font-serif font-bold text-4xl shadow-xl border border-legal-800 dark:border-legal-100"
          >
            §
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-legal-900 dark:text-legal-50">
            <AnimatedText text="Legal Assistant" delayOffset={0.3} />
            <br />
            <AnimatedText text="Workspace" className="text-legal-gold italic" delayOffset={0.8} />
          </h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xl text-legal-900/70 dark:text-legal-50/70 max-w-2xl mx-auto"
          >
            Empower your legal review process with advanced AI and connect with expert advocates for early justice at a fixed, negotiable charge.
          </motion.p>
        </div>

        {/* Portal Selection */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto"
        >
          {/* Client Portal Card */}
          <div 
            className="bg-white dark:bg-legal-800 p-8 rounded-3xl shadow-lg border border-legal-200 dark:border-legal-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center"
            onClick={() => onSelectPortal('client')}
          >
            <div className="w-16 h-16 bg-legal-100 dark:bg-legal-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-legal-900 dark:text-legal-50" />
            </div>
            <h3 className="text-2xl font-serif font-medium text-legal-900 dark:text-legal-50 mb-4">Client Portal</h3>
            <p className="text-legal-900/70 dark:text-legal-50/70 mb-8 flex-grow">
              Analyze your legal documents with AI, register your case, and find the right advocate for early justice.
            </p>
            <button className="px-6 py-3 bg-legal-900 text-white dark:bg-legal-50 dark:text-legal-900 rounded-full font-medium w-full group-hover:bg-legal-gold group-hover:text-white transition-colors">
              Enter as Client
            </button>
          </div>

          {/* Advocate Portal Card */}
          <div 
            className="bg-white dark:bg-legal-800 p-8 rounded-3xl shadow-lg border border-legal-200 dark:border-legal-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center"
            onClick={() => onSelectPortal('advocate')}
          >
            <div className="w-16 h-16 bg-legal-100 dark:bg-legal-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scale className="w-8 h-8 text-legal-900 dark:text-legal-50" />
            </div>
            <h3 className="text-2xl font-serif font-medium text-legal-900 dark:text-legal-50 mb-4">Advocate Portal</h3>
            <p className="text-legal-900/70 dark:text-legal-50/70 mb-8 flex-grow">
              Review top attention-needed cases, accept clients, and provide justice with transparent, negotiable pricing.
            </p>
            <button className="px-6 py-3 bg-legal-900 text-white dark:bg-legal-50 dark:text-legal-900 rounded-full font-medium w-full group-hover:bg-legal-gold group-hover:text-white transition-colors">
              Enter as Advocate
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
