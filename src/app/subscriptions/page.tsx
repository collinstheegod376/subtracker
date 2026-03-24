"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SubscriptionsList() {
  const subs = [
    { name: 'Spotify Premium', plan: 'Family Plan', amount: '$16.99', cycle: 'Monthly', status: 'Active', icon: 'music_note', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbAiz28fj7_eHEB6eBOYDO7r_fmQN2Zx4YcKGkzhsGtf1m8D8494Ydrr_pYUvYZPN8LCABWTIqFSqkvAK3CtDvePkcJh-wmGzGo5s6dSD89gEizrRleB08Aepd8TcvmtjsnSKDBuoQn_mUOEs2I1DPFMEq_CXKcaRJXmhPzxBzk3fzcnvxhPuc-JB_tgYiW-e3VINkqnbZxADhPZzxBDtJDfoafxBlYzDxboK39b3WEPjvGRXAOC8iPMZKA2t0Wuy9z3fPy9pw084' },
    { name: 'Netflix', plan: '4K Ultra HD', amount: '$22.99', cycle: 'Monthly', status: 'Paused', icon: 'movie', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWPSnAuV1In9wu4XosTdL_cIbUzj6UPK7uEsJpBsTbb1vB6Y3gFyF_F3YsYeb0hp5Tt2oQ_fzHYJikifQFpaCLKJHzT6AgyNinhEOUq3T920b63VUD5SxHUkuo3izSsBFToG50J6ilYGh-e9IA7lkbzBVUVkjbGKKGvQimhG6a5k23DLOTGgqsFXVOK9K0LXeLue17iXPinu-1fRQ8LFsP9SysAmCFw5-IpckdKMdsMkJimHjiwny6GTxWn36v7rIBwUJSpko_jw9j' },
    { name: 'Adobe Creative Cloud', plan: 'All Apps Individual', amount: '$599.88', cycle: 'Annual', status: 'Active', icon: 'brush', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmo-18qfFKKPP_sm_qDUKjXcLplqX4CDLZ-6r0riAkGouwBPX9Ww2VX-yq2jNWsaSmpiBuwxUYEruvL2YzSUUWIBTvMsSX1n8muRi3zhdTZXi2Fteb_raDWOVcVUPZFrhYw1IyA-OQBm2IzcX-O8tkYIodRSv2B4Lz7BveCZ37f2LI1KlSYNLd0awdbdXNFHXCALzukOKph8txJGQeWF0jnp0Rk0X-46e65Oki_HjrPRDWSyi0fLKf4HCkqt2i9XDG3d_k7Dt7gj2c' },
    { name: 'Google One', plan: '2TB Storage Plan', amount: '$9.99', cycle: 'Monthly', status: 'Active', icon: 'cloud', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHD1voNyuoA_D4a994RfgzB8iqddgT6WLMcVUM8av7T6Ofi6x6c_jbrx_k-6QrIr55HnZkeLT28arW8u6ucYf-JPuMan_Co3Rb3LJLe352H40yVkQ9ARvlPpWpyz8_zlbeQn6icNlFXzWa6Dm_sgBxkfVpMxFI_g6NfF-kNnmn56fsb41bWsDuRTShSvK97ciFsqDvGmT9VKHpzcc9jjMq_mIXMee801V3mSWfqCDdo3BXmHXLaLfCGf9upJAbK1F3s56ilI94vbFr' }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-10 pb-20 lg:pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-primary mb-2">Subscriptions</h2>
            <p className="text-sm lg:text-base text-on-surface-variant font-medium">Manage your recurring digital editorial assets.</p>
          </div>
          <div className="flex w-full md:w-auto overflow-x-auto gap-2 p-1 bg-surface-container-low rounded-full no-scrollbar shrink-0">
            <button className="px-5 py-2 bg-white shadow-sm rounded-full text-xs lg:text-sm font-bold text-primary transition-all whitespace-nowrap">All</button>
            <button className="px-5 py-2 hover:bg-white/50 rounded-full text-xs lg:text-sm font-medium text-on-surface-variant transition-all whitespace-nowrap">Active</button>
            <button className="px-5 py-2 hover:bg-white/50 rounded-full text-xs lg:text-sm font-medium text-on-surface-variant transition-all whitespace-nowrap">Paused</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {subs.map((sub, i) => (
            <div key={i} className="group flex flex-col lg:grid lg:grid-cols-12 items-start lg:items-center p-5 lg:p-6 bg-surface-container-lowest rounded-2xl hover:shadow-lg transition-all border-none gap-4 lg:gap-0 relative">
              <div className="col-span-4 flex items-center gap-4 w-full">
                <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                  {sub.img ? (
                    <img alt="Service Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" src={sub.img} />
                  ) : (
                    <span className="material-symbols-outlined text-primary">{sub.icon}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base lg:text-lg text-primary">{sub.name}</h3>
                  <p className="text-[10px] lg:text-xs font-label text-on-surface-variant">{sub.plan}</p>
                </div>
              </div>
              
              <div className="flex w-full lg:w-auto lg:contents justify-between gap-4 mt-2 lg:mt-0">
                <div className="col-span-2">
                  <p className="text-[10px] text-on-surface-variant font-label mb-1 uppercase tracking-wider hidden lg:block">Amount</p>
                  <p className="font-headline font-bold text-base lg:text-lg text-on-surface">{sub.amount}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-[10px] text-on-surface-variant font-label mb-1 uppercase tracking-wider hidden lg:block">Cycle</p>
                  <span className={`px-2 py-1 lg:px-3 lg:py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${sub.cycle === 'Annual' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {sub.cycle}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <p className="text-[10px] text-on-surface-variant font-label mb-1 uppercase tracking-wider hidden lg:block">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${sub.status === 'Active' ? 'bg-tertiary-fixed' : 'bg-surface-dim'}`}></span>
                    <span className={`text-xs lg:text-sm font-semibold ${sub.status === 'Active' ? 'text-on-surface' : 'text-on-surface-variant'}`}>{sub.status}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-1 lg:gap-2 absolute lg:relative top-5 right-5 lg:top-auto lg:right-auto lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg lg:text-xl">edit</span>
                </button>
                <button className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg lg:text-xl">{sub.status === 'Active' ? 'pause_circle' : 'play_circle'}</span>
                </button>
                <button className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors">
                  <span className="material-symbols-outlined text-lg lg:text-xl">cancel</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:mt-12 p-6 lg:p-8 glass-card rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 rounded-full primary-gradient flex items-center justify-center text-white shadow-xl">
              <span className="material-symbols-outlined text-2xl lg:text-3xl">payments</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg lg:text-xl text-primary">Monthly Forecast</h4>
              <p className="text-xs lg:text-sm text-on-surface-variant font-medium">Estimated spend based on active cycles.</p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto pl-16 md:pl-0">
            <p className="text-[10px] lg:text-xs font-bold text-primary-container uppercase tracking-widest mb-1 font-label">Total Projection</p>
            <p className="text-3xl lg:text-4xl font-extrabold font-headline text-primary">$108.96</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
