import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScore, setNewScore] = useState({ value: '', playedOn: format(new Date(), 'yyyy-MM-dd') });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await api.get('/scores');
      setScores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/scores', newScore);
      fetchScores();
      setNewScore({ value: '', playedOn: format(new Date(), 'yyyy-MM-dd') });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add score');
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.fullName || user?.email}</h1>
        <p className="text-slate-600 mt-2">Manage your scores and track your impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add a Score</h2>
            <form onSubmit={handleAddScore} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Score (1-45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={newScore.value}
                  onChange={e => setNewScore({ ...newScore, value: e.target.value })}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Played</label>
                <input
                  type="date"
                  required
                  value={newScore.playedOn}
                  onChange={e => setNewScore({ ...newScore, playedOn: e.target.value })}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Recent Scores (Your Draw Ticket)</h2>
            {scores.length === 0 ? (
              <p className="text-slate-500">No scores recorded yet. Add 5 scores to enter the draw.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {scores.map(score => (
                  <li key={score._id} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Score: {score.value}</p>
                      <p className="text-sm text-slate-500">Played on {format(new Date(score.playedOn), 'PPP')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {scores.length === 5 && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                You have 5 scores and are ready for the next draw!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Impact</h2>
            <div className="text-sm text-slate-600 mb-4">
              Your subscription is actively funding your chosen charity.
            </div>
            <a href="/charities" className="text-primary hover:underline text-sm font-medium">Manage Charity Preferences &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
};
