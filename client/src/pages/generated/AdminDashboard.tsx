import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [draws, setDraws] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [drawRes, charityRes, userRes, alertsRes] = await Promise.all([
          api.get('/draws/admin'),
          api.get('/charities'),
          api.get('/auth/users/count').catch(() => ({ data: { count: 0 } })),
          api.get('/draws/admin/alerts').catch(() => ({ data: [] }))
        ]);
        setDraws(drawRes.data || []);
        setCharities(charityRes.data || []);
        setUserCount(userRes.data?.count || 0);
        setAlerts(alertsRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminStats();
  }, []);

  const totalPrizePool = draws.reduce((acc, draw) => acc + (draw.prizePoolTotal || 0), 0);
  const pendingDraw = draws.find(d => d.status === 'simulated' || d.status === 'pending');

  return (
    <main className="ml-0 md:ml-64 min-h-screen">
      {/*  Content Canvas  */}
      <div className="p-gutter">
        <div className="max-w-[1440px] mx-auto pt-lg">
          <div className="mb-2xl flex justify-between items-center">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Platform Overview</h2>
          </div>
          {/*  KPI Section  */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-3xl">
            {/*  KPI 1  */}
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <span className="p-2 bg-hero-blue-light text-primary rounded-lg">
                  <span className="material-symbols-outlined">groups</span>
                </span>
                <span className="text-secondary font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +12%
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-subtle-gray mb-1">Total Users</p>
              <h3 className="font-headline-sm text-headline-sm text-dark-slate">{userCount} Members</h3>
            </div>
            {/*  KPI 2  */}
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-win-gold hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <span className="p-2 bg-win-gold-light text-win-gold-muted rounded-lg">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </span>
                <span className="text-subtle-gray font-label-sm text-label-sm">Total Pool</span>
              </div>
              <p className="font-label-sm text-label-sm text-subtle-gray mb-1">Total Prize Pool</p>
              <h3 className="font-headline-sm text-headline-sm text-dark-slate">${totalPrizePool.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
            {/*  KPI 3  */}
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-impact-green-dark hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <span className="p-2 bg-impact-green-light text-impact-green-dark rounded-lg">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </span>
                <span className="text-secondary font-label-sm text-label-sm">Active Orgs</span>
              </div>
              <p className="font-label-sm text-label-sm text-subtle-gray mb-1">Charity Directory</p>
              <h3 className="font-headline-sm text-headline-sm text-dark-slate">{charities.length} Partners</h3>
            </div>
            {/*  KPI 4  */}
            <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border-l-4 border-momentum-orange-dark hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <span className="p-2 bg-momentum-orange-light text-momentum-orange-dark rounded-lg">
                  <span className="material-symbols-outlined">schedule</span>
                </span>
                <span className="text-alert-red font-label-sm text-label-sm">Active</span>
              </div>
              <p className="font-label-sm text-label-sm text-subtle-gray mb-1">Draw Status</p>
              <h3 className="font-headline-sm text-headline-sm text-dark-slate">{pendingDraw ? 'Pending Sim' : 'Up to date'}</h3>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-xl">
            {/*  Main Analytics Section  */}
            <div className="col-span-12 lg:col-span-8 space-y-xl">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                <div className="p-xl border-b border-light-mist flex justify-between items-center">
                  <h3 className="font-title-md text-title-md text-dark-slate">Recent Draw History</h3>
                  <Link to="/admin/draws" className="text-primary font-bold text-label-sm hover:underline">View All Draws</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-light-mist text-subtle-gray font-label-sm uppercase tracking-wider">
                      <tr>
                        <th className="px-xl py-md">Draw Period End</th>
                        <th className="px-xl py-md">Total Pool</th>
                        <th className="px-xl py-md">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-mist">
                      {draws.map(draw => {
                        const dateValid = draw.drawMonth && !isNaN(new Date(draw.drawMonth).getTime());
                        return (
                        <tr key={draw._id} className="hover:bg-light-mist/50 transition-colors">
                          <td className="px-xl py-lg text-body-md font-medium text-dark-slate">
                            {dateValid ? new Date(draw.drawMonth).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-xl py-lg text-body-md text-on-surface-variant font-bold">
                            ${draw.prizePoolTotal?.toLocaleString() || '0'}
                          </td>
                          <td className="px-xl py-lg">
                            <span className="px-md py-xs rounded-full bg-surface-container text-charcoal text-xs font-bold uppercase tracking-wider border border-outline-variant">
                              {draw.status}
                            </span>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/*  Side Column (Recent Alerts)  */}
            <div className="col-span-12 lg:col-span-4 space-y-xl">
              <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-xl">
                  <h3 className="font-title-md text-title-md text-dark-slate">System Alerts</h3>
                  {alerts.length > 0 && (
                    <span className="px-2 py-1 bg-alert-red/10 text-alert-red rounded font-bold text-[10px] tracking-wider uppercase">{alerts.length} New</span>
                  )}
                </div>
                <div className="space-y-md">
                  {alerts.map((alert, idx) => (
                    <div key={idx} className={`p-md rounded-lg bg-surface-container-high/40 border-l-4 ${alert.severity === 'high' ? 'border-alert-red' : 'border-momentum-orange-dark'}`}>
                      <div className="flex justify-between items-start mb-xs">
                        <p className={`font-label-sm text-label-sm font-bold ${alert.severity === 'high' ? 'text-alert-red' : 'text-momentum-orange-dark'}`}>{alert.type}</p>
                        <span className="text-[10px] text-subtle-gray">{new Date(alert.time).toLocaleDateString()}</span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2">{alert.message}</p>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-subtle-gray text-body-sm text-center py-lg">No active system alerts.</p>
                  )}
                </div>
                <Link to="/admin/settings" className="block w-full text-center mt-xl py-md text-primary font-bold text-label-sm uppercase tracking-wide hover:bg-light-mist rounded-lg transition-colors">
                  View All Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
