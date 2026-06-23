import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const DrawManagementInner = () => {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [logicType, setLogicType] = useState('algorithmic');
  const [algorithmicBias, setAlgorithmicBias] = useState('favor_frequent');

  const fetchDraws = async () => {
    try {
      const res = await api.get('/draws/admin');
      setDraws(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await api.post('/draws/simulate', { logicType, algorithmicBias });
      await fetchDraws();
      
      MySwal.fire({
        title: 'Simulation Complete!',
        text: 'The Monte Carlo simulation has finished successfully. Please review the results below.',
        icon: 'success',
        confirmButtonColor: '#0f766e'
      });
    } catch (err: any) {
      MySwal.fire({
        title: 'Simulation Failed',
        text: err.response?.data?.message || 'Failed to simulate draw.',
        icon: 'error',
        confirmButtonColor: '#0f766e'
      });
    } finally {
      setSimulating(false);
    }
  };

  const handlePublish = async (drawId: string) => {
    const result = await MySwal.fire({
      title: 'Are you absolutely sure?',
      text: "Publishing cannot be undone. Winners will be notified instantly.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, publish draw!'
    });
    
    if (!result.isConfirmed) return;

    setPublishingId(drawId);
    try {
      await api.post(`/draws/publish/${drawId}`);
      await fetchDraws();
      toast.success('Draw published successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish draw.');
    } finally {
      setPublishingId(null);
    }
  };

  const pendingDraw = draws.find(d => d.status === 'simulated');

  if (loading) return <div className="ml-64 pt-32 text-center">Loading Draw Management...</div>;

  return (
    <main className="ml-0 md:ml-64 pt-16 p-gutter min-h-screen">
      <div className="max-w-7xl mx-auto space-y-xl">
        {/*  Page Header  */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Draw Management</h2>
            <p className="text-on-surface-variant font-body-md">Configure and execute monthly prize distributions.</p>
          </div>
          <div className="flex gap-md">
            <button className="px-lg py-md border-2 border-primary text-primary rounded-lg font-label-sm hover:bg-hero-blue-light transition-all">
              Download Report
            </button>
          </div>
        </div>

        {/*  Dashboard Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/*  Current Draw Card (Priority)  */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-xl rounded-xl shadow-sm border-t-4 border-primary relative overflow-hidden">
            <div className="flex justify-between items-start mb-2xl">
              <div>
                <span className={`inline-flex items-center px-lg py-xs rounded-full font-label-sm uppercase tracking-wider mb-sm ${pendingDraw ? 'bg-impact-green-light text-impact-green-dark' : 'bg-momentum-orange-light text-momentum-orange-dark'}`}>
                  <span className="material-symbols-outlined text-[14px] mr-xs">pending</span>
                  {pendingDraw ? 'Ready to Publish' : 'Pending Simulation'}
                </span>
                <h3 className="font-headline-sm text-headline-sm">{format(new Date(), 'MMMM yyyy')} Distribution</h3>
                <p className="text-on-surface-variant font-body-md mt-xs">Total Pool: <span className="font-bold text-on-surface">${pendingDraw && pendingDraw.prizePoolTotal ? pendingDraw.prizePoolTotal.toLocaleString() : '---'}</span></p>
              </div>
            </div>

            {/*  Progress/Status Area  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-2xl">
              <div className="bg-light-mist p-md rounded-lg border border-outline-variant/30">
                <p className="text-label-sm text-subtle-gray mb-xs">Winning Sequence</p>
                <p className="font-title-md">{pendingDraw ? (pendingDraw.winningNumbers?.join('-') || '---') : '---'}</p>
              </div>
              <div className="bg-light-mist p-md rounded-lg border border-outline-variant/30">
                <p className="text-label-sm text-subtle-gray mb-xs">Status</p>
                <p className="font-title-md capitalize">{pendingDraw ? pendingDraw.status : 'Awaiting Sim'}</p>
              </div>
              <div className="bg-light-mist p-md rounded-lg border border-outline-variant/30">
                <p className="text-label-sm text-subtle-gray mb-xs">Draw Logic</p>
                <p className="font-title-md flex items-center gap-xs capitalize">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  {pendingDraw ? pendingDraw.logicType : 'Algorithmic'}
                </p>
              </div>
            </div>

            {pendingDraw && (
              <div className="mt-xl pt-xl pb-xl border-t border-outline-variant/30 mb-2xl">
                <h4 className="font-label-sm text-subtle-gray uppercase tracking-wider mb-md">Prize Pool Distribution Logic</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  <div className="bg-white p-md rounded-lg shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-sm text-on-surface-variant">5-Number Match</span>
                      <span className="px-sm py-xs bg-impact-green-light text-impact-green-dark rounded-md text-[10px] font-bold">40%</span>
                    </div>
                    <p className="font-title-md">\${pendingDraw.poolByTier?.fiveMatch?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</p>
                    <p className="text-[11px] text-subtle-gray mt-xs">Rollover: Yes (Jackpot)</p>
                    {pendingDraw.simulationResult?.matchCounts?.[5] === 0 && (
                      <p className="text-[11px] text-momentum-orange-dark mt-1 font-bold">Will rollover to next draw</p>
                    )}
                  </div>
                  <div className="bg-white p-md rounded-lg shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-sm text-on-surface-variant">4-Number Match</span>
                      <span className="px-sm py-xs bg-surface-container text-on-surface-variant rounded-md text-[10px] font-bold">35%</span>
                    </div>
                    <p className="font-title-md">\${pendingDraw.poolByTier?.fourMatch?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</p>
                    <p className="text-[11px] text-subtle-gray mt-xs">Rollover: No</p>
                  </div>
                  <div className="bg-white p-md rounded-lg shadow-sm border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-sm text-on-surface-variant">3-Number Match</span>
                      <span className="px-sm py-xs bg-surface-container text-on-surface-variant rounded-md text-[10px] font-bold">25%</span>
                    </div>
                    <p className="font-title-md">\${pendingDraw.poolByTier?.threeMatch?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</p>
                    <p className="text-[11px] text-subtle-gray mt-xs">Rollover: No</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-md">
              <button 
                onClick={handleSimulate}
                disabled={simulating}
                className="flex-1 bg-primary text-on-primary py-lg rounded-lg font-title-md flex items-center justify-center gap-md hover:bg-hero-blue-dark hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                {simulating ? 'Simulating...' : 'Run Simulation'}
              </button>
              
              <button 
                onClick={() => pendingDraw && handlePublish(pendingDraw._id)}
                disabled={!pendingDraw || publishingId === pendingDraw._id}
                className={`flex-1 py-lg rounded-lg font-title-md flex items-center justify-center gap-md transition-all duration-200 ${pendingDraw ? 'bg-impact-green-dark text-on-primary hover:scale-[1.02]' : 'bg-outline-variant text-charcoal cursor-not-allowed'}`}
              >
                <span className="material-symbols-outlined">publish</span>
                {publishingId === pendingDraw?._id ? 'Publishing...' : 'Publish Results'}
              </button>
            </div>
            
            {simulating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-md"></div>
                  <p className="font-title-md text-primary animate-pulse">Running Monte Carlo Simulation...</p>
                </div>
              </div>
            )}
          </div>

          {/*  Config Section  */}
          <div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-win-gold">
            <h3 className="font-title-md mb-xl flex items-center gap-md">
              <span className="material-symbols-outlined text-win-gold">tune</span>
              Draw Parameters
            </h3>
            <div className="space-y-xl">
              <div>
                <label className="font-label-sm text-on-surface uppercase tracking-wider block mb-md">Selection Logic</label>
                <div className="space-y-md">
                  <label className={`flex items-center p-md border-2 rounded-lg cursor-pointer transition-all group ${logicType === 'random' ? 'border-primary bg-hero-blue-light' : 'border-outline-variant hover:border-primary'}`}>
                    <input checked={logicType === 'random'} onChange={() => setLogicType('random')} className="hidden" name="logic" type="radio" value="random"/>
                    <div className={`mr-md w-5 h-5 rounded-full border-2 flex items-center justify-center ${logicType === 'random' ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                      {logicType === 'random' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-body-md font-semibold">Random generation</p>
                      <p className="text-body-sm text-on-surface-variant">Standard lottery-style draw</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-md border-2 rounded-lg cursor-pointer transition-all group ${logicType === 'algorithmic' ? 'border-primary bg-hero-blue-light' : 'border-outline-variant hover:border-primary'}`}>
                    <input checked={logicType === 'algorithmic'} onChange={() => setLogicType('algorithmic')} className="hidden" name="logic" type="radio" value="algorithmic"/>
                    <div className={`mr-md w-5 h-5 rounded-full border-2 flex items-center justify-center ${logicType === 'algorithmic' ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                      {logicType === 'algorithmic' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-body-md font-semibold">Impact Algorithmic</p>
                      <p className="text-body-sm text-on-surface-variant">Weighted by most/least frequent user scores.</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {logicType === 'algorithmic' && (
                <div>
                  <label className="font-label-sm text-on-surface uppercase tracking-wider block mb-md">Algorithmic Bias</label>
                  <select 
                    value={algorithmicBias} 
                    onChange={e => setAlgorithmicBias(e.target.value)}
                    className="w-full rounded-md border-outline-variant shadow-sm focus:border-primary focus:ring-primary p-3 border font-body-md bg-surface-container-lowest text-on-surface"
                  >
                    <option value="favor_frequent">Favor Frequently Played Numbers</option>
                    <option value="favor_rare">Favor Rarely Played Numbers</option>
                  </select>
                </div>
              )}
              
              <div className="p-md bg-win-gold-light rounded-lg border border-win-gold-muted/30">
                <p className="text-body-sm text-tertiary font-medium italic">
                  "Algorithmic logic currently optimizes for long-term donor retention."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*  Past Draws Section  */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="px-xl py-lg border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="font-title-md">Past Distributions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-light-mist">
                <tr>
                  <th className="px-xl py-md font-label-sm text-on-surface-variant uppercase">Period End</th>
                  <th className="px-xl py-md font-label-sm text-on-surface-variant uppercase">Winning Sequence</th>
                  <th className="px-xl py-md font-label-sm text-on-surface-variant uppercase">Total Pool</th>
                  <th className="px-xl py-md font-label-sm text-on-surface-variant uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {draws.map(draw => {
                  const dateValid = draw.drawMonth && !isNaN(new Date(draw.drawMonth).getTime());
                  return (
                  <tr key={draw._id} className="hover:bg-light-mist transition-colors group">
                    <td className="px-xl py-lg font-body-md font-medium">{dateValid ? format(new Date(draw.drawMonth), 'MMM dd, yyyy') : 'N/A'}</td>
                    <td className="px-xl py-lg">
                      <div className="flex gap-sm text-primary font-bold">
                        {draw.winningNumbers?.join(' - ') || 'N/A'}
                      </div>
                    </td>
                    <td className="px-xl py-lg font-bold">${draw.prizePoolTotal?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td className="px-xl py-lg">
                      <span className={`inline-flex items-center gap-xs px-md py-xs rounded-full text-[12px] font-bold ${draw.status === 'published' ? 'bg-impact-green-light text-impact-green-dark' : 'bg-momentum-orange-light text-momentum-orange-dark'}`}>
                        {(draw.status || 'UNKNOWN').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  );
                })}
                {draws.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-xl py-lg text-center text-subtle-gray">No draws found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 ml-0 md:ml-64 pt-32 bg-red-50 text-red-600 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">React Rendering Error in DrawManagement</h1>
          <pre className="bg-red-100 p-4 rounded whitespace-pre-wrap font-mono text-sm border border-red-300">
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export const DrawManagement = () => (
  <ErrorBoundary>
    <DrawManagementInner />
  </ErrorBoundary>
);
