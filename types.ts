
export interface ClauseAnalysis {
  originalText: string;
  riskLevel: 'High' | 'Medium' | 'Low' | 'Safe';
  analysis: string;
  suggestedRewrite?: string;
}

export interface AnalysisResult {
  isLegalDocument: boolean;
  summary?: string;
  pros?: string[];
  cons?: string[];
  keyClauses?: { name: string; description: string }[];
  riskLevel?: 'Low' | 'Medium' | 'High';
  nextSteps?: string[];
  language?: string;
  reasoning: string;
  extractedText?: string;
  clauses?: ClauseAnalysis[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface Case {
  id: string;
  clientId: string;
  title: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  status: 'open' | 'accepted' | 'closed';
  advocateId?: string;
  proposedCharge: number;
  createdAt: any; // Firestore Timestamp
}

export interface AdvocateProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  specialization?: string;
  points: number;
}

