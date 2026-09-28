import { useState } from 'react';
import { Check, ArrowRight, CheckCircle2, Sparkles, Users, GraduationCap, Crown } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';

const tiers = [
  {
    name: 'Community Member',
    price: 'Free',
    icon: Users,
    features: ['Access to community updates', 'Monthly newsletter', 'Event invitations'],
    badge: 'Available Now',
    color: 'border-plum-200',
    accent: 'bg-plum-50 text-plum-700',
  },
  {
    name: 'Active Member',
    price: 'Coming Soon',
    icon: GraduationCap,
    features: ['All Community benefits', 'Webinar access', 'Peer network', 'Resource library'],
    badge: 'Coming Soon',
    color: 'border-gold-300',
    accent: 'bg-gold-50 text-gold-600',
  },
  {
    name: 'Champion Member',
    price: 'Coming Soon',
    icon: Crown,
    features: ['All Active benefits', 'Priority mentorship', '1:1 sessions', 'Leadership pathways', 'Certificate programs'],
    badge: 'Coming Soon',
    color: 'border-plum-400',
    accent: 'bg-plum-100 text-plum-700',
  },
];

export function JoinPage() {
  useScrollReveal();
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', country: '', city: '', interests: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('join_submissions').insert(form);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ full_name: '', email: '', phone: '', country: '', city: '', interests: '', message: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Become Part of the Movement"
        title="Join the Movement"
        subtitle="Join thousands of women and allies building a more equal, empowered world. Your moment is now."
      />

      {/* Membership Tiers */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
              Membership Tiers
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700">
              Choose Your Path
            </h2>
            <p className="font-lato text-charcoal-600 mt-4 max-w-xl mx-auto">
              Find the level of involvement that's right for you. Every member strengthens our movement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`bg-white rounded-3xl p-8 border-2 ${tier.color} hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 animate-on-scroll flex flex-col ${i === 1 ? 'md:-translate-y-4' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${tier.accent} flex items-center justify-center`}>
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-lg font-lato text-xs font-semibold ${tier.accent}`}>
                    {tier.badge}
                  </span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-1">{tier.name}</h3>
                <p className="font-playfair text-lg font-bold text-charcoal-600 mb-6">{tier.price}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="font-lato text-sm text-charcoal-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.badge === 'Available Now' ? (
                  <div className="block w-full text-center px-6 py-3 bg-plum-50 text-plum-700 font-lato font-semibold text-sm rounded-lg">
                    Free
                  </div>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center px-6 py-3 bg-plum-100 text-plum-400 font-lato font-semibold text-sm rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
              Get Started
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-4">
              Sign Up as a Community Member
            </h2>
            <p className="font-lato text-charcoal-600">
              Fill out the form below and join our WhatsApp channel to stay connected.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-cream-50 rounded-3xl p-10 border border-plum-100 shadow-sm text-center animate-scale-in">
              <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Welcome to the Movement!</h3>
              <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
                Your registration has been received. Welcome to the movement!
              </p>
              <div className="mt-4">
                <Link to="/" className="font-lato text-sm text-plum-600 hover:text-plum-700 inline-flex items-center gap-1">
                  Back to Home <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-cream-50 rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-4 animate-on-scroll">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
              </div>
              <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <div>
                <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Interests</label>
                <select value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-white font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                  <option value="">Select interest</option>
                  <option>Education & Literacy</option>
                  <option>Entrepreneurship</option>
                  <option>Advocacy & Legal Aid</option>
                  <option>Menstrual Health</option>
                  <option>Leadership Development</option>
                  <option>All of the above</option>
                </select>
              </div>
              <TextArea label="Tell us about yourself" value={form.message} onChange={(v) => setForm({ ...form, message: v })} rows={3} />
              {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining...' : 'Join the Movement'}
                {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
              </Button>
              <p className="font-lato text-xs text-charcoal-400 text-center">
                After signing up, you'll be directed to join our WhatsApp channel.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
