import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Loader } from '../../components/Loader';

const MySwal = withReactContent(Swal);

export const DrawManagement = () => {
  const [logicType, setLogicType] = useState('random');
  const [algorithmicBias, setAlgorithmicBias] = useState('favor_frequent');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulatedDrawId, setSimulatedDrawId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draws, setDraws] = useState<any[]>([]);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const res = await api.get('/draws');
      setDraws(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/draws/simulate', { logicType, algorithmicBias });
      setSimulationResult(res.data.simulationResult);
      setSimulatedDrawId(res.data._id);
      toast.success('Simulation successful. Please review before publishing.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!simulatedDrawId) return;

    MySwal.fire({
      title: 'Are you absolutely sure?',
      text: "Publishing cannot be undone. Winners will be notified instantly.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, publish draw!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await api.post(`/draws/publish/${simulatedDrawId}`);
          toast.success('Draw published successfully!');
          setSimulationResult(null);
          setSimulatedDrawId(null);
          fetchDraws();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Publish failed');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Draw Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Run Monthly Draw</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Logic Type</label>
              <select 
                value={logicType} 
                onChange={e => setLogicType(e.target.value)}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
              >
                <option value="random">Pure Random (1-45)</option>
                <option value="algorithmic">Algorithmic (Score Weighted)</option>
              </select>
            </div>
            
            {logicType === 'algorithmic' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Algorithmic Bias</label>
                <select 
                  value={algorithmicBias} 
                  onChange={e => setAlgorithmicBias(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                >
                  <option value="favor_frequent">Favor Frequently Played Numbers</option>
                  <option value="favor_rare">Favor Rarely Played Numbers</option>
                </select>
              </div>
            )}
            
            <button 
              onClick={handleSimulate} 
              disabled={loading}
              className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-900 transition-colors disabled:opacity-50 flex justify-center items-center h-10"
            >
              {loading ? <Loader size="sm" /> : 'Run Simulation'}
            </button>
          </div>

          {simulationResult && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h3 className="font-bold text-lg mb-2">Simulation Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="text-slate-500">Winning Numbers:</span> <br/><span className="font-bold text-lg">{simulationResult.winningNumbers.join(', ')}</span></div>
                <div><span className="text-slate-500">Total Prize Pool:</span> <br/><span className="font-bold">₹{simulationResult.prizePoolTotal.toLocaleString()}</span></div>
                <div><span className="text-slate-500">5-Match Winners:</span> <br/><span className="font-bold">{simulationResult.matchCounts[5]}</span></div>
                <div><span className="text-slate-500">Next Rollover:</span> <br/><span className="font-bold">₹{simulationResult.nextRollover.toLocaleString()}</span></div>
              </div>
              <button 
                onClick={handlePublish}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 font-bold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center h-12"
              >
                {loading ? <Loader size="sm" /> : 'PUBLISH DRAW'}
              </button>
              <p className="text-xs text-red-500 mt-2 text-center">Warning: Publishing cannot be undone. Winners will be notified.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Past Draws</h2>
          <div className="overflow-y-auto max-h-[500px]">
            {draws.length === 0 ? <p className="text-slate-500">No published draws found.</p> : (
              <ul className="divide-y divide-slate-100">
                {draws.map(draw => (
                  <li key={draw._id} className="py-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{format(new Date(draw.drawMonth), 'MMMM yyyy')}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{draw.status}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Numbers: <span className="font-bold">{draw.winningNumbers.join(', ')}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Pool: ₹{draw.prizePoolTotal.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
