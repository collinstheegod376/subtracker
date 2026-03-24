import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-10 pb-20 lg:pb-12 max-w-6xl mx-auto">
        <section className="mb-8 lg:mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="font-label text-on-surface-variant text-xs lg:text-sm mb-1 uppercase tracking-widest font-bold">Portfolio Review</p>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">Analytics & Insights</h2>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface-container-high rounded-full font-label text-[10px] lg:text-xs font-semibold text-on-surface">LAST 12 MONTHS</button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface rounded-full font-label text-[10px] lg:text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/30 lg:border-none transition-colors">EXPORT REPORT</button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Spending Trend */}
          <div className="col-span-12 xl:col-span-8 bg-surface-container-lowest p-6 lg:p-10 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="font-headline text-lg lg:text-xl font-bold text-primary">Annual Spend Velocity</h3>
                <p className="font-label text-on-surface-variant text-xs lg:text-sm">Predictive trend based on cycles</p>
              </div>
              <div className="md:text-right">
                <span className="font-headline text-2xl lg:text-3xl font-bold text-primary">$14,240.50</span>
                <p className="font-label text-tertiary-fixed-dim text-[10px] lg:text-xs font-bold">+2.4% vs LY</p>
              </div>
            </div>

            <div className="relative h-48 lg:h-64 flex items-end justify-between gap-1 lg:gap-3 pt-4 border-b border-surface-container-highest pb-2">
              {[40, 55, 35, 70, 60, 85, 95, 80, 65, 50, 45, 30].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all hover:bg-primary-container ${i === 6 ? 'bg-primary-container' : 'bg-surface-container-low'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[8px] lg:text-[10px] font-label text-on-surface-variant tracking-widest uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="col-span-12 xl:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col items-center">
            <h3 className="font-headline text-lg font-bold text-primary mb-6 w-full text-left">Allocation</h3>
            <div className="relative w-40 h-40 lg:w-48 lg:h-48 mb-8">
              <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-primary-container"></div>
              <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-secondary-container" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 40%)' }}></div>
              <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-tertiary-fixed-dim" style={{ clipPath: 'polygon(50% 50%, 100% 40%, 100% 60%)' }}></div>
              <div className="flex items-center justify-center h-full">
                <span className="font-headline text-xl lg:text-3xl font-extrabold text-primary">82%</span>
              </div>
            </div>
            <div className="space-y-4 w-full">
              {[
                { name: 'Entertainment', val: '$420.00', bg: 'bg-primary-container' },
                { name: 'Productivity', val: '$185.20', bg: 'bg-secondary-container' },
                { name: 'Lifestyle', val: '$94.00', bg: 'bg-tertiary-fixed-dim' }
              ].map((cat, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.bg}`}></div>
                    <span className="font-body text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="font-label text-sm font-bold">{cat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Opportunities */}
          <div className="col-span-12 mt-4 space-y-6">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">verified</span>
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-primary">Savings Opportunities</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-error hover:bg-surface-container-high transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-surface rounded-lg">
                    <span className="material-symbols-outlined text-error">inactive_order</span>
                  </div>
                  <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">DORMANT</span>
                </div>
                <h4 className="font-headline font-bold text-primary mb-1">Adobe Creative Cloud</h4>
                <p className="font-body text-xs text-on-surface-variant mb-6">No activity recorded in 45 days. Potential waste.</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                  <span className="font-headline font-bold text-primary">$54.99/mo</span>
                  <button className="text-error font-label text-xs font-bold hover:underline">CANCEL NOW</button>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary-fixed hover:bg-surface-container-high transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-surface rounded-lg">
                    <span className="material-symbols-outlined text-primary">content_copy</span>
                  </div>
                  <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded text-[10px] font-bold">DUPLICATE</span>
                </div>
                <h4 className="font-headline font-bold text-primary mb-1">Dropbox + iCloud</h4>
                <p className="font-body text-xs text-on-surface-variant mb-6">Overlapping cloud storage found (4TB total).</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                  <span className="font-headline font-bold text-primary">$19.98/mo</span>
                  <button className="text-primary font-label text-xs font-bold hover:underline">CONSOLIDATE</button>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tertiary-container/10 rounded-lg">
                    <span className="material-symbols-outlined text-on-tertiary-container">monitoring</span>
                  </div>
                  <h4 className="font-headline font-bold text-primary">The Spend Pulse</h4>
                </div>
                <div className="h-16 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pulseG" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#69ff87" stopOpacity="0.5"></stop>
                        <stop offset="100%" stopColor="#69ff87" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 V 20 H 0 Z" fill="url(#pulseG)"></path>
                    <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10" fill="none" stroke="#00531e" strokeWidth="1.5"></path>
                  </svg>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Efficiency Score</p>
                    <p className="font-headline text-xl font-bold text-on-tertiary-container">94/100</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">trending_up</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
            <div className="col-span-1 bg-primary text-on-primary p-6 rounded-2xl shadow-md">
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-4">lightbulb</span>
              <h4 className="font-headline font-bold text-lg mb-2">Editorial Insight</h4>
              <p className="text-sm font-body opacity-90 leading-relaxed mb-6">Your entertainment spend is 12% higher than similar users. Consider family plan consolidation.</p>
              <button className="text-tertiary-fixed font-label text-xs font-bold uppercase tracking-widest hover:underline">Learn More</button>
            </div>
            <div className="col-span-1 lg:col-span-3 bg-surface-container-low p-6 lg:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">calendar_today</span>
                </div>
                <div>
                  <h4 className="font-headline text-lg lg:text-xl font-bold text-primary">Next Big Renewal</h4>
                  <p className="font-body text-xs lg:text-sm text-on-surface-variant">Annual Amazon Prime renewal on Sept 14th</p>
                </div>
              </div>
              <div className="md:text-right w-full md:w-auto pl-18 md:pl-0">
                <p className="font-headline text-2xl lg:text-3xl font-extrabold text-primary">$139.00</p>
                <button className="mt-2 w-full md:w-auto text-xs font-bold bg-primary text-on-primary px-4 py-2 rounded-full active:scale-95 transition-transform">SET REMINDER</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
