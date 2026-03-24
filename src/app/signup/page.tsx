export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-extrabold font-headline text-primary mb-6 text-center">Create Account</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Full Name</label>
            <input type="text" className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint outline-none" placeholder="Alex Rivera" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Email</label>
            <input type="email" className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Password</label>
            <input type="password" className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint outline-none" placeholder="••••••••" />
          </div>
          <button className="w-full bg-primary-gradient text-white font-bold py-3 rounded-full mt-6 scale-95 hover:scale-100 transition-transform shadow-md">
            Create Account
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-on-surface-variant">
          Already have an account? <a href="/login" className="text-surface-tint font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
