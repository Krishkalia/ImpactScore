import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export const ReportsAnalytics = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [uRes, cRes, dRes, wRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/charities'),
          api.get('/draws/admin'),
          api.get('/winners/admin')
        ]);
        setUsers(uRes.data || []);
        setCharities(cRes.data || []);
        setDraws(dRes.data || []);
        setWinners(wRes.data || []);
      } catch (err) {
        console.error("Error fetching report data", err);
      }
    };
    fetchAllData();
  }, []);

  const totalFunds = draws.reduce((sum, d) => sum + (d.prizePoolTotal || 0), 0);
  const totalPayouts = winners.filter(w => w.verificationStatus === 'approved').reduce((sum, w) => sum + (w.prizeAmount || 0), 0);

  return (
    <>
      <main className="flex-1 p-margin md:p-5xl max-w-7xl mx-auto w-full">
{/*  Header & Controls  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-xl mb-3xl">
<div>
<h1 className="font-headline-md text-headline-md text-dark-slate mb-xs">Impact Analytics</h1>
<p className="font-body-md text-body-md text-charcoal">Measure growth, community engagement, and social impact.</p>
</div>
<div className="flex flex-wrap items-center gap-md">
<div className="bg-surface-container-high p-xs rounded-lg flex">
<button className="px-lg py-sm text-label-sm font-label-sm rounded-md hover:bg-surface transition-all">Last 30 Days</button>
<button className="px-lg py-sm text-label-sm font-label-sm rounded-md bg-white shadow-sm text-primary">3 Months</button>
<button className="px-lg py-sm text-label-sm font-label-sm rounded-md hover:bg-surface transition-all">6 Months</button>
<button className="px-lg py-sm text-label-sm font-label-sm rounded-md hover:bg-surface transition-all">YTD</button>
</div>
<button className="bg-surface border border-primary text-primary px-xl py-sm rounded-lg font-label-sm text-label-sm hover:bg-hero-blue-light transition-all flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">table_chart</span>
                        Export CSV
                    </button>
</div>
</div>
{/*  KPI Cards Grid  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl mb-4xl">
{/*  KPI 1  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<p className="font-label-sm text-label-sm text-charcoal uppercase tracking-wider">Total Users</p>
<span className="material-symbols-outlined text-primary">groups</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-dark-slate mb-sm">{users.length}</h3>
<div className="space-y-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-impact-green-dark flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-impact-green-dark"></span> Active</span>
<span className="font-bold">{users.length > 0 ? Math.floor(users.length * 0.8) : 0}</span>
</div>
<div className="w-full bg-light-mist h-1.5 rounded-full overflow-hidden flex">
<div className="bg-impact-green-dark h-full" style={{width:"80%"}}></div>
<div className="bg-alert-red h-full" style={{width:"20%"}}></div>
</div>
</div>
</div>
{/*  KPI 2  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-impact-green-dark hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<p className="font-label-sm text-label-sm text-charcoal uppercase tracking-wider">Charities Supported</p>
<span className="material-symbols-outlined text-impact-green-dark">volunteer_activism</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-dark-slate mb-sm">{charities.length}</h3>
<div className="flex items-center gap-xs text-impact-green-dark">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span className="font-label-sm text-label-sm">Active Network</span>
</div>
</div>
{/*  KPI 3  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-momentum-orange-dark hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<p className="font-label-sm text-label-sm text-charcoal uppercase tracking-wider">Total Funds Raised</p>
<span className="material-symbols-outlined text-momentum-orange-dark">payments</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-dark-slate mb-sm">${totalFunds.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
<p className="font-body-sm text-body-sm text-charcoal">Platform Aggregate</p>
</div>
{/*  KPI 4  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-win-gold hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<p className="font-label-sm text-label-sm text-charcoal uppercase tracking-wider">Total Payouts</p>
<span className="material-symbols-outlined text-win-gold">emoji_events</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-dark-slate mb-sm">${totalPayouts.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
<p className="font-body-sm text-body-sm text-charcoal">To verified winners</p>
</div>
</div>

</main>
    </>
  );
};
