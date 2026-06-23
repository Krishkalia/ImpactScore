import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageLoader, Loader } from '../../components/Loader';

export const CharitySelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCharityModal, setSelectedCharityModal] = useState<any>(null);
  const [profileModal, setProfileModal] = useState<any>(null);
  const [contributionPct, setContributionPct] = useState(10);
  const [showDonateModal, setShowDonateModal] = useState<string | null>(null);
  const [donateLoading, setDonateLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data || []);
      } catch (err) {
        console.error("Failed to fetch charities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSelectCharity = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCharityModal) return;
    try {
      setActionLoading(selectedCharityModal._id);
      await api.put('/charities/me', { charityId: selectedCharityModal._id, contributionPct });
      toast.success('Charity successfully selected!');
      setSelectedCharityModal(null);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to select charity. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDonate = async (amount: number) => {
    if (!showDonateModal) return;
    try {
      setDonateLoading(amount);
      const res = await api.post('/charities/donations', {
        charityId: showDonateModal,
        amount
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to initiate donation. Please try again.');
      setDonateLoading(null);
    }
  };

  const featuredCharity = charities.find(c => c.isFeatured) || charities[0];
  const filteredCharities = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) && c._id !== featuredCharity?._id);

  if (loading) return <div className="pt-32 flex justify-center"><PageLoader /></div>;

  return (
    <main className="pt-16 pb-5xl bg-background min-h-screen">
      <header className="text-center py-4xl px-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Support a Cause You Believe In</h2>
        <p className="font-body-lg text-body-lg text-charcoal max-w-2xl mx-auto">Your subscription helps charities make an impact. Select the organization you want to champion this month.</p>
      </header>

      {/*  Search & Filter Bar  */}
      <section className="max-w-7xl mx-auto mb-4xl px-xl">
        <div className="flex flex-col md:flex-row gap-lg items-center">
          <div className="relative w-full md:w-96 group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-subtle-gray group-focus-within:text-primary transition-colors">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-md py-md bg-off-white border-subtle-gray/30 border-2 rounded-lg focus:ring-0 focus:border-primary transition-all text-body-md" 
              placeholder="Search charities by name..." 
              type="text"
            />
          </div>
          <div className="flex flex-wrap gap-sm">
            <button className="px-lg py-sm rounded-full bg-primary text-on-primary font-label-sm">All</button>
            <button className="px-lg py-sm rounded-full bg-off-white text-charcoal border border-subtle-gray/20 hover:border-primary font-label-sm transition-colors">Environment</button>
            <button className="px-lg py-sm rounded-full bg-off-white text-charcoal border border-subtle-gray/20 hover:border-primary font-label-sm transition-colors">Health</button>
          </div>
        </div>
      </section>

      {/*  Featured Charity Spotlight  */}
      {featuredCharity && (
        <section className="max-w-7xl mx-auto mb-5xl px-xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row border border-light-mist">
            <div className="lg:w-3/5 h-96 lg:h-auto relative">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${featuredCharity.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'}')` }}></div>
              <div className="absolute top-lg left-lg">
                <span className="bg-win-gold text-on-tertiary-fixed font-bold px-lg py-xs rounded-full text-label-sm flex items-center shadow-sm">
                  <span className="material-symbols-outlined text-[16px] mr-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                  FEATURED
                </span>
              </div>
            </div>
            <div className="lg:w-2/5 p-3xl flex flex-col justify-center">
              <h3 className="font-headline-sm text-headline-sm text-hero-blue-dark mb-lg">{featuredCharity.name}</h3>
              <div className="space-y-md mb-xl">
                <p className="text-charcoal font-body-md leading-relaxed">{featuredCharity.description}</p>
              </div>
              <div className="flex gap-md mt-lg">
                <button 
                  onClick={() => {
                    setContributionPct(10);
                    setSelectedCharityModal(featuredCharity);
                  }}
                  disabled={actionLoading === featuredCharity._id}
                  className="flex-1 flex justify-center items-center gap-sm bg-primary text-on-primary py-lg rounded-lg font-title-md font-bold hover:bg-hero-blue-dark transform hover:scale-[1.02] transition-all shadow-md disabled:opacity-50">
                  {actionLoading === featuredCharity._id ? <Loader size="sm" /> : 'Select This Charity'}
                </button>
                <button 
                  onClick={() => setShowDonateModal(featuredCharity._id)}
                  className="bg-win-gold text-on-tertiary-fixed px-xl py-lg rounded-lg font-title-md font-bold hover:bg-win-gold-muted transform hover:scale-[1.02] transition-all shadow-md flex items-center gap-sm">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                  Donate
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  Charity Grid  */}
      <section className="max-w-7xl mx-auto px-xl">
        <h3 className="font-title-md text-title-md text-on-surface mb-xl border-l-4 border-momentum-orange-dark pl-md">Browse More Causes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {filteredCharities.map((c: any) => (
            <div key={c._id} className="bg-impact-green-light/40 border-2 border-transparent rounded-xl p-2xl hover:shadow-md transition-all flex flex-col h-full shadow-sm">
              <div className="flex justify-between items-start mb-lg">
                <div className="w-20 h-20 rounded-full bg-surface-container-lowest border border-impact-green-dark/20 flex items-center justify-center overflow-hidden">
                  {c.images?.[0] && <img className="w-full h-full object-cover" src={c.images[0]} />}
                </div>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface mb-sm">{c.name}</h4>
              <p className="text-charcoal text-body-sm mb-lg line-clamp-3">{c.description}</p>
              <div className="mt-auto pt-lg border-t border-impact-green-dark/10 flex justify-between items-center">
                <div className="flex gap-sm">
                  <button 
                    onClick={() => {
                      setContributionPct(10);
                      setSelectedCharityModal(c);
                    }}
                    disabled={actionLoading === c._id}
                    className="px-lg py-sm flex justify-center items-center gap-sm rounded-lg border-2 border-hero-blue text-primary font-label-sm hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50">
                    {actionLoading === c._id ? <Loader size="sm" /> : 'Select'}
                  </button>
                  <button 
                    onClick={() => setProfileModal(c)}
                    className="px-lg py-sm flex justify-center items-center gap-sm rounded-lg border-2 border-transparent text-charcoal font-label-sm hover:bg-surface-container transition-all">
                    Profile
                  </button>
                </div>
                <button 
                  onClick={() => setShowDonateModal(c._id)}
                  className="text-subtle-gray hover:text-primary transition-colors flex items-center" title="Direct Donation">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </button>
              </div>
            </div>
          ))}
          {filteredCharities.length === 0 && (
            <div className="col-span-full text-center py-2xl text-subtle-gray">
              No charities found matching your search.
            </div>
          )}
        </div>
      </section>

      {/* Configuration Modal */}
      {selectedCharityModal && (
        <div className="fixed inset-0 bg-dark-slate/80 backdrop-blur-sm flex items-center justify-center z-50 p-xl">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2xl">
              <h3 className="font-headline-sm text-dark-slate mb-sm">Configure Contribution</h3>
              <p className="text-body-md text-on-surface-variant mb-xl">
                You are selecting <strong>{selectedCharityModal.name}</strong> as your beneficiary.
              </p>
              
              <div className="mb-2xl space-y-md">
                <div className="flex justify-between items-center mb-xs">
                  <label className="font-title-md text-hero-blue-dark">Contribution Percentage</label>
                  <span className="font-headline-sm text-primary">{contributionPct}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={contributionPct} 
                  onChange={(e) => setContributionPct(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-label-sm text-subtle-gray">
                  Minimum contribution is 10%. You can optionally increase this up to 100% of your subscription value.
                </p>
              </div>

              <div className="flex gap-md justify-end">
                <button 
                  onClick={() => setSelectedCharityModal(null)}
                  className="px-xl py-md font-bold text-subtle-gray hover:text-dark-slate hover:bg-light-mist rounded-lg transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleSelectCharity}
                  disabled={actionLoading === selectedCharityModal._id}
                  className="px-xl py-md flex justify-center items-center gap-sm bg-primary text-on-primary rounded-lg font-bold shadow-md hover:bg-hero-blue-dark transition-colors disabled:opacity-50">
                  {actionLoading === selectedCharityModal._id ? <Loader size="sm" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-dark-slate/80 backdrop-blur-sm flex items-center justify-center z-50 p-xl">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-win-gold-light p-xl text-center border-b border-win-gold/20">
              <span className="material-symbols-outlined text-[48px] text-win-gold mb-sm" style={{"fontVariationSettings":"'FILL' 1"}}>volunteer_activism</span>
              <h3 className="font-headline-sm text-dark-slate">Direct Donation</h3>
            </div>
            <div className="p-2xl text-center space-y-lg">
              <p className="text-body-md text-on-surface-variant">
                Make an independent, one-time contribution outside of your standard subscription plan.
              </p>
              <div className="grid grid-cols-3 gap-md mb-lg">
                <button 
                  onClick={() => handleDonate(10)}
                  disabled={donateLoading !== null}
                  className="py-md border-2 border-outline-variant rounded-lg font-bold text-dark-slate hover:border-primary hover:text-primary transition-colors disabled:opacity-50 flex justify-center items-center">
                  {donateLoading === 10 ? <Loader size="sm" /> : '$10'}
                </button>
                <button 
                  onClick={() => handleDonate(50)}
                  disabled={donateLoading !== null}
                  className="py-md border-2 border-primary bg-primary/5 rounded-lg font-bold text-primary transition-colors disabled:opacity-50 flex justify-center items-center">
                  {donateLoading === 50 ? <Loader size="sm" /> : '$50'}
                </button>
                <button 
                  onClick={() => handleDonate(100)}
                  disabled={donateLoading !== null}
                  className="py-md border-2 border-outline-variant rounded-lg font-bold text-dark-slate hover:border-primary hover:text-primary transition-colors disabled:opacity-50 flex justify-center items-center">
                  {donateLoading === 100 ? <Loader size="sm" /> : '$100'}
                </button>
              </div>
              <button 
                onClick={() => setShowDonateModal(null)}
                disabled={donateLoading !== null}
                className="block w-full text-subtle-gray hover:text-dark-slate font-label-sm mt-md disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charity Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 bg-dark-slate/80 backdrop-blur-sm flex items-center justify-center z-50 p-xl">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-48 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${profileModal.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'}')` }}>
              <div className="absolute inset-0 bg-black/40"></div>
              <button onClick={() => setProfileModal(null)} className="absolute top-md right-md bg-white/20 hover:bg-white/40 text-white rounded-full p-sm transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-3xl overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-start justify-between gap-xl mb-xl">
                <div>
                  <h2 className="font-headline-md text-hero-blue-dark mb-xs">{profileModal.name}</h2>
                  {profileModal.isFeatured && (
                    <span className="inline-flex items-center gap-xs px-md py-xs bg-win-gold-light text-win-gold-dark rounded-full font-label-sm text-[12px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">star</span> Featured Charity
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setProfileModal(null);
                    setContributionPct(10);
                    setSelectedCharityModal(profileModal);
                  }}
                  className="shrink-0 bg-primary text-on-primary px-xl py-md rounded-lg font-title-md hover:bg-hero-blue-dark transition-all shadow-md">
                  Support This Cause
                </button>
              </div>

              <div className="mb-2xl">
                <h3 className="font-title-md text-dark-slate mb-sm border-b border-outline-variant/30 pb-xs">About the Mission</h3>
                <p className="text-on-surface-variant font-body-md leading-relaxed">
                  {profileModal.description || "No detailed description provided."}
                </p>
              </div>

              <div>
                <h3 className="font-title-md text-dark-slate mb-md border-b border-outline-variant/30 pb-xs flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">event</span>
                  Upcoming Events & Initiatives
                </h3>
                
                {profileModal.upcomingEvents && profileModal.upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    {profileModal.upcomingEvents.map((event: any, idx: number) => (
                      <div key={idx} className="bg-surface-bright p-md rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                        <h4 className="font-title-md text-on-surface mb-xs">{event.title}</h4>
                        <div className="flex items-center gap-xs text-subtle-gray font-label-sm mb-xs">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-xs text-subtle-gray font-label-sm mb-sm">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {event.location}
                          </div>
                        )}
                        <p className="text-on-surface-variant font-body-sm line-clamp-2">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-mist p-xl rounded-xl text-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-subtle-gray text-[32px] mb-xs">event_busy</span>
                    <p className="text-subtle-gray font-body-sm">No upcoming events scheduled at this time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};
