"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AddService() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-4 lg:p-10 pb-24">
        <div className="mb-8 lg:mb-12">
          <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full mb-4 tracking-widest hidden lg:inline-block">NEW ENTRY</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-primary tracking-tight mb-2">Catalog a New Commitment</h2>
          <p className="text-sm lg:text-base text-on-surface-variant font-medium max-w-xl">Each subscription is a chapter in your financial narrative. Define its scope and impact with precision.</p>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm space-y-8 border-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Service Identity</label>
                  <input className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-surface-tint rounded-xl px-4 py-3 text-primary font-semibold transition-all outline-none" placeholder="e.g. Bloomberg Terminal" type="text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Monetary Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                    <input className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-surface-tint rounded-xl pl-8 pr-4 py-3 text-primary font-semibold outline-none" placeholder="0.00" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Billing Cycle</label>
                  <select className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-surface-tint rounded-xl px-4 py-3 text-primary font-semibold outline-none appearance-none cursor-pointer">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Inception Date</label>
                  <input className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-surface-tint rounded-xl px-4 py-3 text-primary font-semibold outline-none cursor-pointer" type="date" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Category Classification</label>
                  <select className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-surface-tint rounded-xl px-4 py-3 text-primary font-semibold outline-none appearance-none cursor-pointer">
                    <option>Information & News</option>
                    <option>Software & Tools</option>
                    <option>Lifestyle & Wellness</option>
                    <option>Logistics & Transport</option>
                  </select>
                </div>
              </div>
              <div className="pt-8 border-t border-surface-variant flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors w-full sm:w-auto py-3">Discard Draft</button>
                <button className="bg-primary-gradient text-white px-10 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 w-full sm:w-auto">Commit to Ledger</button>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-6 lg:p-8 rounded-2xl space-y-6">
              <label className="block text-[10px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">Visual Identity</label>
              <div className="aspect-square w-24 lg:w-32 mx-auto bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-surface-tint cursor-pointer transition-colors group">
                <span className="material-symbols-outlined text-outline group-hover:text-surface-tint mb-2 text-3xl">add_photo_alternate</span>
                <span className="text-[10px] font-bold text-outline text-center">UPLOAD LOGO</span>
              </div>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
                <div className="relative flex justify-center"><span className="bg-surface-container-low px-4 text-[10px] font-bold text-outline-variant uppercase">or select preset</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBz0npMlBUKIC3HQ2U1Cb6pboEi3n5ZV-tDUrY5OPyc5p0p4I9S2WR9MErDT6xKjTqAgoUChBm-VOQNdvrROliCO5I1_JbDxEtZGWxRc0nyVxLrl46f0DYyeBvbRodvjtLgmpmV-x4DRenTtg3aEz_NximwBRWwcbZdTZGbzH0k8HcM_flogo42QjN5RbAMOhLnWpsg08JYciNzhBKalmyQiYGGtQZXSjYTNi6cnyeFu3YcpvTXLdTeMILQ9NE-X_q_exzIiSSzXHXq',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1q36gzRLUWnbvk9psrMe1B8hUWHu9qVCHYMBQt2kuvbk_3a1yMDELEu1-TkA32vFlETb7IJdL9Hz7s7vyXzUjATr1h5RDCxB7T20TVk67sIq0NlOWWf4bzVJQS0n_ksIrZINQgJYGbxEFOrdcZ14NCgoeaUeETQbfXDovtSgHdMDEUNpeVhG4SIxCdLrJ-jwvE-usfcl37FWWw1IbrFL08ABx9xwaEbfX1_RO0qso6CsuBie008nFrlDyqe-txEM5_Dy64J8e41az',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBKzAsY-FiQGODIl1_CchkeWLetY9zid3q9nl55Adi3AvF7dzhJ4Z64CNRiLbd0PxVfY88RPezESATdb4LefLziR46OAOTyi8Ma6tUWOxsA61wWtCPLr3TC12uTc_8_FiOf9U_1NMt9mBjrKJcIsf5-4iEsXLwk1p5lx-8YUsbeyki1840X3I2hG4KRFWo44lSLk-devoT4q8MAyOtlXCm3TbC0ZQHgtFk3p8IyWs1pQSu9kfupIjt-xp4LEvcCJ1F8HF7we1A2HVLx',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBSUt_JTQSOP5m11VzR2zc5s5ce3VrxpQEkfXmRbXN4K-onN9fKzxyderyCExdGPNvsFFALZ1h0d53NdIVBiNZLVQ8jn4AbTMk1x3iY1exAOclYJ_XdkVFHfrypcTKSMpmxl1mmVnYQ5F5daz4MUbfS0dn5dCSwho6QAFonRj4OZs-I6NcFwb52b0XNmNdVhsTg1_cf-dDKL5C5qDXxMyxLG6KC91cuq6opPlKfWF4G2HTY6ubhPsR9ehClqO9trBiN61q2um63n1Vf',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdcKG5RFVyEWux3EJ1Z0w3FeWucmdHhJUH2SNl_zmRUATIwnil8nAQpicXtmZ7oss_BGVDT8YW9-dDpFiVWTnnlOULRI4QG_9Kg8pg9ywTj6oa6ih1RcPY29GyvgQPNAIeV7w9eruyf83LFooyH5t3B0-NBifFXpCwKWk3zx04Paf7ryQYbNFduQZIc5gx2E16JuxZDONm5Eit-Kfa2eqCCrxNRE20U1mub7p5UWXhEtET7Ez_d5YntmRgKAfFofr0PB9A7XTg2kmM',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTSDFhI1ZWmxr0XCtyldcSmyYVkjdrw0315EkxMPFtmgEYUSp77Jv-Y74P8dhDQDVT2JfSG71hk6kHgyl5ybZPflSeCrDfDzsp2JVlmAJj1S0y6HMIz5gpmdMQu5w82bpXEeRrU6yDZygm2vQOBdIqa5d1j6iu3ivI-1xHcCAhpUR1dZUV77AwY1YRZwxF1I-8vJtAn7b8Xc0ro3ReGcG15cbHJ1_TQExjJMweVnEtb-4DaRran_W9nTtWVVnf4k9Tql7LR0BS--KQ'
                ].map((src, i) => (
                  <button key={i} className="aspect-square bg-surface-container-lowest rounded-xl flex items-center justify-center hover:shadow-md transition-shadow p-2 lg:p-3 border border-transparent hover:border-surface-tint/20 group cursor-pointer focus:border-surface-tint focus:ring-2 outline-none">
                    <img className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" src={src} alt="preset" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
