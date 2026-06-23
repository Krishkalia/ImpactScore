import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: any) => {
    Swal.fire({
      title: 'Edit User Profile',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
          <label style="font-weight: 600;">Role</label>
          <select id="swal-role" class="swal2-input" style="margin-top: 0;">
            <option value="subscriber" ${user.role === 'subscriber' ? 'selected' : ''}>Subscriber</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
          <label style="font-weight: 600;">Subscription Status</label>
          <select id="swal-sub" class="swal2-input" style="margin-top: 0;">
            <option value="active" ${user.subscription?.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="inactive" ${user.subscription?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
            <option value="cancelled" ${user.subscription?.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <label style="font-weight: 600;">Golf Score</label>
          <input id="swal-golf" class="swal2-input" style="margin-top: 0;" type="number" value="${user.golfScore || 0}" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        return {
          role: (document.getElementById('swal-role') as HTMLSelectElement).value,
          subscription: { status: (document.getElementById('swal-sub') as HTMLSelectElement).value },
          golfScore: parseInt((document.getElementById('swal-golf') as HTMLInputElement).value, 10)
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/auth/users/${user._id}`, result.value);
          Swal.fire('Saved!', 'User details have been updated.', 'success');
          fetchUsers();
        } catch (err) {
          Swal.fire('Error', 'Failed to update user', 'error');
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will permanently delete the user account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/users/${id}`);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-gutter custom-scrollbar">
{/*  Header Section  */}
<div className="flex justify-between items-end mb-3xl">
<div>
<h1 className="font-headline-sm text-headline-sm text-dark-slate">User Management</h1>
<p className="font-body-md text-body-md text-subtle-gray">Manage your community members, subscriptions, and platform activity.</p>
</div>
<div className="flex gap-md">
<button className="bg-hero-blue-light text-primary font-label-sm text-label-sm px-xl py-md rounded-lg flex items-center gap-sm border border-primary/10 hover:bg-primary/10 transition-all-200">
<span className="material-symbols-outlined text-[18px]">file_download</span>
                        Export CSV
                    </button>
<button className="bg-primary text-on-primary font-label-sm text-label-sm px-xl py-md rounded-lg flex items-center gap-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all-200">
<span className="material-symbols-outlined text-[18px]">person_add</span>
                        Invite User
                    </button>
</div>
</div>
{/*  Dashboard Filters / Bento Summary  */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-3xl">
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-primary">
<p className="font-label-sm text-label-sm text-subtle-gray mb-xs uppercase tracking-wider">Total Users</p>
<h3 className="font-headline-sm text-headline-sm text-dark-slate">{users.length}</h3>
<div className="flex items-center gap-xs mt-sm text-impact-green-dark">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="font-label-sm text-label-sm">+4.2% this month</span>
</div>
</div>
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-impact-green-dark">
<p className="font-label-sm text-label-sm text-subtle-gray mb-xs uppercase tracking-wider">Active Monthly</p>
<h3 className="font-headline-sm text-headline-sm text-dark-slate">{users.length > 0 ? Math.floor(users.length * 0.8) : 0}</h3>
<p className="font-label-sm text-label-sm text-subtle-gray mt-sm">Estimated active</p>
</div>
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-win-gold">
<p className="font-label-sm text-label-sm text-subtle-gray mb-xs uppercase tracking-wider">Admins</p>
<h3 className="font-headline-sm text-headline-sm text-dark-slate">{users.filter(u => u.role === 'admin').length}</h3>
<p className="font-label-sm text-label-sm text-subtle-gray mt-sm">System administrators</p>
</div>
<div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-alert-red">
<p className="font-label-sm text-label-sm text-subtle-gray mb-xs uppercase tracking-wider">Churn Risk</p>
<h3 className="font-headline-sm text-headline-sm text-dark-slate">0</h3>
<p className="font-label-sm text-label-sm text-subtle-gray mt-sm">Pending cancellation</p>
</div>
</div>
{/*  Table Container  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
{/*  Table Filters  */}
<div className="p-lg border-b border-light-mist flex flex-wrap gap-lg items-center justify-between">
<div className="flex gap-md">
<select className="bg-light-mist border-none rounded-lg font-label-sm text-label-sm px-xl py-sm focus:ring-primary focus:ring-2 transition-all">
<option>All Statuses</option>
<option>Active</option>
<option>Lapsed</option>
<option>Cancelled</option>
</select>
<select className="bg-light-mist border-none rounded-lg font-label-sm text-label-sm px-xl py-sm focus:ring-primary focus:ring-2 transition-all">
<option>Subscription Type</option>
<option>Monthly</option>
<option>Yearly</option>
<option>Free</option>
</select>
</div>
<div className="flex items-center gap-sm">
<span className="font-label-sm text-label-sm text-subtle-gray">Showing 1-{Math.min(users.length, 10)} of {users.length}</span>
</div>
</div>
{/*  Main Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-light-mist/50">
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest">User Details</th>
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest">Status</th>
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest">Subscription</th>
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest text-center">Scores</th>
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest">Last Activity</th>
<th className="px-xl py-lg font-label-sm text-label-sm text-subtle-gray uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-light-mist">
{users.length > 0 ? users.map(user => (
<tr key={user._id} className="hover:bg-light-mist/30 transition-colors duration-150">
<td className="px-xl py-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-hero-blue-light flex items-center justify-center text-primary font-bold">{user.name?.substring(0, 2).toUpperCase() || 'U'}</div>
<div>
<p className="font-title-md text-[16px] text-dark-slate">{user.name}</p>
<p className="font-body-sm text-body-sm text-subtle-gray">{user.email}</p>
</div>
</div>
</td>
<td className="px-xl py-lg">
<span className="bg-impact-green-light text-impact-green-dark font-label-sm text-label-sm px-md py-xs rounded-full inline-flex items-center gap-xs">
<span className="w-1.5 h-1.5 rounded-full bg-impact-green-dark"></span>
                                        Active
                                    </span>
</td>
<td className="px-xl py-lg">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-dark-slate">Standard</span>
<span className="font-label-sm text-[10px] text-subtle-gray uppercase">Registered</span>
</div>
</td>
<td className="px-xl py-lg text-center">
<div className="flex flex-col items-center">
<span className="font-body-md text-body-md font-semibold text-dark-slate">{user.role === 'admin' ? 'Admin' : 'User'}</span>
<span className="font-label-sm text-[10px] text-subtle-gray bg-surface-container px-2 py-0.5 rounded-full mt-1">Score: {user.golfScore || 0}</span>
</div>
</td>
<td className="px-xl py-lg">
<span className="font-body-sm text-body-sm text-subtle-gray">{new Date(user.createdAt).toLocaleDateString()}</span>
</td>
<td className="px-xl py-lg text-right">
<div className="relative inline-block text-left group">
<button className="p-sm text-subtle-gray hover:text-dark-slate hover:bg-surface-variant rounded-lg transition-all">
<span className="material-symbols-outlined">more_vert</span>
</button>
<div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-lg shadow-high z-50 invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100">
<div className="py-sm">
<button onClick={() => handleEdit(user)} className="w-full text-left px-lg py-md font-label-sm text-label-sm text-dark-slate hover:bg-light-mist flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">edit</span> Edit Details
                                                </button>
<div className="h-px bg-light-mist my-xs"></div>
<button onClick={() => handleDelete(user._id)} className="w-full text-left px-lg py-md font-label-sm text-label-sm text-alert-red hover:bg-error-container/20 flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">delete</span> Delete Account
                                                </button>
</div>
</div>
</div>
</td>
</tr>
)) : (
  <tr>
    <td colSpan={6} className="px-xl py-lg text-center text-subtle-gray">No users found.</td>
  </tr>
)}
</tbody>
</table>
</div>
{/*  Table Pagination  */}
<div className="p-lg bg-light-mist/20 border-t border-light-mist flex items-center justify-between">
<button className="flex items-center gap-xs font-label-sm text-label-sm text-subtle-gray hover:text-primary transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Previous
                    </button>
<div className="flex items-center gap-sm">
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm shadow-sm">1</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-variant font-label-sm text-label-sm transition-colors">2</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-variant font-label-sm text-label-sm transition-colors">3</button>
<span className="text-subtle-gray">...</span>
<button className="w-8 h-8 rounded-lg hover:bg-surface-variant font-label-sm text-label-sm transition-colors">128</button>
</div>
<button className="flex items-center gap-xs font-label-sm text-label-sm text-subtle-gray hover:text-primary transition-colors">
                        Next
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
{/*  Contextual Help / Tips Section  */}
<div className="mt-4xl grid grid-cols-1 md:grid-cols-2 gap-xl">
<div className="bg-hero-blue-light/50 p-xl rounded-xl border border-primary/10 flex gap-lg">
<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary flex-shrink-0">
<span className="material-symbols-outlined">lightbulb</span>
</div>
<div>
<h4 className="font-title-md text-[18px] text-dark-slate mb-xs">Pro Admin Tip</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Use the "Lapsed" filter to identify users whose subscriptions are about to expire. Targeting these users with a momentum-based re-engagement campaign can improve retention by 15%.</p>
</div>
</div>
<div className="bg-win-gold-light/50 p-xl rounded-xl border border-win-gold/10 flex gap-lg">
<div className="w-12 h-12 bg-win-gold rounded-xl flex items-center justify-center text-on-tertiary-fixed flex-shrink-0">
<span className="material-symbols-outlined">security</span>
</div>
<div>
<h4 className="font-title-md text-[18px] text-dark-slate mb-xs">Security Protocols</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Administrative actions like password resets and account deletions are logged in the global audit trail. Ensure you verify user identity through support tickets before performing destructive actions.</p>
</div>
</div>
</div>
</main>
    </>
  );
};
