import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, serverTimestamp, setDoc, getDoc, addDoc, limit } from 'firebase/firestore';
import { Case, AdvocateProfile } from '../types';
import { Loader2, AlertCircle, CheckCircle, Clock, User, Award, List, Briefcase, Plus } from 'lucide-react';
import { Header } from './Header';
import { motion } from 'motion/react';

export const AdvocatePortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'open' | 'my-cases' | 'profile' | 'leaderboard'>('open');
  
  const [openCases, setOpenCases] = useState<Case[]>([]);
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [leaderboard, setLeaderboard] = useState<AdvocateProfile[]>([]);
  const [profile, setProfile] = useState<AdvocateProfile | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Profile Form
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch Profile
      const profileDoc = await getDoc(doc(db, 'advocate_profiles', user.uid));
      if (profileDoc.exists()) {
        const p = profileDoc.data() as AdvocateProfile;
        setProfile(p);
        setBio(p.bio || '');
        setSpecialization(p.specialization || '');
      }

      // Fetch Open Cases
      const openQ = query(collection(db, 'cases'), where('status', '==', 'open'), orderBy('createdAt', 'desc'));
      const openSnap = await getDocs(openQ);
      const fetchedOpen: Case[] = [];
      openSnap.forEach(d => fetchedOpen.push({ id: d.id, ...d.data() } as Case));
      const complexityOrder = { high: 3, medium: 2, low: 1 };
      fetchedOpen.sort((a, b) => complexityOrder[b.complexity] - complexityOrder[a.complexity]);
      setOpenCases(fetchedOpen);

      // Fetch My Cases
      const myQ = query(collection(db, 'cases'), where('advocateId', '==', user.uid), orderBy('createdAt', 'desc'));
      const mySnap = await getDocs(myQ);
      const fetchedMy: Case[] = [];
      mySnap.forEach(d => fetchedMy.push({ id: d.id, ...d.data() } as Case));
      setMyCases(fetchedMy);

      // Fetch Leaderboard
      const leadQ = query(collection(db, 'advocate_profiles'), orderBy('points', 'desc'), limit(5));
      const leadSnap = await getDocs(leadQ);
      const fetchedLead: AdvocateProfile[] = [];
      leadSnap.forEach(d => fetchedLead.push(d.data() as AdvocateProfile));
      setLeaderboard(fetchedLead);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load portal data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const profileData: AdvocateProfile = {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Advocate',
        photoURL: user.photoURL || '',
        bio,
        specialization,
        points: profile?.points || 0
      };
      await setDoc(doc(db, 'advocate_profiles', user.uid), profileData);
      setProfile(profileData);
      setError(null);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAcceptCase = async (caseId: string) => {
    if (!user) return;
    setActionId(caseId);
    try {
      const caseRef = doc(db, 'cases', caseId);
      await updateDoc(caseRef, {
        status: 'accepted',
        advocateId: user.uid
      });
      await fetchData();
    } catch (err) {
      console.error("Error accepting case:", err);
      setError("Failed to accept case.");
    } finally {
      setActionId(null);
    }
  };

  const handleSolveCase = async (caseId: string) => {
    if (!user) return;
    setActionId(caseId);
    try {
      const caseRef = doc(db, 'cases', caseId);
      await updateDoc(caseRef, {
        status: 'closed'
      });
      
      // Award points
      const currentPoints = profile?.points || 0;
      const newPoints = currentPoints + 10;
      
      const profileData: AdvocateProfile = {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Advocate',
        photoURL: user.photoURL || '',
        bio: profile?.bio || '',
        specialization: profile?.specialization || '',
        points: newPoints
      };
      await setDoc(doc(db, 'advocate_profiles', user.uid), profileData);
      
      await fetchData();
    } catch (err) {
      console.error("Error solving case:", err);
      setError("Failed to mark case as solved.");
    } finally {
      setActionId(null);
    }
  };

  const loadSampleCases = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const samples = [
        { title: 'Corporate Merger Dispute', description: 'Dispute over asset valuation during merger.', complexity: 'high', proposedCharge: 5000 },
        { title: 'Tenant Eviction Notice', description: 'Landlord seeking to evict tenant for non-payment.', complexity: 'low', proposedCharge: 300 },
        { title: 'Intellectual Property Theft', description: 'Former employee stole proprietary code.', complexity: 'high', proposedCharge: 8000 },
        { title: 'Contract Breach', description: 'Vendor failed to deliver goods on time.', complexity: 'medium', proposedCharge: 1500 }
      ];
      
      for (const s of samples) {
        await addDoc(collection(db, 'cases'), {
          ...s,
          clientId: user.uid, // Using own UID as dummy client to satisfy rules
          status: 'open',
          createdAt: serverTimestamp()
        });
      }
      await fetchData();
    } catch (err) {
      console.error("Error loading samples:", err);
      setError("Failed to load sample cases.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-legal-50 text-legal-900 dark:bg-legal-900 dark:text-legal-50 font-sans selection:bg-legal-gold/30 selection:text-legal-900"
    >
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="bg-white dark:bg-legal-800 rounded-2xl shadow-sm border border-legal-100 dark:border-legal-800 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-900 via-legal-gold to-legal-900 dark:from-legal-50 dark:via-legal-gold dark:to-legal-50"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-medium tracking-tight mb-2 text-legal-900 dark:text-legal-50">
                  Advocate Portal
                </h2>
                <p className="text-legal-900/60 dark:text-legal-50/60 text-base">
                  Accept cases, solve them to earn points, and climb the leaderboard.
                </p>
              </div>
              {user && (
                <div className="flex items-center gap-2 bg-legal-50 dark:bg-legal-900 px-4 py-2 rounded-full border border-legal-200 dark:border-legal-700">
                  <Award className="text-legal-gold" size={20} />
                  <span className="font-medium">{profile?.points || 0} Points</span>
                </div>
              )}
            </div>

            {!user ? (
              <div className="text-center py-12 bg-legal-50 dark:bg-legal-900 rounded-xl border border-legal-100 dark:border-legal-700">
                <AlertCircle className="w-12 h-12 text-legal-gold mx-auto mb-4" />
                <h3 className="text-xl font-serif text-legal-900 dark:text-legal-50">Please sign in to view cases</h3>
              </div>
            ) : (
              <>
                <div className="flex overflow-x-auto gap-2 mb-8 border-b border-legal-200 dark:border-legal-700 pb-2">
                  <button onClick={() => setActiveTab('open')} className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg whitespace-nowrap ${activeTab === 'open' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}>
                    <List size={18} /> Open Cases
                  </button>
                  <button onClick={() => setActiveTab('my-cases')} className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg whitespace-nowrap ${activeTab === 'my-cases' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}>
                    <Briefcase size={18} /> My Accepted Cases
                  </button>
                  <button onClick={() => setActiveTab('leaderboard')} className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg whitespace-nowrap ${activeTab === 'leaderboard' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}>
                    <Award size={18} /> Top Solvers
                  </button>
                  <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors rounded-t-lg whitespace-nowrap ${activeTab === 'profile' ? 'text-legal-900 dark:text-legal-50 border-b-2 border-legal-gold' : 'text-legal-900/60 dark:text-legal-50/60 hover:text-legal-900 dark:hover:text-legal-50'}`}>
                    <User size={18} /> My Profile
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm mb-6">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-legal-gold" size={32} />
                  </div>
                ) : (
                  <>
                    {/* OPEN CASES TAB */}
                    {activeTab === 'open' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-serif font-medium">Available Cases</h3>
                          <button onClick={loadSampleCases} className="flex items-center gap-2 px-3 py-1.5 bg-legal-100 dark:bg-legal-800 text-legal-900 dark:text-legal-50 rounded text-xs font-medium hover:bg-legal-200 dark:hover:bg-legal-700 transition-colors">
                            <Plus size={14} /> Add Sample Cases
                          </button>
                        </div>
                        {openCases.length === 0 ? (
                          <div className="text-center py-12 bg-legal-50 dark:bg-legal-900 rounded-xl border border-legal-100 dark:border-legal-700 border-dashed">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-serif text-legal-900 dark:text-legal-50 mb-2">No Open Cases</h3>
                            <p className="text-legal-900/60 dark:text-legal-50/60">There are currently no open cases waiting for an advocate.</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {openCases.map((c) => (
                              <div key={c.id} className="bg-white dark:bg-legal-900 p-6 rounded-2xl shadow-sm border border-legal-200 dark:border-legal-700 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-xl font-serif font-medium text-legal-900 dark:text-legal-50">{c.title}</h4>
                                      {c.complexity === 'high' && (
                                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-800 flex items-center gap-1">
                                          <AlertCircle size={12} /> Top Attention Needed
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex gap-4 text-xs text-legal-900/60 dark:text-legal-50/60">
                                      <span className="flex items-center gap-1">
                                        <Clock size={14} /> Registered recently
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">Complexity:</span> <span className="capitalize">{c.complexity}</span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-serif font-medium text-legal-gold">${c.proposedCharge}</div>
                                    <div className="text-xs text-legal-900/50 dark:text-legal-50/50">Proposed Charge</div>
                                  </div>
                                </div>
                                <p className="text-legal-900/80 dark:text-legal-50/80 mb-6 leading-relaxed bg-legal-50 dark:bg-legal-800 p-4 rounded-xl border border-legal-100 dark:border-legal-700">
                                  {c.description}
                                </p>
                                <div className="flex justify-end">
                                  <button 
                                    onClick={() => handleAcceptCase(c.id)}
                                    disabled={actionId === c.id || !profile}
                                    title={!profile ? "Please update your profile first" : ""}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-legal-900 text-legal-gold rounded-full hover:bg-legal-800 transition-colors text-sm font-medium disabled:opacity-50"
                                  >
                                    {actionId === c.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                    Accept Case
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* MY CASES TAB */}
                    {activeTab === 'my-cases' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-serif font-medium">My Accepted Cases</h3>
                        {myCases.length === 0 ? (
                          <div className="text-center py-12 bg-legal-50 dark:bg-legal-900 rounded-xl border border-legal-100 dark:border-legal-700 border-dashed">
                            <p className="text-legal-900/60 dark:text-legal-50/60">You haven't accepted any cases yet.</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {myCases.map((c) => (
                              <div key={c.id} className="bg-white dark:bg-legal-900 p-6 rounded-2xl shadow-sm border border-legal-200 dark:border-legal-700">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="text-xl font-serif font-medium text-legal-900 dark:text-legal-50 mb-1">{c.title}</h4>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${c.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                      {c.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="text-right font-medium text-legal-gold">${c.proposedCharge}</div>
                                </div>
                                <p className="text-sm text-legal-900/70 dark:text-legal-50/70 mb-4">{c.description}</p>
                                {c.status === 'accepted' && (
                                  <div className="flex justify-end">
                                    <button 
                                      onClick={() => handleSolveCase(c.id)}
                                      disabled={actionId === c.id}
                                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                      {actionId === c.id ? <Loader2 className="animate-spin" size={16} /> : <Award size={16} />}
                                      Mark as Solved (+10 pts)
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* LEADERBOARD TAB */}
                    {activeTab === 'leaderboard' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-serif font-medium">Top Solvers</h3>
                        <div className="bg-legal-50 dark:bg-legal-900 rounded-xl border border-legal-200 dark:border-legal-700 overflow-hidden">
                          {leaderboard.map((adv, idx) => (
                            <div key={adv.uid} className="flex items-center gap-4 p-4 border-b border-legal-200 dark:border-legal-700 last:border-0">
                              <div className="w-8 text-center font-serif font-bold text-legal-900/40 dark:text-legal-50/40 text-xl">#{idx + 1}</div>
                              {adv.photoURL ? (
                                <img src={adv.photoURL} alt="Profile" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-legal-200 dark:bg-legal-800 flex items-center justify-center">
                                  <User size={20} className="text-legal-900/50 dark:text-legal-50/50" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-legal-900 dark:text-legal-50">{adv.displayName}</div>
                                <div className="text-xs text-legal-900/60 dark:text-legal-50/60">{adv.specialization || 'Advocate'}</div>
                              </div>
                              <div className="flex items-center gap-1 text-legal-gold font-bold">
                                <Award size={18} /> {adv.points}
                              </div>
                            </div>
                          ))}
                          {leaderboard.length === 0 && (
                            <div className="p-8 text-center text-legal-900/60 dark:text-legal-50/60">No advocates on the leaderboard yet.</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                      <div className="max-w-2xl">
                        <h3 className="text-lg font-serif font-medium mb-6">Advocate Profile</h3>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Specialization</label>
                            <input 
                              type="text" 
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50"
                              placeholder="e.g., Corporate Law, Family Law"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-legal-900/70 dark:text-legal-50/70 mb-1">Biography</label>
                            <textarea 
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              className="w-full p-2 border border-legal-200 dark:border-legal-700 rounded bg-transparent text-legal-900 dark:text-legal-50 h-32"
                              placeholder="Tell clients about your experience..."
                            />
                          </div>
                          <div className="pt-4">
                            <button 
                              type="submit"
                              disabled={savingProfile}
                              className="flex items-center gap-2 px-6 py-2 bg-legal-900 text-legal-gold rounded hover:bg-legal-800 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              {savingProfile ? <Loader2 className="animate-spin" size={16} /> : null}
                              Save Profile
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};
