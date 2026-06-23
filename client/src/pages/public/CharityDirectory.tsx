import { useEffect, useState } from 'react';
import api from '../../api/axios';

export const CharityDirectory = () => {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  if (loading) return <div className="p-8">Loading charities...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Charity Partners</h1>
        <p className="text-lg text-slate-600">
          Every subscription helps fund these amazing causes. Choose who you want to support or make a one-off donation today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map(charity => (
          <div key={charity._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {charity.images && charity.images.length > 0 ? (
              <img src={charity.images[0]} alt={charity.name} className="h-48 w-full object-cover" />
            ) : (
              <div className="h-48 w-full bg-slate-200 flex items-center justify-center text-slate-400">No image</div>
            )}
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{charity.name}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">{charity.description}</p>
              <div className="mt-auto">
                <button className="w-full bg-slate-100 text-slate-900 font-medium py-2 rounded-md hover:bg-slate-200 transition-colors">
                  Learn More & Donate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
