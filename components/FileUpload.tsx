
import React from 'react';

interface FileUploadProps {
  fileName: string;
  filePreviewUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  playbookName: string;
  onPlaybookChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasFile: boolean;
}

const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ fileName, filePreviewUrl, onFileChange, playbookName, onPlaybookChange, onAnalyze, isLoading, hasFile }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Target Document Upload */}
        <label htmlFor="file-upload" className="relative cursor-pointer bg-legal-50 dark:bg-legal-900/50 hover:bg-legal-100 dark:hover:bg-legal-800/80 border border-dashed border-legal-300 dark:border-legal-700 hover:border-legal-gold dark:hover:border-legal-gold rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 text-center group h-full">
          {filePreviewUrl ? (
            <>
              <img src={filePreviewUrl} alt="Document preview" className="max-h-24 rounded mx-auto mb-3 border border-legal-200 dark:border-legal-700 object-contain shadow-sm"/>
              <span className="font-medium text-legal-900 dark:text-legal-50 break-all text-sm">{fileName}</span>
              <span className="text-xs text-legal-900/60 dark:text-legal-50/60 mt-1 group-hover:text-legal-gold transition-colors">Change Target Document</span>
            </>
          ) : fileName ? (
            <>
              <FileIcon className="w-10 h-10 text-legal-gold mb-3"/>
              <span className="font-medium text-legal-900 dark:text-legal-50 text-sm">{fileName}</span>
              <span className="text-xs text-legal-900/60 dark:text-legal-50/60 mt-1 group-hover:text-legal-gold transition-colors">Change Target Document</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-white dark:bg-legal-800 rounded-full shadow-sm border border-legal-100 dark:border-legal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                <UploadCloudIcon className="w-6 h-6 text-legal-gold"/>
              </div>
              <span className="font-serif font-medium text-legal-900 dark:text-legal-50 text-lg">Target Document</span>
              <span className="text-xs text-legal-900/60 dark:text-legal-50/60 mt-1">Required (PDF, TXT, Image)</span>
            </>
          )}
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept=".pdf,.txt,.md,.text,.jpg,.jpeg,.png,.webp" />
        </label>

        {/* Playbook Upload */}
        <label htmlFor="playbook-upload" className="relative cursor-pointer bg-legal-50 dark:bg-legal-900/50 hover:bg-legal-100 dark:hover:bg-legal-800/80 border border-dashed border-legal-300 dark:border-legal-700 hover:border-legal-gold dark:hover:border-legal-gold rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 text-center group h-full">
          {playbookName ? (
            <>
              <FileIcon className="w-10 h-10 text-legal-gold mb-3"/>
              <span className="font-medium text-legal-900 dark:text-legal-50 text-sm">{playbookName}</span>
              <span className="text-xs text-legal-900/60 dark:text-legal-50/60 mt-1 group-hover:text-legal-gold transition-colors">Change Playbook</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-white dark:bg-legal-800 rounded-full shadow-sm border border-legal-100 dark:border-legal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                <UploadCloudIcon className="w-6 h-6 text-legal-gold"/>
              </div>
              <span className="font-serif font-medium text-legal-900 dark:text-legal-50 text-lg">Playbook (Optional)</span>
              <span className="text-xs text-legal-900/60 dark:text-legal-50/60 mt-1">Cross-reference standard</span>
            </>
          )}
          <input id="playbook-upload" name="playbook-upload" type="file" className="sr-only" onChange={onPlaybookChange} accept=".pdf,.txt,.md,.text,.jpg,.jpeg,.png,.webp" />
        </label>
      </div>
      
      <button
        onClick={onAnalyze}
        disabled={isLoading || !hasFile}
        className="w-full flex items-center justify-center text-sm font-medium uppercase tracking-widest text-white bg-legal-900 hover:bg-legal-800 focus:outline-none focus:ring-2 focus:ring-legal-gold focus:ring-offset-2 dark:focus:ring-offset-legal-900 rounded px-6 py-4 transition-all duration-300 disabled:bg-legal-100 disabled:dark:bg-legal-800 disabled:text-legal-900/40 disabled:dark:text-legal-50/40 disabled:cursor-not-allowed shadow-md"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-legal-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Document...
          </>
        ) : (
          'Analyze Document'
        )}
      </button>
    </div>
  );
};
