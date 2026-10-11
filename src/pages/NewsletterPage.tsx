import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input } from '@/pages/CoursesPage';

const newsletterHero = 'https://images.pexels.com/photos/5320033/pexels-photo-5320033.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function NewsletterPage() {
  useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('newsletter_subscribers').insert({
      name: form.name || null,
      email: form.email,
      status: 'active',
    });
    if (error) {
      if (error.code === '23505') {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
      setForm({ name: '', email: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Stay Connected"
        title="Newsletter"
        subtitle="Get the latest stories, updates, and opportunities from Women Elevation and Empowerment Initiative delivered to your inbox."
        image={newsletterHero}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {status === 'success' ? (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-plum-100 shadow-sm text-center animate-scale-in">
              <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-4" />
              <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-3">You're Subscribed!</h2>
              <p className="font-lato text-charcoal-600 mb-6">
                Thank you for joining our community. Watch your inbox for stories of impact, upcoming events, and ways to get involved.
              </p>
              <Button variant="primary" onClick={() => setStatus('idle')}>
                Subscribe Another Email <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm animate-on-scroll">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-plum-600 text-white flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-plum-700">Subscribe</h2>
                  <p className="font-lato text-sm text-charcoal-500">Join thousands of changemakers</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <Input label="Your Name (optional)" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Input label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-plum-100 space-y-3">
                <p className="font-lato text-xs text-charcoal-500 font-semibold uppercase tracking-wider">What you'll get:</p>
                {[
                  'Monthly impact stories from the field',
                  'Early invitations to events and webinars',
                  'Volunteer and partnership opportunities',
                  'Updates on programs and courses',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <p className="font-lato text-sm text-charcoal-600">{item}</p>
                  </div>
                ))}
              </div>

              <p className="font-lato text-xs text-charcoal-400 mt-6 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
