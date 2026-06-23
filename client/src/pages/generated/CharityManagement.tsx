import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

export const CharityManagement = () => {
  const [charities, setCharities] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [charityRes, drawRes] = await Promise.all([
        api.get('/charities'),
        api.get('/draws/admin')
      ]);
      setCharities(charityRes.data || []);
      setDraws(drawRes.data || []);
    } catch (err) {
      console.error("Error fetching charity data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    Swal.fire({
      title: 'Add New Charity',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
          <label style="font-weight: 600;">Name</label>
          <input id="swal-name" class="swal2-input" style="margin-top: 0;" placeholder="Charity Name" />
          <label style="font-weight: 600;">Description</label>
          <textarea id="swal-desc" class="swal2-textarea" style="margin-top: 0;" placeholder="Description"></textarea>
          <label style="font-weight: 600;">Target Amount ($)</label>
          <input id="swal-target" type="number" class="swal2-input" style="margin-top: 0;" value="10000" />
          <label style="font-weight: 600;">Image File</label>
          <input id="swal-file" type="file" class="swal2-file" style="margin-top: 0;" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create Charity',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        const targetAmount = (document.getElementById('swal-target') as HTMLInputElement).value;
        const file = (document.getElementById('swal-file') as HTMLInputElement).files?.[0];
        
        if (!name || !description || !targetAmount) {
          Swal.showValidationMessage('Please fill out all required fields');
          return false;
        }
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('targetAmount', targetAmount);
        if (file) formData.append('image', file);
        return formData;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post('/charities', result.value, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          Swal.fire('Added!', 'New charity has been created.', 'success');
          fetchData();
        } catch (err) {
          Swal.fire('Error', 'Failed to create charity', 'error');
        }
      }
    });
  };

  const handleEdit = async (charity: any) => {
    Swal.fire({
      title: 'Edit Charity',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
          <label style="font-weight: 600;">Name</label>
          <input id="swal-name" class="swal2-input" style="margin-top: 0;" value="${charity.name}" />
          <label style="font-weight: 600;">Description</label>
          <textarea id="swal-desc" class="swal2-textarea" style="margin-top: 0;">${charity.description}</textarea>
          <label style="font-weight: 600;">Target Amount ($)</label>
          <input id="swal-target" type="number" class="swal2-input" style="margin-top: 0;" value="${charity.targetAmount}" />
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="checkbox" id="swal-active" ${charity.isActive ? 'checked' : ''} />
            <label for="swal-active" style="margin: 0; font-weight: 600;">Is Active</label>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="checkbox" id="swal-featured" ${charity.isFeatured ? 'checked' : ''} />
            <label for="swal-featured" style="margin: 0; font-weight: 600;">Is Featured</label>
          </div>
          <label style="font-weight: 600;">Update Image (optional)</label>
          <input id="swal-file" type="file" class="swal2-file" style="margin-top: 0;" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        const targetAmount = (document.getElementById('swal-target') as HTMLInputElement).value;
        const isActive = (document.getElementById('swal-active') as HTMLInputElement).checked;
        const isFeatured = (document.getElementById('swal-featured') as HTMLInputElement).checked;
        const file = (document.getElementById('swal-file') as HTMLInputElement).files?.[0];
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('targetAmount', targetAmount);
        formData.append('isActive', isActive.toString());
        formData.append('isFeatured', isFeatured.toString());
        if (file) formData.append('image', file);
        return formData;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/charities/${charity._id}`, result.value, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          Swal.fire('Saved!', 'Charity has been updated.', 'success');
          fetchData();
        } catch (err) {
          Swal.fire('Error', 'Failed to update charity', 'error');
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will permanently delete the charity.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/charities/${id}`);
        Swal.fire('Deleted!', 'Charity has been deleted.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete charity', 'error');
      }
    }
  };

  const totalPrizePool = draws.reduce((sum, d) => sum + (d.prizePoolTotal || 0), 0);
  const activeCount = charities.filter(c => c.isActive).length;
  const featuredCharity = charities.find(c => c.isFeatured) || charities[0];

  return (
    <>
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
{/*  TOP APP BAR  */}
<header className="flex justify-between items-center w-full px-margin py-sm max-w-full bg-surface shadow-sm sticky top-0 z-30">
<div className="flex items-center gap-lg">
<div className="flex items-center gap-sm text-on-surface-variant text-body-sm font-body-sm">
<span className="hover:text-primary cursor-pointer">Admin</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
<span className="text-dark-slate font-semibold">Charities</span>
</div>
</div>
<div className="flex items-center gap-2xl">
{/*  Search  */}
<div className="relative hidden lg:block w-96">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full bg-off-white border-subtle-gray/30 rounded-lg pl-3xl pr-md py-sm text-body-sm focus:ring-primary focus:border-primary transition-all" placeholder="Search partners, categories or funds..." type="text"/>
</div>
<div className="flex items-center gap-lg">
<button className="text-on-surface-variant hover:text-primary transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-alert-red rounded-full border-2 border-surface"></span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
</div>
</header>
{/*  SCROLLABLE CONTENT  */}
<div className="flex-1 overflow-y-auto p-margin custom-scrollbar">
{/*  HEADER SECTION  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-xl mb-3xl">
<div>
<h1 className="font-headline-md text-headline-md text-dark-slate mb-xs">Charity Management</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Oversee global partnerships and donation flows across all sectors.</p>
</div>
<button onClick={handleAdd} className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-sm text-label-sm hover:bg-hero-blue-dark hover:scale-102 transition-all flex items-center justify-center gap-sm shadow-md">
<span className="material-symbols-outlined">add</span>
                    Add New Charity
                </button>
</div>
{/*  KPI ROW  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-4xl">
{/*  Card 1  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<span className="p-sm bg-hero-blue-light text-primary rounded-lg material-symbols-outlined">hub</span>
<span className="text-impact-green-dark text-label-sm font-bold flex items-center">+4.2%</span>
</div>
<p className="text-on-surface-variant font-label-sm text-label-sm mb-xs">Total Charities</p>
<h3 className="text-headline-sm font-headline-sm text-dark-slate">{charities.length}</h3>
</div>
{/*  Card 2  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-impact-green-dark hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<span className="p-sm bg-impact-green-light text-impact-green-dark rounded-lg material-symbols-outlined">payments</span>
<span className="text-impact-green-dark text-label-sm font-bold flex items-center">+12.5%</span>
</div>
<p className="text-on-surface-variant font-label-sm text-label-sm mb-xs">Total Impact Funds</p>
<h3 className="text-headline-sm font-headline-sm text-dark-slate">${totalPrizePool.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
</div>
{/*  Card 3  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-momentum-orange-dark hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<span className="p-sm bg-momentum-orange-light text-momentum-orange-dark rounded-lg material-symbols-outlined">eco</span>
<span className="text-on-surface-variant text-label-sm">Primary</span>
</div>
<p className="text-on-surface-variant font-label-sm text-label-sm mb-xs">Top Category</p>
<h3 className="text-headline-sm font-headline-sm text-dark-slate">General</h3>
</div>
{/*  Card 4  */}
<div className="bg-white p-xl rounded-xl shadow-sm border-l-4 border-win-gold hover:shadow-md transition-all">
<div className="flex justify-between items-start mb-md">
<span className="p-sm bg-win-gold-light text-win-gold rounded-lg material-symbols-outlined">campaign</span>
<span className="text-impact-green-dark text-label-sm font-bold flex items-center">Active</span>
</div>
<p className="text-on-surface-variant font-label-sm text-label-sm mb-xs">Active Partners</p>
<h3 className="text-headline-sm font-headline-sm text-dark-slate">{activeCount}</h3>
</div>
</div>
{/*  ASYMMETRIC BENTO LAYOUT START  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-5xl items-start">
{/*  FEATURED SECTION (Left Column - 4 cols)  */}
<div className="lg:col-span-4 flex flex-col gap-xl">
<div className="bg-dark-slate text-white p-xl rounded-xl shadow-lg relative overflow-hidden group">

<div className="relative z-10">
<div className="flex justify-between items-center mb-xl">
<span className="bg-win-gold text-on-surface px-md py-xs rounded-full text-[10px] font-bold uppercase tracking-widest">Featured Charity</span>
<div className="flex items-center gap-xs">
<span className="text-[10px] font-medium opacity-60">Status</span>
<div className="w-2 h-2 rounded-full bg-impact-green-dark"></div>
</div>
</div>
<div className="flex items-center gap-lg mb-2xl">
<div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 border border-white/20 p-xs flex items-center justify-center">
{featuredCharity?.images?.[0] ? (
  <img className="w-full h-full object-contain" alt={featuredCharity?.name} src={featuredCharity.images[0].startsWith('http') ? featuredCharity.images[0] : `http://localhost:5000/${featuredCharity.images[0].replace(/\\/g, '/')}`}/>
) : (
  <span className="material-symbols-outlined text-4xl text-white/50">volunteer_activism</span>
)}
</div>
<div>
<h4 className="text-title-md font-headline-sm mb-xs">{featuredCharity ? featuredCharity.name : 'No Featured Charity'}</h4>
<p className="text-body-sm opacity-80">{featuredCharity?.description ? featuredCharity.description.substring(0, 50) + '...' : 'Supporting Global Causes'}</p>
</div>
</div>
<div className="flex flex-col gap-sm">
<div className="flex justify-between text-body-sm">
<span>Goal Progress</span>
<span className="font-bold">N/A</span>
</div>
<div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
<div className="h-full bg-impact-green-dark w-[0%] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.5)]"></div>
</div>
</div>
<div className="mt-2xl flex gap-md">
<button className="flex-1 bg-white text-dark-slate py-sm rounded-lg font-label-sm text-label-sm hover:bg-surface-container-high transition-all">Promote Now</button>
<button className="p-sm rounded-lg border border-white/20 hover:bg-white/10 transition-all">
<span className="material-symbols-outlined">tune</span>
</button>
</div>
</div>
</div>
{/*  Quick Analytics/Tip Card  */}
<div className="bg-surface-container p-xl rounded-xl border border-outline-variant/30">
<h4 className="text-title-md font-title-md text-dark-slate mb-md flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">lightbulb</span>
                            Optimization Tip
                        </h4>
<p className="text-body-sm text-on-surface-variant mb-lg leading-relaxed">
                            Charities in the <span className="font-bold text-dark-slate">Environment</span> category see 24% higher engagement when featuring high-resolution photography in their profiles.
                        </p>
<a className="text-primary font-label-sm text-label-sm flex items-center gap-xs hover:underline" href="#">
                            View best practices
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</div>
</div>
{/*  MAIN TABLE SECTION (Right Column - 8 cols)  */}
<div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-outline-variant/10 flex flex-col overflow-hidden">
{/*  Table Header & Filters  */}
<div className="p-xl border-b border-outline-variant/10">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-xl">
<h3 className="text-title-md font-headline-sm text-dark-slate">Partner Directory</h3>
<div className="flex items-center gap-xs overflow-x-auto pb-xs">
<button className="px-md py-sm bg-primary text-on-primary rounded-full text-label-sm whitespace-nowrap">All</button>
<button className="px-md py-sm bg-light-mist text-on-surface-variant hover:bg-surface-container-high rounded-full text-label-sm whitespace-nowrap transition-colors">Environment</button>
<button className="px-md py-sm bg-light-mist text-on-surface-variant hover:bg-surface-container-high rounded-full text-label-sm whitespace-nowrap transition-colors">Education</button>
<button className="px-md py-sm bg-light-mist text-on-surface-variant hover:bg-surface-container-high rounded-full text-label-sm whitespace-nowrap transition-colors">Health</button>
<button className="px-md py-sm bg-light-mist text-on-surface-variant hover:bg-surface-container-high rounded-full text-label-sm whitespace-nowrap transition-colors">Food</button>
<button className="px-md py-sm bg-light-mist text-on-surface-variant hover:bg-surface-container-high rounded-full text-label-sm whitespace-nowrap transition-colors">Wildlife</button>
</div>
</div>
</div>
{/*  Data Dense Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-off-white">
<tr>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Charity Partner</th>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Category</th>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider text-right">Supporters</th>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider text-right">Funds</th>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider text-center">Status</th>
<th className="px-xl py-md text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
{charities.length > 0 ? charities.map(charity => (
  <tr key={charity._id} className="hover:bg-light-mist transition-colors group">
    <td className="px-xl py-lg">
      <div className="flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/30 overflow-hidden">
          {charity.images && charity.images[0] ? (
            <img className="w-full h-full object-cover" alt={charity.name} src={charity.images[0].startsWith('http') ? charity.images[0] : `http://localhost:5000/${charity.images[0].replace(/\\/g, '/')}`}/>
          ) : (
            <span className="material-symbols-outlined text-outline">volunteer_activism</span>
          )}
        </div>
        <div>
          <p className="text-body-sm font-bold text-dark-slate">{charity.name}</p>
          <p className="text-[11px] text-on-surface-variant">id: {charity._id?.substring(charity._id.length - 6)}</p>
        </div>
      </div>
    </td>
    <td className="px-xl py-lg">
      <span className="px-md py-xs bg-light-mist text-on-surface-variant rounded-full text-[11px] font-bold">General</span>
    </td>
    <td className="px-xl py-lg text-right text-body-sm text-on-surface font-medium">N/A</td>
    <td className="px-xl py-lg text-right text-body-sm text-dark-slate font-bold">N/A</td>
    <td className="px-xl py-lg text-center">
      <span className={`inline-flex items-center gap-xs px-md py-xs rounded-full text-[11px] font-bold ${charity.isActive ? 'bg-impact-green-light text-impact-green-dark' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${charity.isActive ? 'bg-impact-green-dark' : 'bg-outline'}`}></span> {charity.isActive ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="px-xl py-lg text-right">
      <div className="flex items-center justify-end gap-sm">
        <button onClick={() => handleEdit(charity)} className="p-xs text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button onClick={() => handleDelete(charity._id)} className="p-xs text-alert-red hover:text-red-700 transition-colors">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </td>
  </tr>
)) : (
  <tr>
    <td colSpan={6} className="px-xl py-lg text-center text-subtle-gray">No charities found.</td>
  </tr>
)}
</tbody>
</table>
</div>
{/*  Table Footer / Pagination  */}
<div className="p-xl bg-off-white border-t border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-md">
<p className="text-body-sm text-on-surface-variant">Showing <span className="font-bold text-dark-slate">1-{Math.min(charities.length, 10)}</span> of {charities.length} results</p>
<div className="flex items-center gap-sm">
<button className="p-sm bg-white border border-outline-variant/30 rounded-lg hover:bg-light-mist transition-colors">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 bg-primary text-on-primary rounded-lg font-bold">1</button>
<button className="w-10 h-10 bg-white border border-outline-variant/30 rounded-lg hover:bg-light-mist transition-colors">2</button>
<button className="w-10 h-10 bg-white border border-outline-variant/30 rounded-lg hover:bg-light-mist transition-colors">3</button>
<span className="mx-xs text-outline">...</span>
<button className="w-10 h-10 bg-white border border-outline-variant/30 rounded-lg hover:bg-light-mist transition-colors">16</button>
<button className="p-sm bg-white border border-outline-variant/30 rounded-lg hover:bg-light-mist transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
{/*  SECONDARY ANALYTICS GRID  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-4xl">
<div className="bg-white p-xl rounded-xl shadow-sm border border-outline-variant/10">
<div className="flex justify-between items-center mb-xl">
<h4 className="text-title-md font-headline-sm text-dark-slate">New Partners (This Month)</h4>
<button className="text-primary font-label-sm text-label-sm hover:underline">View all</button>
</div>
<div className="space-y-lg">
{charities.slice(0, 3).map(charity => (
<div key={charity._id} className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
  {charity.images?.[0] ? (
    <img src={charity.images[0].startsWith('http') ? charity.images[0] : `http://localhost:5000/${charity.images[0].replace(/\\/g, '/')}`} alt={charity.name} className="w-full h-full object-cover"/>
  ) : (
    <span className="material-symbols-outlined text-[18px] text-outline">volunteer_activism</span>
  )}
</div>
<span className="text-body-sm font-medium">{charity.name}</span>
</div>
<span className="text-body-sm text-on-surface-variant italic">New</span>
</div>
))}
{charities.length === 0 && (
  <div className="text-body-sm text-subtle-gray text-center py-md">No recent partners</div>
)}
</div>
</div>
<div className="bg-white p-xl rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden relative">
<div className="flex justify-between items-center mb-xl">
<h4 className="text-title-md font-headline-sm text-dark-slate">Category Distribution</h4>
<span className="material-symbols-outlined text-outline">more_vert</span>
</div>
{/*  Mock Donut Chart Placeholder  */}
<div className="flex items-center justify-center py-xl gap-3xl">
<div className="relative w-32 h-32">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="45, 100" strokeLinecap="round" strokeWidth="4"></path>
<path className="text-impact-green-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="25, 100" stroke-dashoffset="-45" strokeLinecap="round" strokeWidth="4"></path>
<path className="text-momentum-orange-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="15, 100" stroke-dashoffset="-70" strokeLinecap="round" strokeWidth="4"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-title-md font-bold text-dark-slate">{charities.length}</span>
<span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Total</span>
</div>
</div>
<div className="flex flex-col gap-sm">
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-body-sm font-medium">Education</span>
</div>
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-impact-green-dark"></div>
<span className="text-body-sm font-medium">Environment</span>
</div>
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-momentum-orange-dark"></div>
<span className="text-body-sm font-medium">Health</span>
</div>
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
<span className="text-body-sm font-medium">Others</span>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  FOOTER BAR  */}
<footer className="bg-white px-margin py-md border-t border-outline-variant/10 flex justify-between items-center text-label-sm text-on-surface-variant">
<span>© 2024 ImpactScore Administrative Platform v2.4</span>
<div className="flex items-center gap-xl">
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-primary transition-colors" href="#">Help Center</a>
<a className="hover:text-primary transition-colors" href="#">API Status: <span className="text-impact-green-dark font-bold">Stable</span></a>
</div>
</footer>
</main>
    </>
  );
};
