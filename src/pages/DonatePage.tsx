import { useState } from 'react';
import { Heart, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { CURRENCIES, DEFAULT_CURRENCY, formatMoney } from '@/lib/constants';
import { Input, TextArea } from '@/pages/CoursesPage';

export function DonatePage() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [form, setForm] = useState({
    donor_name: '', email: '', amount: '', frequency: 'One-time', purpose: 'General', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const symbol = CURRENCIES[currency]?.symbol || '₦';
  const presets = ['500', '1,000', '2,500', '5,000', '10,000', '25,000'];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const amountWithCurrency = `${symbol}${form.amount}`;
    const { error } = await supabase.from('donations').insert({ ...form, amount: amountWithCurrency, payment_status: 'pending' });
    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ donor_name: '', email: '', amount: '', frequency: 'One-time', purpose: 'General', message: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Make a Difference"
        title="Donate"
        subtitle="Your generosity funds education, training, and advocacy for women and girls worldwide."
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gold-400 text-white flex items-center justify-center mb-6">
                <Heart className="w-7 h-7" fill="currentColor" />
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-6">Your Impact</h2>
              <div className="space-y-5">
                {[
                  { amount: `${symbol}2,000`, impact: 'Provides menstrual hygiene supplies for a girl for 3 months' },
                  { amount: `${symbol}10,000`, impact: 'Funds literacy materials for 5 women' },
                  { amount: `${symbol}25,000`, impact: 'Sponsors a woman through a skill-building workshop' },
                  { amount: `${symbol}100,000`, impact: 'Supports a full leadership academy cohort' },
                ].map((item) => (
                  <div key={item.amount} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-plum-100/50">
                    <div className="font-playfair text-xl md:text-2xl font-bold text-gold-500 flex-shrink-0 w-24 md:w-28">{item.amount}</div>
                    <p className="font-lato text-sm text-charcoal-600 leading-relaxed pt-1">{item.impact}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-plum-600 text-white rounded-2xl p-6">
                <p className="font-lato text-sm text-cream-100/90 leading-relaxed">
                  <Sparkles className="w-5 h-5 text-gold-400 inline-block mr-2 -mt-1" />
                  Every donation, no matter the size, brings us closer to a world where every girl is educated and every woman is empowered.
                </p>
              </div>
            </div>

            <div>
              {status === 'success' ? (
                <div className="bg-white rounded-3xl p-10 border border-plum-100 shadow-sm text-center">
                  <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Thank You!</h3>
                  <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
                    Your donation form has been received. Our team will reach out to you shortly with further steps.
                  </p>
                  <div className="mt-4">
                    <Link to="/" className="font-lato text-sm text-plum-600 hover:text-plum-700 inline-flex items-center gap-1">
                      Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-5">
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-2">Make a Donation</h3>

                  {/* Currency selector */}
                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Currency</label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(CURRENCIES).map((code) => (
                        <button
                          key={code} type="button" onClick={() => setCurrency(code)}
                          className={`px-3 py-1.5 rounded-lg font-lato text-xs font-semibold border transition-all ${
                            currency === code ? 'bg-plum-600 text-white border-plum-600' : 'bg-cream-50 text-charcoal-700 border-plum-200 hover:border-plum-400'
                          }`}
                        >
                          {CURRENCIES[code].symbol} {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-2">Choose Amount</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presets.map((p) => (
                        <button
                          key={p} type="button" onClick={() => setForm({ ...form, amount: p })}
                          className={`px-3 py-2.5 rounded-xl font-lato text-sm font-semibold border transition-all ${
                            form.amount === p ? 'bg-plum-600 text-white border-plum-600' : 'bg-cream-50 text-charcoal-700 border-plum-200 hover:border-plum-400'
                          }`}
                        >
                          {symbol}{p}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-lato text-sm text-charcoal-400 font-semibold">{symbol}</span>
                      <input
                        type="text" placeholder="Or enter custom amount" value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })} required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Frequency</label>
                      <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                        <option>One-time</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Annually</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Purpose</label>
                      <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                        <option>General</option>
                        <option>Education</option>
                        <option>Entrepreneurship</option>
                        <option>Advocacy</option>
                        <option>Menstrual Health</option>
                      </select>
                    </div>
                  </div>
                  <Input label="Full Name" value={form.donor_name} onChange={(v) => setForm({ ...form, donor_name: v })} required />
                  <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <TextArea label="Message (optional)" value={form.message} onChange={(v) => setForm({ ...form, message: v })} rows={2} />
                  {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                  <Button type="submit" variant="gold" className="w-full" disabled={status === 'loading'}>
                    <Heart className="w-5 h-5" fill="currentColor" />
                    {status === 'loading' ? 'Processing...' : 'Donate Now'}
                  </Button>
                  <p className="font-lato text-xs text-charcoal-400 text-center">
                    After submitting, our team will reach out to you with payment instructions.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
