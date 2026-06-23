import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { PageLoader } from '../../components/Loader';

const MySwal = withReactContent(Swal);

export const UserDashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [charity, setCharity] = useState<any>(null);
  const [charityStats, setCharityStats] = useState<any>(null);
  const [winnings, setWinnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});

  const [editingScore, setEditingScore] = useState<any>(null);
  const [editValue, setEditValue] = useState('');
  const [editPlayedOn, setEditPlayedOn] = useState('');

  const totalWinnings = winnings.reduce((sum, w) => sum + (w.prizeAmount || 0), 0);

  // Score Entry State
  const [scoreValue, setScoreValue] = useState('');
  const [playedOn, setPlayedOn] = useState('');
  const [submittingScore, setSubmittingScore] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scoresRes, subRes, winningsRes, statsRes] = await Promise.all([
          api.get('/scores'),
          api.get('/subscriptions/me').catch(() => ({ data: null })),
          api.get('/winners/me').catch(() => ({ data: [] })),
          api.get('/charities/me/stats').catch(() => ({ data: null }))
        ]);
        
        setScores(scoresRes.data || []);
        setWinnings(winningsRes.data || []);
        
        if (subRes.data) {
          setSubscription(subRes.data);
        }

        if (statsRes.data && statsRes.data.charity) {
          setCharityStats(statsRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingScore(true);

    if (!scoreValue || !playedOn) {
      toast.error('Please enter a score and a date.');
      setSubmittingScore(false);
      return;
    }

    try {
      await api.post('/scores', {
        value: Number(scoreValue),
        playedOn
      });
      toast.success('Score verified and submitted successfully!');
      // Refresh scores
      const scoresRes = await api.get('/scores');
      setScores(scoresRes.data || []);
      setScoreValue(''); setPlayedOn('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit score');
    } finally {
      setSubmittingScore(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, winId: string) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({ ...prev, [winId]: e.target.files![0] }));
    }
  };

  const handleUploadProof = async (winId: string) => {
    const file = selectedFiles[winId];
    if (!file) return;

    try {
      setUploading(winId);
      const formData = new FormData();
      formData.append('proofImage', file);

      await api.post(`/winners/${winId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Proof uploaded successfully! Waiting for admin verification.');
      
      // Refresh winnings
      const winningsRes = await api.get('/winners/me');
      setWinnings(winningsRes.data || []);
      setSelectedFiles(prev => ({ ...prev, [winId]: null }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload proof. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteScore = async (id: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f766e',
      cancelButtonColor: '#d32f2f',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/scores/${id}`);
          const scoresRes = await api.get('/scores');
          setScores(scoresRes.data || []);
          toast.success('Score deleted');
        } catch (err) {
          toast.error('Failed to delete score.');
        }
      }
    });
  };

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;
    try {
      await api.put(`/scores/${editingScore._id}`, { value: Number(editValue), playedOn: editPlayedOn });
      const scoresRes = await api.get('/scores');
      setScores(scoresRes.data || []);
      setEditingScore(null);
      toast.success('Score updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update score.');
    }
  };

  if (loading) return <div className="ml-64 pt-32 flex justify-center"><PageLoader /></div>;

  return (
    <main className="ml-0 md:ml-64 pt-16 min-h-screen p-xl bg-background">
      <div className="max-w-7xl mx-auto space-y-xl">
        
        {/*  Hero Stats Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-t-4 border-momentum-orange-dark group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label-sm font-bold text-momentum-orange-dark uppercase tracking-wider">Upcoming Event</span>
              <span className="material-symbols-outlined text-momentum-orange-dark">calendar_today</span>
            </div>
            <h3 className="font-headline-sm text-on-surface">March 2026</h3>
            <p className="font-body-md text-subtle-gray mt-xs">Current Draw Cycle</p>
          </div>
          
          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-t-4 border-primary group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label-sm font-bold text-primary uppercase tracking-wider">Entries Status</span>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <h3 className="font-headline-sm text-on-surface">{scores.length}</h3>
              <span className="text-title-md text-subtle-gray">/ 5</span>
            </div>
            <p className="font-body-md text-subtle-gray mt-xs">Scores Entered this Period</p>
          </div>
          
          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-t-4 border-win-gold group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label-sm font-bold text-win-gold uppercase tracking-wider">Next Deadline</span>
              <span className="material-symbols-outlined text-win-gold">timer</span>
            </div>
            <h3 className="font-headline-sm text-on-surface">April 1, 2026</h3>
            <p className="font-body-md text-subtle-gray mt-xs">Next Draw Scheduled</p>
          </div>
        </div>

        {/*  Main Interactive Area  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/*  Left Column: Entry & Charity  */}
          <div className="lg:col-span-8 space-y-xl">
            
            {/*  Score Entry Module  */}
            <div className="bg-hero-blue-light/30 border border-hero-blue-light p-2xl rounded-xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2xl">
                  <div>
                    <h3 className="font-display text-headline-sm text-hero-blue-dark">Record Your Latest Score</h3>
                    <p className="text-body-md text-on-surface-variant">Enter your round results to qualify for the March draw.</p>
                  </div>
                  {scores.length >= 5 && (
                    <div className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold text-label-sm">
                      QUALIFIED
                    </div>
                  )}
                </div>
                
                <form className="space-y-lg" onSubmit={handleScoreSubmit}>
                  <div className="flex flex-col md:flex-row gap-xl items-end">
                    <div className="flex-1 space-y-xs">
                      <label className="text-label-sm font-bold text-hero-blue-dark">Stableford Points (1-45)</label>
                      <input 
                        value={scoreValue} 
                        onChange={e => setScoreValue(e.target.value)} 
                        required 
                        max="45" 
                        min="1" 
                        type="number" 
                        placeholder="e.g. 36"
                        className="w-full text-center font-bold text-title-md py-md px-lg bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 outline-none"
                      />
                    </div>
                    <div className="flex-1 space-y-xs">
                      <label className="text-label-sm font-bold text-hero-blue-dark">Round Date</label>
                      <div className="relative">
                        <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-subtle-gray">calendar_month</span>
                        <input value={playedOn} onChange={e => setPlayedOn(e.target.value)} required type="date" className="w-full pl-3xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary outline-none"/>
                      </div>
                    </div>
                    <button disabled={submittingScore} type="submit" className="w-full md:w-auto flex-1 bg-primary text-on-primary px-5xl py-md rounded-lg font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 h-[52px]">
                      {submittingScore ? 'Submitting...' : 'Submit Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/*  Recent Activity Table  */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="p-xl border-b border-light-mist flex justify-between items-center">
                <h3 className="font-title-md">Recent Score Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-light-mist">
                    <tr>
                      <th className="px-xl py-md text-label-sm font-bold text-subtle-gray uppercase tracking-wider">Date</th>
                      <th className="px-xl py-md text-label-sm font-bold text-subtle-gray uppercase tracking-wider">Score</th>
                      <th className="px-xl py-md text-label-sm font-bold text-subtle-gray uppercase tracking-wider">Status</th>
                      <th className="px-xl py-md text-label-sm font-bold text-subtle-gray uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-mist">
                    {scores.map((score: any, idx: number) => (
                      <tr key={idx} className="hover:bg-light-mist/50 transition-colors">
                        <td className="px-xl py-lg text-body-md font-medium">
                          {format(new Date(score.playedOn), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-xl py-lg">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container text-primary font-bold text-xs">
                            {score.value}
                          </span>
                        </td>
                        <td className="px-xl py-lg">
                          <span className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-impact-green-light text-impact-green-dark text-label-sm font-bold">
                            <span className="w-2 h-2 rounded-full bg-impact-green-dark"></span>
                            Verified
                          </span>
                        </td>
                        <td className="px-xl py-lg text-right">
                          <div className="flex items-center justify-end gap-sm">
                            <button 
                              onClick={() => {
                                setEditingScore(score);
                                setEditValue(score.value.toString());
                                setEditPlayedOn(score.playedOn.split('T')[0]);
                              }}
                              className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant text-subtle-gray hover:text-primary hover:border-primary flex items-center justify-center transition-colors" title="Edit">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteScore(score._id)}
                              className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant text-subtle-gray hover:text-alert-red hover:border-alert-red flex items-center justify-center transition-colors" title="Delete">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {scores.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-xl py-lg text-center text-subtle-gray">No recent scores.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*  Winnings & Claims Section  */}
            {winnings.length > 0 && (
              <div className="bg-win-gold-light/20 border-2 border-win-gold/40 rounded-xl shadow-sm overflow-hidden">
                <div className="p-xl border-b border-win-gold/20 flex justify-between items-center bg-win-gold-light/50">
                  <h3 className="font-title-md text-dark-slate flex items-center gap-sm">
                    <span className="material-symbols-outlined text-win-gold">trophy</span>
                    My Winnings & Claims
                  </h3>
                  <div className="text-right">
                    <p className="text-label-sm text-subtle-gray uppercase font-bold tracking-wider">Total Won</p>
                    <p className="text-headline-sm font-extrabold text-win-gold">${totalWinnings.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-xl space-y-lg">
                  {winnings.map((win: any) => (
                    <div key={win._id} className="bg-surface-container-lowest p-lg rounded-lg border border-outline-variant flex flex-col md:flex-row justify-between items-center gap-lg">
                      <div>
                        <p className="font-bold text-title-md text-primary">{win.matchType}-Number Match Winner!</p>
                        <p className="text-body-sm text-subtle-gray">Draw: {win.draw ? format(new Date(win.draw.drawMonth), 'MMMM yyyy') : 'Unknown'}</p>
                        <p className="text-body-md mt-sm">Prize Amount: <strong className="text-win-gold font-headline-sm">${win.prizeAmount?.toFixed(2)}</strong></p>
                      </div>
                      
                      <div className="flex-shrink-0 w-full md:w-auto bg-off-white p-md rounded-lg border border-light-mist text-center">
                        <div className="mb-sm">
                          <span className={`inline-flex items-center gap-xs px-md py-xs rounded-full text-label-sm font-bold ${
                            win.verificationStatus === 'verified' ? 'bg-impact-green-light text-impact-green-dark' :
                            win.verificationStatus === 'pending' ? 'bg-momentum-orange-light text-momentum-orange-dark' :
                            'bg-surface-container text-subtle-gray'
                          }`}>
                            {win.verificationStatus.toUpperCase()}
                          </span>
                        </div>
                        
                        {!win.proofUrl && (
                          <div className="space-y-sm">
                            <input 
                              type="file" 
                              id={`proof-${win._id}`}
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, win._id)}
                            />
                            <label htmlFor={`proof-${win._id}`} className="block w-full cursor-pointer px-lg py-sm border-2 border-primary border-dashed rounded-lg text-primary font-bold hover:bg-primary/5 transition-colors text-label-sm">
                              {selectedFiles[win._id] ? selectedFiles[win._id]?.name : 'Select Screenshot Proof'}
                            </label>
                            {selectedFiles[win._id] && (
                              <button 
                                onClick={() => handleUploadProof(win._id)}
                                disabled={uploading === win._id}
                                className="w-full bg-primary text-on-primary py-sm rounded-lg font-bold text-label-sm shadow-sm hover:bg-hero-blue-dark transition-colors">
                                {uploading === win._id ? 'Uploading...' : 'Submit Proof'}
                              </button>
                            )}
                          </div>
                        )}
                        {win.proofUrl && win.verificationStatus === 'pending' && (
                          <p className="text-body-sm text-subtle-gray mt-xs">Awaiting Admin Review</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/*  Right Column: Subscription & Spotlight  */}
          <div className="lg:col-span-4 space-y-xl">
            {/*  Subscription Status Card  */}
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-lg">
                <h4 className="font-title-md">Subscription</h4>
                <span className={`px-md py-xs rounded-full text-label-sm font-bold flex items-center gap-xs ${subscription?.status === 'active' ? 'bg-impact-green-light text-impact-green-dark' : 'bg-outline-variant text-charcoal'}`}>
                  <span className="material-symbols-outlined text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
                  {subscription?.status?.toUpperCase() || 'INACTIVE'}
                </span>
              </div>
              <div className="space-y-xs mb-xl">
                <p className="text-headline-sm font-extrabold text-on-surface">Premium {subscription?.plan || 'Plan'}</p>
                {subscription?.currentPeriodEnd && (
                  <p className="text-body-md text-subtle-gray">Renews {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}</p>
                )}
              </div>
            </div>

            {/*  Selected Charity Spotlight  */}
            {charityStats?.charity ? (
              <div className="bg-impact-green-light/20 border-l-4 border-impact-green-dark p-xl rounded-r-xl rounded-l-md shadow-sm relative group transition-all">
                <div className="flex items-center gap-lg mb-xl">
                  <div className="w-16 h-16 bg-surface-container-lowest rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-xs">
                    {charityStats.charity.imageUrl && <img className="w-full h-full object-contain" src={charityStats.charity.imageUrl} />}
                  </div>
                  <div>
                    <p className="text-label-sm font-bold text-impact-green-dark uppercase">Charity Spotlight</p>
                    <h4 className="font-title-md text-on-surface">{charityStats.charity.name}</h4>
                  </div>
                </div>
                <div className="bg-surface-container-lowest/80 p-md rounded-lg border border-impact-green-light mb-md">
                  <p className="text-body-md text-on-surface leading-snug">
                    <span className="font-bold text-impact-green-dark">{charityStats.contributionPct || 10}% of your subscription</span> contribution is currently being directed here.
                  </p>
                </div>
                <div className="bg-surface-container-lowest/80 p-md rounded-lg border border-impact-green-light flex justify-between items-center">
                  <span className="font-bold text-on-surface">Total Contributed:</span>
                  <span className="font-headline-sm text-impact-green-dark">${(charityStats.totalContributed || 0).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm text-center">
                <p className="text-on-surface-variant mb-md">No charity selected yet.</p>
                <a href="/charities" className="text-primary font-bold">Select a Charity</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Score Modal */}
      {editingScore && (
        <div className="fixed inset-0 bg-dark-slate/80 backdrop-blur-sm flex items-center justify-center z-50 p-xl">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2xl">
              <h3 className="font-headline-sm text-dark-slate mb-sm">Edit Score</h3>
              <p className="text-body-md text-on-surface-variant mb-xl">Update your score or date. Duplicate dates are not allowed.</p>
              
              <form onSubmit={handleUpdateScore} className="space-y-lg">
                <div className="space-y-xs">
                  <label className="text-label-sm font-bold text-hero-blue-dark">Points (1-45)</label>
                  <input 
                    value={editValue} 
                    onChange={e => setEditValue(e.target.value)} 
                    required 
                    max="45" 
                    min="1" 
                    type="number" 
                    className="w-full font-bold text-title-md py-md px-lg bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 outline-none"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-bold text-hero-blue-dark">Round Date</label>
                  <input 
                    value={editPlayedOn} 
                    onChange={e => setEditPlayedOn(e.target.value)} 
                    required 
                    type="date" 
                    className="w-full py-md px-lg bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 outline-none"
                  />
                </div>

                <div className="flex gap-md justify-end mt-xl pt-lg border-t border-light-mist">
                  <button 
                    type="button"
                    onClick={() => setEditingScore(null)}
                    className="px-xl py-md font-bold text-subtle-gray hover:text-dark-slate hover:bg-light-mist rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-xl py-md bg-primary text-on-primary rounded-lg font-bold shadow-md hover:bg-hero-blue-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};
