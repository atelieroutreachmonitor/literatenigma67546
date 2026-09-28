import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui';

export function AdminLogin() {
  const { signInWithPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = signInWithPassword(password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-plum-950 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-plum-500 rounded-lg blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400 rounded-lg blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400 text-white mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="font-lato text-sm text-cream-200/60">Women Elevation and Empowerment Initiative — Admin Dashboard</p>
        </div>

        <form onSubmit={submit} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-4">
          <div>
            <label className="block font-lato text-sm font-medium text-cream-100 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 pr-12 rounded-xl bg-plum-900/60 border border-plum-700 text-white placeholder-cream-200/40 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="Enter admin password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/50 hover:text-cream-200">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3">
              <p className="font-lato text-sm text-red-200">{error}</p>
            </div>
          )}
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-center mt-4">
          <a href="#/" className="font-lato text-xs text-cream-200/50 hover:text-gold-400 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
