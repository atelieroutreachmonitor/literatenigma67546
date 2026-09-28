import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';

export function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('unsubscribe_submissions').insert({ email, reason });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setEmail('');
      setReason('');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-32">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-plum-600 text-white mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-3">Unsubscribe</h1>
          <p className="font-lato text-charcoal-600">
            We're sorry to see you go. Please confirm your email and let us know why so we can improve.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-2xl p-8 border border-plum-100 shadow-sm text-center">
            <CheckCircle2 className="w-14 h-14 text-gold-500 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-2">You're Unsubscribed</h3>
            <p className="font-lato text-charcoal-600">
              You will no longer receive newsletter emails from us. If this was a mistake, you can subscribe again anytime.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-2xl p-8 border border-plum-100 shadow-sm space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(v) => setEmail(v)} required />
            <TextArea label="Why are you unsubscribing? (optional)" value={reason} onChange={(v) => setReason(v)} rows={4} />
            {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-plum-600 hover:bg-plum-700 disabled:opacity-60 text-white font-lato font-semibold text-sm rounded-lg transition-all"
            >
              {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
