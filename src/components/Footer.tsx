import { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from '@/components/Link';
import { supabase } from '@/lib/supabase';

const ORG_FULL_NAME = 'Women Elevation and Empowerment Initiative';
const ORG_EMAIL = 'info@weeinitiative.org';

export function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ name, email });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setName('');
      setEmail('');
    }
  };

  return (
    <footer className="text-cream-100">
      {/* Newsletter section */}
      <div className="bg-plum-50 border-t border-plum-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-plum-200 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold-100 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-plum-600 text-white mb-5">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold text-plum-700 mb-3 text-balance">
              Join Our Newsletter
            </h3>
            <p className="font-lato text-charcoal-600 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Get updates on our programs, events, and impact stories delivered straight to your inbox.
            </p>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6 max-w-md mx-auto border border-plum-200">
                <CheckCircle2 className="w-10 h-10 text-gold-500" />
                <p className="font-lato text-sm text-plum-700">
                  Thank you for subscribing! You're now part of the movement.
                </p>
              </div>
            ) : (
              <form onSubmit={subscribe} className="max-w-md mx-auto">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-lg bg-white border border-plum-200 text-charcoal-800 placeholder-charcoal-400 font-lato text-sm focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/20 transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-lg bg-white border border-plum-200 text-charcoal-800 placeholder-charcoal-400 font-lato text-sm focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-plum-600 hover:bg-plum-700 disabled:opacity-60 text-white font-lato font-semibold text-sm rounded-full transition-all hover:shadow-lg hover:shadow-plum-600/30 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    Subscribe
                  </button>
                </div>
              </form>
            )}
            {status === 'error' && (
              <p className="font-lato text-xs text-red-500 mt-3">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-charcoal-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex flex-col leading-none mb-4">
                <span className="font-cormorant text-xl font-bold text-cream-100">Women Elevation</span>
                <span className="font-spartan text-[0.6rem] tracking-[0.2em] text-plum-700 uppercase font-semibold mt-1">&amp; EMPOWERMENT INITIATIVE</span>
                <p className="font-spartan text-[0.6rem] tracking-[0.25em] text-gold-400 uppercase font-semibold mt-3">
                  Educate &bull; Empower &bull; Advocate
                </p>
              </div>
              <p className="font-lato text-sm text-cream-200/60 leading-relaxed">
                A global women's empowerment organization dedicated to educating, empowering, and advocating for women and girls worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-spartan text-xs uppercase tracking-wider text-gold-400 font-semibold mb-4">Navigate</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'About Us', path: '/about' },
                  { label: 'Programs', path: '/programs' },
                  { label: 'Community', path: '/community' },
                  { label: 'Cases', path: '/cases' },
                  { label: 'Blog', path: '/blog' },
                  { label: 'Gallery', path: '/gallery' },
                ].map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="font-lato text-sm text-cream-200/70 hover:text-gold-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-spartan text-xs uppercase tracking-wider text-gold-400 font-semibold mb-4">Get Involved</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Join the Movement', path: '/join' },
                  { label: 'Volunteer', path: '/volunteer' },
                  { label: 'Courses', path: '/courses' },
                  { label: 'Merch', path: '/merch' },
                  { label: 'Donate', path: '/donate' },
                ].map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="font-lato text-sm text-cream-200/70 hover:text-gold-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-spartan text-xs uppercase tracking-wider text-gold-400 font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${ORG_EMAIL}`} className="font-lato text-sm text-cream-200/70 hover:text-gold-400 transition-colors">
                    {ORG_EMAIL}
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="font-lato text-sm text-cream-200/70 hover:text-gold-400 transition-colors">
                    Contact Form
                  </Link>
                </li>
                <li>
                  <Link to="/partner" className="font-lato text-sm text-cream-200/70 hover:text-gold-400 transition-colors">
                    Partner With Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-charcoal-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-lato text-xs text-cream-200/50">
              &copy; {new Date().getFullYear()} {ORG_FULL_NAME}. All rights reserved.
            </p>
            <p className="font-lato text-xs text-cream-200/50">
              Made by Hybrid Corporate Branding
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
