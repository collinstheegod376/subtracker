"use client";

export default function Header({ toggleMobile }: { toggleMobile: () => void }) {
  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center px-4 lg:px-8 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-outline hover:text-primary transition-colors mt-1" onClick={toggleMobile}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low dark:bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface" 
            placeholder="Search subscriptions..." 
            type="text" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2 lg:gap-4 lg:border-r border-outline-variant/30 lg:pr-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-90">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-90 hidden sm:block">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 lg:px-5 primary-gradient text-white text-sm font-semibold rounded-full active:opacity-80 transition-all shadow-sm">
            <span className="hidden sm:inline">Add New</span>
            <span className="material-symbols-outlined sm:hidden text-lg mb-[-4px]">add</span>
          </button>
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwejpdhXmAqGo4DBJspfcNGlL1wxZ4nmOCLI_1FQXCWwm62Sb4kc-xR9ZKd89Hu23MPiRoEBR3inZspe23jrakP_kNwUdaDHWNPi9eJVi3a29CPv0E3ylQAxopJ0kP2J8bAiTZJuOEAJhW8CFFDScx0pI-NFC-cLBXuuFfMufKIJv29N90PwN7aNKHvChy9DambaO6I41fFLpwlUodqI6Rq8OFETC-BDR90fXRkGhboM7yhrAgcOv4P0hwlpVMNXBWL5BTDKL7Au-p" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
