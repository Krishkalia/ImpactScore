

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
        <p className="text-slate-600 mt-2">Manage users, draws, charities, and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Users & Subscriptions', desc: 'Manage subscribers and view their scores', link: '/admin/users' },
          { title: 'Draw Management', desc: 'Run simulations and publish monthly draws', link: '/admin/draws' },
          { title: 'Charities', desc: 'Add, edit, or remove charity partners', link: '/admin/charities' },
          { title: 'Winner Verification', desc: 'Review proof uploads and mark payouts', link: '/admin/winners' },
          { title: 'Reports & Analytics', desc: 'View pool totals, draw stats, and impact', link: '/admin/reports' },
          { title: 'Platform Settings', desc: 'Configure global fees and draw cadence', link: '/admin/settings' },
        ].map((item, i) => (
          <a key={i} href={item.link} className="block bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
