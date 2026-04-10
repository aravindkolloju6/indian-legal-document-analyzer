import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { Case } from '../types';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

export const ClientCases: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [proposedCharge, setProposedCharge] = useState<number | ''>('');

  const fetchCases = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'cases'),
        where('clientId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedCases: Case[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCases.push({ id: doc.id, ...doc.data() } as Case);
      });
      setCases(fetchedCases);
    } catch (err) {
      console.error("Error fetching cases:", err);
      setError("Failed to load your cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title || !description || proposedCharge === '') {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newCase = {
        clientId: user.uid,
        title,
        description,
        complexity,
        status: 'open',
        proposedCharge: Number(proposedCharge),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'cases'), newCase);
      
      // Update local state
      setCases([{ id: docRef.id, ...newCase, createdAt: new Date() } as Case, ...cases]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setComplexity('medium');
      setProposedCharge('');
      setShowForm(false);
    } catch (err) {
      console.error("Error adding case:", err);
      setError("Failed to register case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-legal-gold mx-auto mb-4" />
        <h3 className="text-xl font-serif text-legal-900 dark:text-legal-50">Please sign in to register a case</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-medium text-legal-900 dark:text-legal-50">Find My Advocate</h2>
          <p className="text-legal-900/60 dark:text-legal-50/60">Register your case to connect with expert advocates.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Register New Case
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-legal-800 p-6 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700 space-y-4">
          <h3 className="text-lg font-serif font-medium text-legal-900 dark:text-legal-50 mb-4">Case Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Case Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50"
              placeholder="e.g., Property Dispute Resolution"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50 h-32"
              placeholder="Describe your case in detail..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Complexity</label>
              <select 
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50"
              >
                <option value="low">Low (Standard documentation)</option>
                <option value="medium">Medium (Requires negotiation)</option>
                <option value="high">High (Complex litigation)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Proposed Charge ($)</label>
              <input 
                type="number" 
                value={proposedCharge}
                onChange={(e) => setProposedCharge(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50"
                placeholder="e.g., 500"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-legal-900 dark:text-legal-50 hover:bg-legal-100 dark:hover:bg-legal-800 rounded transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              Register Case
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-serif font-medium text-legal-900 dark:text-legal-50">Your Registered Cases</h3>
        
        {loading && !showForm ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-legal-gold" size={24} />
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-legal-800 rounded-2xl border border-legal-100 dark:border-legal-700 border-dashed">
            <p className="text-legal-900/60 dark:text-legal-50/60">You haven't registered any cases yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cases.map((c) => (
              <div key={c.id} className="bg-white dark:bg-legal-800 p-5 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-legal-900 dark:text-legal-50">{c.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    c.status === 'open' ? 'bg-blue-100 text-blue-800' :
                    c.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-legal-900/70 dark:text-legal-50/70 mb-4 line-clamp-2">{c.description}</p>
                <div className="flex gap-4 text-xs text-legal-900/50 dark:text-legal-50/50">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Complexity:</span> <span className="capitalize">{c.complexity}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Proposed Charge:</span> ${c.proposedCharge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
