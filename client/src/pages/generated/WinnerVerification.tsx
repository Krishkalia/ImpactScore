import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

export const WinnerVerification = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    try {
      const res = await api.get('/winners/admin');
      setWinners(res.data || []);
    } catch (err) {
      console.error("Error fetching winners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerify = async (id: string, status: string) => {
    try {
      await api.put(`/winners/admin/${id}/verify`, { verificationStatus: status });
      Swal.fire({
        title: 'Success!',
        text: `Claim ${status} successfully.`,
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      fetchWinners(); // Refresh data
    } catch (err) {
      Swal.fire('Error', 'Failed to update claim status.', 'error');
    }
  };

  const handlePayment = async (id: string) => {
    try {
      await api.put(`/winners/admin/${id}/verify`, { paymentStatus: 'paid' });
      Swal.fire({
        title: 'Success!',
        text: `Claim marked as paid.`,
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      fetchWinners();
    } catch (err) {
      Swal.fire('Error', 'Failed to update payment status.', 'error');
    }
  };

  const pendingClaims = winners.filter(w => w.verificationStatus === 'pending');
  const valueForReview = pendingClaims.reduce((sum, w) => sum + (w.prizeAmount || 0), 0);
  const totalProcessed = winners.filter(w => w.verificationStatus !== 'pending').length;
  const totalApproved = winners.filter(w => w.verificationStatus === 'approved').length;
  const approvalRate = totalProcessed > 0 ? ((totalApproved / totalProcessed) * 100).toFixed(1) : '0.0';

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
{/*  TopAppBar (Shared Component)  */}
<header className="flex justify-between items-center w-full px-margin py-sm bg-surface dark:bg-dark-slate shadow-sm z-10 border-b border-outline-variant/10">
<div className="flex items-center gap-md">
<span className="font-headline-md text-title-md font-bold text-primary dark:text-primary-fixed-dim">ImpactScore</span>
</div>
<div className="flex items-center gap-xl flex-1 justify-center max-w-2xl px-xl">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full bg-surface-container-low border-none rounded-full pl-xl pr-md py-xs font-body-sm text-body-sm focus:ring-2 focus:ring-primary/20" placeholder="Global Search..." type="text"/>
</div>
<div className="hidden lg:flex items-center gap-xl">
<a className="font-label-sm text-label-sm text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim pb-1" href="#">Dashboard</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Claims</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Winners</a>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Prizes</a>
</div>
</div>
<div className="flex items-center gap-lg">
<button className="p-xs hover:bg-surface-container transition-colors rounded-full relative">
<span className="material-symbols-outlined text-on-surface-variant">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
</button>
<button className="p-xs hover:bg-surface-container transition-colors rounded-full">
<span className="material-symbols-outlined text-on-surface-variant">settings</span>
</button>
<div className="flex items-center gap-sm pl-md border-l border-outline-variant/30">
<img className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10" data-alt="A clean professional headshot of a middle-aged male administrator wearing a dark navy blazer and a light blue dress shirt, looking friendly and authoritative. The lighting is soft and corporate, set against a blurred high-tech office background with hints of cool blue and gray tones, perfectly matching a modern SaaS aesthetic." src="/charity_placeholder.png"/>
</div>
</div>
</header>
{/*  Content Canvas  */}
<div className="flex-1 overflow-y-auto custom-scrollbar p-xl lg:p-3xl space-y-2xl">
{/*  Page Header  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-xl">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-background">Winner Verification</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Review and approve prize claims from the March 2026 draw.</p>
</div>
<div className="flex items-center gap-md">
<button className="px-xl py-md bg-surface-container-high text-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-variant transition-all border border-primary/10 flex items-center gap-xs">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
                        Advanced Filters
                    </button>
<button className="px-xl py-md bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-hero-blue-dark transition-all shadow-md transform hover:scale-102 flex items-center gap-xs">
<span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Bulk Approve
                    </button>
</div>
</div>
{/*  KPI Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
<div className="bg-pure-white p-xl rounded-xl border-l-4 border-momentum-orange-dark shadow-sm bg-white hover:shadow-md transition-all">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Pending Claims</span>
<div className="p-sm bg-momentum-orange-light rounded-lg">
<span className="material-symbols-outlined text-momentum-orange-dark">pending_actions</span>
</div>
</div>
<div className="mt-md">
<span className="font-headline-sm text-headline-sm text-on-background">{pendingClaims.length}</span>
<div className="flex items-center gap-xs text-impact-green-dark mt-xs">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span className="font-label-sm text-label-sm">+12% from last draw</span>
</div>
</div>
</div>
<div className="bg-pure-white p-xl rounded-xl border-l-4 border-win-gold shadow-sm bg-white hover:shadow-md transition-all">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Value for Review</span>
<div className="p-sm bg-win-gold-light rounded-lg">
<span className="material-symbols-outlined text-win-gold">payments</span>
</div>
</div>
<div className="mt-md">
<span className="font-headline-sm text-headline-sm text-on-background">${valueForReview.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Average claim: ${pendingClaims.length > 0 ? (valueForReview / pendingClaims.length).toFixed(2) : '0.00'}</p>
</div>
</div>
<div className="bg-pure-white p-xl rounded-xl border-l-4 border-impact-green-dark shadow-sm bg-white hover:shadow-md transition-all">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Approval Rate</span>
<div className="p-sm bg-impact-green-light rounded-lg">
<span className="material-symbols-outlined text-impact-green-dark">verified</span>
</div>
</div>
<div className="mt-md">
<span className="font-headline-sm text-headline-sm text-on-background">{approvalRate}%</span>
<div className="w-full bg-surface-container rounded-full h-1.5 mt-md">
<div className="bg-impact-green-dark h-1.5 rounded-full" style={{width: `${approvalRate}%`}}></div>
</div>
</div>
</div>
</div>
{/*  Filter Bar & Data Table Section  */}
<div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
{/*  Filter Bar  */}
<div className="p-xl border-b border-outline-variant/10 bg-off-white flex flex-wrap gap-xl items-center">
<div className="flex-1 min-w-[300px] relative">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-11 pr-md py-md bg-white border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Search by name, email, or ticket ID..." type="text"/>
</div>
<div className="flex items-center gap-md">
<div className="flex flex-col gap-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Match Type</span>
<select className="border border-outline-variant rounded-lg py-md px-xl bg-white font-body-sm text-body-sm focus:ring-primary">
<option>All Matches</option>
<option>5-Number Match</option>
<option>4-Number Match</option>
<option>3-Number Match</option>
</select>
</div>
<div className="flex flex-col gap-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Status</span>
<select className="border border-outline-variant rounded-lg py-md px-xl bg-white font-body-sm text-body-sm focus:ring-primary">
<option>Pending Approval</option>
<option>Approved</option>
<option>Rejected</option>
</select>
</div>
</div>
</div>
{/*  Table Content  */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant/30">
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase">User</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase">Prize Amount</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase">Match Type</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase">Proof</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase text-center">Submission Date</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase">Status</th>
<th className="px-xl py-md font-label-sm text-label-sm text-on-surface-variant uppercase text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
{winners.length > 0 ? winners.map(winner => (
<tr key={winner._id} className={`hover:bg-hero-blue-light/30 transition-colors group ${winner.verificationStatus === 'pending' ? 'bg-momentum-orange-light/5' : ''}`}>
<td className="px-xl py-xl">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{winner.user?.name?.substring(0, 2).toUpperCase() || 'U'}</div>
<div>
<p className="font-title-md text-body-md font-semibold text-on-background">{winner.user?.name || 'Unknown User'}</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">{winner.user?.email || 'No email'}</p>
</div>
</div>
</td>
<td className="px-xl py-xl">
<span className="font-mono text-body-md font-bold text-hero-blue-dark">${(winner.prizeAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
</td>
<td className="px-xl py-xl">
<span className="px-md py-xs bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded-full border border-outline-variant/20">{winner.matchType}-Number Match</span>
</td>
<td className="px-xl py-xl">
{winner.proofUrl ? (
  <a href={`http://localhost:5000/${winner.proofUrl}`} target="_blank" rel="noopener noreferrer" className="relative w-16 h-10 rounded overflow-hidden group/thumb cursor-zoom-in block">
    <img className="w-full h-full object-cover" alt="Proof Document" src={`http://localhost:5000/${winner.proofUrl}`}/>
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
      <span className="material-symbols-outlined text-white text-[18px]">visibility</span>
    </div>
  </a>
) : (
  <span className="text-body-sm text-subtle-gray italic">No proof</span>
)}
</td>
<td className="px-xl py-xl text-center">
<p className="font-body-sm text-body-sm">{winner.draw?.drawMonth ? new Date(winner.draw.drawMonth).toLocaleDateString() : 'N/A'}</p>
</td>
<td className="px-xl py-xl">
<div className="flex flex-col gap-xs">
<span className={`flex items-center gap-xs px-md py-xs rounded-full w-fit ${
  winner.verificationStatus === 'approved' ? 'text-impact-green-dark bg-impact-green-light' : 
  winner.verificationStatus === 'rejected' ? 'text-alert-red bg-error-container' : 
  'text-momentum-orange-dark bg-momentum-orange-light'
}`}>
<span className={`w-1.5 h-1.5 rounded-full ${
  winner.verificationStatus === 'approved' ? 'bg-impact-green-dark' : 
  winner.verificationStatus === 'rejected' ? 'bg-alert-red' : 
  'bg-momentum-orange-dark'
}`}></span>
<span className="font-label-sm text-label-sm capitalize">{winner.verificationStatus}</span>
</span>
{winner.verificationStatus === 'approved' && (
  <span className={`flex items-center gap-xs px-md py-xs rounded-full w-fit mt-1 ${
    winner.paymentStatus === 'paid' ? 'text-hero-blue-dark bg-hero-blue-light' : 'text-subtle-gray bg-surface-container'
  }`}>
    <span className="font-label-sm text-[10px] uppercase font-bold tracking-widest">{winner.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
  </span>
)}
</div>
</td>
<td className="px-xl py-xl text-right">
<div className="flex items-center justify-end gap-md">
{winner.verificationStatus === 'pending' && (
  <>
    <button onClick={() => handleVerify(winner._id, 'approved')} className="p-sm text-impact-green-dark hover:bg-impact-green-light rounded-lg transition-colors" title="Approve">
      <span className="material-symbols-outlined">check_circle</span>
    </button>
    <button onClick={() => handleVerify(winner._id, 'rejected')} className="p-sm text-alert-red hover:bg-error-container rounded-lg transition-colors" title="Reject">
      <span className="material-symbols-outlined">cancel</span>
    </button>
  </>
)}
{winner.verificationStatus === 'approved' && winner.paymentStatus !== 'paid' && (
  <button onClick={() => handlePayment(winner._id)} className="px-md py-xs bg-hero-blue-dark text-white hover:bg-primary font-label-sm rounded-lg transition-colors flex items-center gap-xs shadow-sm" title="Mark as Paid">
    <span className="material-symbols-outlined text-[16px]">payments</span>
    Mark Paid
  </button>
)}
</div>
</td>
</tr>
)) : (
  <tr>
    <td colSpan={7} className="px-xl py-xl text-center text-subtle-gray">No claims found.</td>
  </tr>
)}
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="px-xl py-md bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
<p className="font-label-sm text-label-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">1-{Math.min(winners.length, 25)}</span> of {winners.length} claims</p>
<div className="flex items-center gap-xs">
<button className="p-sm rounded-lg hover:bg-surface-container transition-all border border-outline-variant/30 disabled:opacity-50" disabled>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm">1</button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-container transition-all text-on-surface-variant font-label-sm text-label-sm">2</button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-container transition-all text-on-surface-variant font-label-sm text-label-sm">3</button>
<button className="p-sm rounded-lg hover:bg-surface-container transition-all border border-outline-variant/30">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/*  Contextual Help / System Status  */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
<div className="bg-hero-blue-light/40 border border-primary/20 rounded-xl p-xl flex gap-xl items-start">
<div className="p-md bg-white rounded-full shadow-sm text-primary">
<span className="material-symbols-outlined">info</span>
</div>
<div>
<h4 className="font-title-md text-body-md font-bold text-hero-blue-dark">Verification Policy Reminder</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-xs leading-relaxed">
                            For all matches over $500.00, manual secondary verification of the ticket ID against the central ledger is mandatory before final payout release. Ensure high-resolution proof matches the user's registered identity.
                        </p>
</div>
</div>
<div className="bg-white rounded-xl shadow-sm border border-outline-variant/20 p-xl">
<h4 className="font-title-md text-body-md font-bold mb-md">Quick Logs</h4>
<ul className="space-y-md">
<li className="flex items-center gap-md pb-md border-b border-outline-variant/10">
<span className="w-2 h-2 rounded-full bg-impact-green-dark"></span>
<p className="font-body-sm text-body-sm flex-1"><span className="font-bold">System</span> approved $25.00 for J. Doe (Auto-Verified)</p>
<span className="font-label-sm text-label-sm text-outline">2m ago</span>
</li>
<li className="flex items-center gap-md pb-md border-b border-outline-variant/10">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<p className="font-body-sm text-body-sm flex-1"><span className="font-bold">Admin Sarah</span> flagged claim #4592 for review</p>
<span className="font-label-sm text-label-sm text-outline">15m ago</span>
</li>
<li className="flex items-center gap-md">
<span className="w-2 h-2 rounded-full bg-momentum-orange-dark"></span>
<p className="font-body-sm text-body-sm flex-1"><span className="font-bold">Robert Sterling</span> submitted high-value proof</p>
<span className="font-label-sm text-label-sm text-outline">1h ago</span>
</li>
</ul>
</div>
</div>
</div>
</main>
    </>
  );
};
