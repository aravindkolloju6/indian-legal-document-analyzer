
import React from 'react';
import type { AnalysisResult } from '../types';
import { generateMemo } from '../utils/exportMemo';

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  fileName?: string;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const ThumbsUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" />
    <path d="M18.5 10V4.5a2.5 2.5 0 0 0-5 0V10l-4 8h11.5a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2z" />
  </svg>
);

const ThumbsDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2" />
    <path d="M5.5 14v5.5a2.5 2.5 0 0 0 5 0V14l4-8H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
  </svg>
);

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ListChecksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </svg>
);

const InitialState: React.FC = () => (
    <div className="text-center p-12 border border-dashed border-legal-300 dark:border-legal-700 rounded-2xl bg-white/50 dark:bg-legal-800/50">
        <h3 className="text-xl font-serif font-medium text-legal-900 dark:text-legal-400 mb-2">Analysis results will appear here.</h3>
        <p className="text-legal-900/60 dark:text-legal-50/60">Upload a document and click "Analyze" to begin.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700">
        <svg className="animate-spin h-10 w-10 text-legal-gold mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-serif font-semibold text-legal-900 dark:text-legal-50 mb-2">Analyzing Document...</h3>
        <p className="text-legal-900/60 dark:text-legal-50/60">This may take a few moments.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-start" role="alert">
        <AlertTriangleIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0"/>
        <div>
            <strong className="font-bold">An Error Occurred</strong>
            <p className="text-sm">{message}</p>
        </div>
    </div>
);

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, isLoading, error, fileName }) => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!result) return <InitialState />;

    if (!result.isLegalDocument) {
        return (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                    <AlertTriangleIcon className="w-6 h-6 mr-3"/>
                    <h2 className="text-xl font-bold">Not a Legal Document</h2>
                </div>
                <p>{result.reasoning || "The AI determined this is not a legal document."}</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Main Status & Summary */}
            <div className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700 p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-legal-100 dark:border-legal-700">
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircleIcon className="w-8 h-8 mr-4"/>
                        <div>
                            <h2 className="text-2xl font-serif font-medium text-legal-900 dark:text-legal-50">Legal Document Confirmed</h2>
                            {result.language && (
                                <span className="text-xs font-medium tracking-wider uppercase bg-legal-50 dark:bg-legal-900 text-legal-900 dark:text-legal-50 px-3 py-1 rounded border border-legal-200 dark:border-legal-700 mt-2 inline-block">
                                    Language: {result.language}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {result.riskLevel && (
                            <div className={`flex items-center px-5 py-2 rounded text-sm font-medium tracking-wide uppercase border ${
                                result.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500/30' :
                                result.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/30' :
                                'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-500/30'
                            }`}>
                                <ShieldIcon className="w-4 h-4 mr-2" />
                                Risk Level: {result.riskLevel}
                            </div>
                        )}
                        <button 
                            onClick={() => generateMemo(result, fileName || 'Document')}
                            className="flex items-center px-4 py-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 transition-colors text-sm font-medium shadow-sm"
                        >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Export Memo
                        </button>
                    </div>
                </div>

                {result.summary && (
                    <div className="mb-10">
                        <div className="flex items-center text-legal-900 dark:text-legal-50 mb-4">
                            <FileTextIcon className="w-5 h-5 mr-3 text-legal-gold" />
                            <h3 className="text-xl font-serif font-medium">Executive Summary</h3>
                        </div>
                        <p className="text-legal-900/80 dark:text-legal-50/80 leading-relaxed bg-legal-50/50 dark:bg-legal-900/30 p-6 rounded-xl border border-legal-100 dark:border-legal-700 text-base">
                            {result.summary}
                        </p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Pros Section */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                        <div className="flex items-center text-emerald-800 dark:text-emerald-400 mb-4">
                            <ThumbsUpIcon className="w-5 h-5 mr-3" />
                            <h3 className="text-lg font-serif font-medium">Strengths (Pros)</h3>
                        </div>
                        <ul className="space-y-3 list-disc list-outside ml-4 text-legal-900/80 dark:text-legal-50/80 text-sm leading-relaxed">
                            {result.pros && result.pros.length > 0 ? result.pros.map((pro, index) => (
                                <li key={`pro-${index}`} className="pl-1">{pro}</li>
                            )) : (
                                <li>No specific strengths were identified.</li>
                            )}
                        </ul>
                    </div>

                    {/* Cons Section */}
                    <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-500/10">
                        <div className="flex items-center text-rose-800 dark:text-rose-400 mb-4">
                            <ThumbsDownIcon className="w-5 h-5 mr-3" />
                            <h3 className="text-lg font-serif font-medium">Risks (Cons)</h3>
                        </div>
                        <ul className="space-y-3 list-disc list-outside ml-4 text-legal-900/80 dark:text-legal-50/80 text-sm leading-relaxed">
                            {result.cons && result.cons.length > 0 ? result.cons.map((con, index) => (
                                <li key={`con-${index}`} className="pl-1">{con}</li>
                            )) : (
                                <li>No specific risks were identified.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Clauses Breakdown Section */}
            {result.clauses && result.clauses.length > 0 && (
                <div className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700 p-8 md:p-10">
                    <div className="flex items-center text-legal-900 dark:text-legal-50 mb-8">
                        <FileTextIcon className="w-6 h-6 mr-3 text-legal-gold" />
                        <h3 className="text-2xl font-serif font-medium">Clause-by-Clause Breakdown</h3>
                    </div>
                    <div className="space-y-6">
                        {result.clauses.map((clause, index) => (
                            <div key={`clause-detail-${index}`} className={`p-6 rounded-xl border-l-4 border-y border-r border-legal-100 dark:border-legal-700 bg-legal-50/30 dark:bg-legal-900/20 ${
                                clause.riskLevel === 'High' ? 'border-l-rose-500' :
                                clause.riskLevel === 'Medium' ? 'border-l-amber-500' :
                                clause.riskLevel === 'Low' ? 'border-l-emerald-500' :
                                'border-l-legal-300'
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-medium text-legal-900 dark:text-legal-50 font-serif text-lg">Clause {index + 1}</h4>
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                        clause.riskLevel === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' :
                                        clause.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                        clause.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                        'bg-legal-200 text-legal-800 dark:bg-legal-700 dark:text-legal-300'
                                    }`}>
                                        {clause.riskLevel} Risk
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-legal-900/60 dark:text-legal-50/60 font-mono bg-white dark:bg-legal-800 p-4 rounded border border-legal-200 dark:border-legal-700">
                                        "{clause.originalText}"
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <strong className="text-sm text-legal-900 dark:text-legal-50 block mb-1">Analysis:</strong>
                                    <p className="text-sm text-legal-900/80 dark:text-legal-50/80 leading-relaxed">{clause.analysis}</p>
                                </div>
                                {clause.suggestedRewrite && (
                                    <div className="mt-4 pt-4 border-t border-legal-200 dark:border-legal-700">
                                        <strong className="text-sm text-legal-gold block mb-2">Suggested Rewrite:</strong>
                                        <p className="text-sm text-legal-900/90 dark:text-legal-50/90 leading-relaxed bg-legal-gold/10 p-4 rounded border border-legal-gold/20">
                                            {clause.suggestedRewrite}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Clauses Section (Fallback if no detailed clauses) */}
            {!result.clauses && result.keyClauses && result.keyClauses.length > 0 && (
                <div className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700 p-8 md:p-10">
                    <div className="flex items-center text-legal-900 dark:text-legal-50 mb-8">
                        <ShieldIcon className="w-6 h-6 mr-3 text-legal-gold" />
                        <h3 className="text-2xl font-serif font-medium">Key Legal Clauses</h3>
                    </div>
                    <div className="grid gap-4">
                        {result.keyClauses.map((clause, index) => (
                            <div key={`clause-${index}`} className="p-6 rounded-xl border border-legal-100 dark:border-legal-700 hover:border-legal-gold/50 transition-colors bg-legal-50/30 dark:bg-legal-900/20">
                                <h4 className="font-medium text-legal-900 dark:text-legal-50 mb-2 font-serif text-lg">{clause.name}</h4>
                                <p className="text-sm text-legal-900/70 dark:text-legal-50/70 leading-relaxed">{clause.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Next Steps Section */}
            {result.nextSteps && result.nextSteps.length > 0 && (
                <div className="bg-legal-900 dark:bg-legal-800 rounded-2xl shadow-sm p-8 md:p-10 border border-legal-800 dark:border-legal-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-legal-gold"></div>
                    <div className="flex items-center text-legal-50 mb-8">
                        <ListChecksIcon className="w-6 h-6 mr-3 text-legal-gold" />
                        <h3 className="text-2xl font-serif font-medium">Recommended Next Steps</h3>
                    </div>
                    <div className="grid gap-4">
                        {result.nextSteps.map((step, index) => (
                            <div key={`step-${index}`} className="flex items-start gap-4 bg-white/5 dark:bg-black/20 p-5 rounded-xl border border-white/10 dark:border-white/5">
                                <div className="w-6 h-6 rounded-full bg-legal-gold/20 text-legal-gold flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div>
                                <p className="text-legal-50/90 text-sm leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
