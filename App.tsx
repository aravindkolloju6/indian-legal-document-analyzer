
import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { ChatBot } from './components/ChatBot';
import { AnimatedText } from './components/AnimatedText';
import { LandingPage } from './components/LandingPage';
import { ClientCases } from './components/ClientCases';
import { AdvocatePortal } from './components/AdvocatePortal';
import { analyzeDocument } from './services/geminiService';
import type { AnalysisResult } from './types';
import { FileText, Users } from 'lucide-react';

const App: React.FC = () => {
  const [portal, setPortal] = useState<'landing' | 'client' | 'advocate'>('landing');
  const [clientTab, setClientTab] = useState<'analysis' | 'cases'>('analysis');
  
  const [documentText, setDocumentText] = useState<string>('');
  const [documentFile, setDocumentFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const [playbookText, setPlaybookText] = useState<string>('');
  const [playbookFile, setPlaybookFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [playbookName, setPlaybookName] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAnalysisResult(null);
      setError(null);
      setDocumentText('');
      setDocumentFile(null);
      setFilePreviewUrl(null);

      const reader = new FileReader();
      const resetState = () => {
        setError('Failed to read the target document. Please try again.');
        setFileName('');
        setDocumentText('');
        setDocumentFile(null);
        setFilePreviewUrl(null);
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (!dataUrl) {
            resetState();
            return;
          }
          if (file.type.startsWith('image/')) {
            setFilePreviewUrl(dataUrl);
          }
          const base64Data = dataUrl.split(',')[1];
          setDocumentFile({ data: base64Data, mimeType: file.type });
        };
        reader.onerror = resetState;
        reader.readAsDataURL(file);
      } else {
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setDocumentText(text);
        };
        reader.onerror = resetState;
        reader.readAsText(file);
      }
    }
  };

  const handlePlaybookChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaybookName(file.name);
      setPlaybookText('');
      setPlaybookFile(null);

      const reader = new FileReader();
      const resetState = () => {
        setError('Failed to read the playbook file. Please try again.');
        setPlaybookName('');
        setPlaybookText('');
        setPlaybookFile(null);
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (!dataUrl) {
            resetState();
            return;
          }
          const base64Data = dataUrl.split(',')[1];
          setPlaybookFile({ data: base64Data, mimeType: file.type });
        };
        reader.onerror = resetState;
        reader.readAsDataURL(file);
      } else {
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setPlaybookText(text);
        };
        reader.onerror = resetState;
        reader.readAsText(file);
      }
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!documentText && !documentFile) {
      setError('Please upload a target document first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeDocument({ 
        documentText, 
        documentFile,
        playbookText: playbookText || null,
        playbookFile: playbookFile || null
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. The document might be too large or the API service is currently unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [documentText, documentFile, playbookText, playbookFile]);

  return (
    <AnimatePresence mode="wait">
      {portal === 'landing' ? (
        <LandingPage key="landing" onSelectPortal={setPortal} />
      ) : portal === 'advocate' ? (
        <AdvocatePortal key="advocate" />
      ) : (
        <motion.div 
          key="client-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-legal-50 text-legal-900 dark:bg-legal-900 dark:text-legal-50 font-sans selection:bg-legal-gold/30 selection:text-legal-900"
        >
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex gap-4 mb-8 border-b border-legal-200 dark:border-legal-700 pb-2">
              <button 
                onClick={() => setClientTab('analysis')}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg ${clientTab === 'analysis' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}
              >
                <FileText size={18} />
                Document Analysis
              </button>
              <button 
                onClick={() => setClientTab('cases')}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg ${clientTab === 'cases' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}
              >
                <Users size={18} />
                Find My Advocate
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                {clientTab === 'analysis' ? (
                  <>
                    <section className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-800 p-8 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-900 via-legal-gold to-legal-900 dark:from-legal-50 dark:via-legal-gold dark:to-legal-50"></div>
                      <h2 className="text-3xl font-serif font-medium tracking-tight mb-3 text-legal-900 dark:text-legal-50">
                        <AnimatedText text="Document Analysis" delayOffset={0.2} />
                      </h2>
                      <p className="text-legal-900/60 dark:text-legal-50/60 mb-8 text-base">Upload a legal document (PDF, Image, or Text) for an AI-powered comprehensive review.</p>
                      <FileUpload
                        fileName={fileName}
                        filePreviewUrl={filePreviewUrl}
                        onFileChange={handleFileChange}
                        playbookName={playbookName}
                        onPlaybookChange={handlePlaybookChange}
                        onAnalyze={handleAnalyze}
                        isLoading={isLoading}
                        hasFile={!!documentText || !!documentFile}
                      />
                    </section>

                    <section>
                      <AnalysisResultDisplay
                        result={analysisResult}
                        isLoading={isLoading}
                        error={error}
                      />
                    </section>
                  </>
                ) : (
                  <section className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-800 p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-900 via-legal-gold to-legal-900 dark:from-legal-50 dark:via-legal-gold dark:to-legal-50"></div>
                    <ClientCases />
                  </section>
                )}
              </div>
            </div>
          </main>

          <ChatBot documentContext={analysisResult?.extractedText || documentText || (documentFile ? `Document uploaded: ${fileName}` : undefined)} />

          <footer className="text-center p-4 mt-8 text-sm text-legal-900/50 dark:text-legal-50/50">
            <p>Disclaimer: This is an AI-generated analysis and should not be considered legal advice. Always consult with a qualified legal professional.</p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
