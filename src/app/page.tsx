import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-10 pb-20 lg:pb-10 space-y-8 lg:space-y-10">
        <section className="flex flex-col gap-1">
          <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">The Monthly Edition</h2>
          <p className="font-body text-sm lg:text-base text-on-surface-variant">Your financial footprint, curated for the month of October.</p>
        </section>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Spending Card */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 lg:p-10 flex flex-col justify-between min-h-[350px] lg:min-h-[400px] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] lg:text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold">Total Commitment</span>
                <div className="flex flex-wrap items-baseline gap-2 mt-2">
                  <h3 className="font-headline text-5xl lg:text-6xl font-bold text-primary tracking-tighter">$1,248.50</h3>
                  <span className="text-tertiary-fixed-dim lg:text-sm text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 
                    4.2%
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-low p-3 lg:p-4 rounded-xl">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">account_balance_wallet</span>
              </div>
            </div>

            <div className="mt-8 relative h-32 lg:h-40 w-full bg-surface-container-low rounded-xl overflow-hidden">
              <div className="absolute inset-0 spend-pulse-gradient"></div>
              <svg className="absolute bottom-0 w-full h-full lg:h-24" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50 L100,100 L0,100 Z" fill="rgba(105, 255, 135, 0.2)"></path>
                <path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50" fill="none" stroke="#00aa45" strokeWidth="2"></path>
              </svg>
              <div className="absolute top-4 left-4 lg:left-6 flex flex-col">
                <span className="text-[10px] lg:text-xs font-bold text-on-tertiary-container">DAILY VELOCITY</span>
                <span className="text-base lg:text-lg font-headline font-bold text-primary">$41.61 / day</span>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="col-span-12 lg:col-span-4 bg-primary rounded-2xl p-6 lg:p-8 text-on-primary flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-lg lg:text-xl font-bold">Upcoming</h4>
              <span className="material-symbols-outlined text-on-primary-container">event</span>
            </div>
            <div className="space-y-6 flex-1">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">12</div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-sm truncate">Creative Cloud</p>
                  <p className="text-[10px] lg:text-xs text-on-primary-container truncate">Auto-renewing tomorrow</p>
                </div>
                <span className="font-headline font-bold text-sm">$54.99</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">15</div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-sm truncate">AWS Services</p>
                  <p className="text-[10px] lg:text-xs text-on-primary-container truncate">Usage-based estimate</p>
                </div>
                <span className="font-headline font-bold text-sm">$210.00</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">18</div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-sm truncate">Hulu + Live TV</p>
                  <p className="text-[10px] lg:text-xs text-on-primary-container truncate">Legacy Plan</p>
                </div>
                <span className="font-headline font-bold text-sm">$74.99</span>
              </div>
            </div>
            <button className="mt-8 w-full bg-white/10 hover:bg-white/20 py-3 rounded-full text-xs lg:text-sm font-bold transition-colors">
              View Calendar
            </button>
          </div>

          {/* Sector Distribution */}
          <div className="col-span-12 lg:col-span-5 bg-surface-container-low rounded-2xl p-6 lg:p-8">
            <h4 className="font-headline text-lg lg:text-xl font-bold text-primary mb-6">Sector Distribution</h4>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-surface-tint"></div>
                    <span className="font-headline font-bold text-sm text-primary">Software & SaaS</span>
                  </div>
                  <span className="font-body font-bold text-sm text-primary">$642.00</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-surface-tint w-[65%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="font-headline font-bold text-sm text-primary">Entertainment</span>
                  </div>
                  <span className="font-body font-bold text-sm text-primary">$184.20</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[25%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-on-tertiary-container"></div>
                    <span className="font-headline font-bold text-sm text-primary">Core Utilities</span>
                  </div>
                  <span className="font-body font-bold text-sm text-primary">$422.30</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-on-tertiary-container w-[40%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Subscriptions */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-lg lg:text-xl font-bold text-primary">Top Subscriptions</h4>
              <a href="/subscriptions" className="text-surface-tint font-bold text-sm hover:underline">Manage All</a>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Google One', sub: '2TB Storage • Monthly', price: '$9.99', icon: 'cloud', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
                { name: 'GitHub Pro', sub: 'Advanced Security • Annual', price: '$4.00', icon: 'terminal', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
                { name: 'Netflix Premium', sub: '4K + HDR • Monthly', price: '$22.99', icon: 'movie', status: 'DUE SOON', color: 'bg-secondary-fixed text-on-secondary-fixed' },
                { name: 'Spotify Family', sub: '6 Accounts • Monthly', price: '$16.99', icon: 'music_note', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 lg:p-4 bg-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-sm lg:text-base text-primary">{item.name}</h5>
                      <p className="text-[10px] lg:text-xs text-on-surface-variant font-medium">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-body font-bold text-sm lg:text-base text-primary">{item.price}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] lg:text-[10px] font-bold tracking-wider ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile FAB */}
      <a href="/add" className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 h-14 w-14 rounded-full primary-gradient text-on-primary shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </a>
    </DashboardLayout>
  );
}
