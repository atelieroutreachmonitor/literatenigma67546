import { useState } from 'react';
import { Handshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';

const partnerImage = 'https://images.pexels.com/photos/8761551/pexels-photo-8761551.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function PartnerPage() {
  useScrollReveal();
  const [form, setForm] = useState({
    organization: '', contact_name: '', email: '', phone: '', website: '', partnership_type: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('partner_submissions').insert(form);
    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ organization: '', contact_name: '', email: '', phone: '', website: '', partnership_type: '', message: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Collaborate With Us"
        title="Partner With Us"
        subtitle="Together we can amplify our impact. Partner with Women Elevation and Empowerment Initiative to empower more women and girls."
        image={partnerImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="animate-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-plum-600 text-white flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7" />
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-6">Why Partner With Us?</h2>
              <div className="space-y-5">
                {[
                  { title: 'Amplify Your Impact', desc: 'Reach thousands of women and girls across multiple continents through our programs.' },
                  { title: 'Co-Create Programs', desc: 'Design initiatives together that align with your organization\'s values and our mission.' },
                  { title: 'Global Visibility', desc: 'Showcase your commitment to gender equality through our platforms and events.' },
                  { title: 'Measurable Results', desc: 'Track the real impact of your partnership through our reporting and case studies.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gold-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-lato font-bold text-charcoal-800 mb-1">{item.title}</h3>
                      <p className="font-lato text-sm text-charcoal-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-on-scroll">
              {status === 'success' ? (
                <div className="bg-white rounded-3xl p-10 border border-plum-100 shadow-sm text-center">
                  <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Thank You!</h3>
                  <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
                    Your partnership inquiry has been received. Our team will review your request and reach out shortly.
                  </p>
                  <div className="mt-4">
                    <Link to="/" className="font-lato text-sm text-plum-600 hover:text-plum-700 inline-flex items-center gap-1">
                      Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-4">
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-2">Partnership Inquiry</h3>
                  <p className="font-lato text-sm text-charcoal-500 mb-4">Tell us about your organization and how you'd like to partner.</p>
                  <Input label="Organization Name" value={form.organization} onChange={(v) => setForm({ ...form, organization: v })} required />
                  <Input label="Contact Name" value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} required />
                  <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Input label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Partnership Type</label>
                    <select value={form.partnership_type} onChange={(e) => setForm({ ...form, partnership_type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                      <option value="">Select type</option>
                      <option value="Corporate">Corporate Partnership</option>
                      <option value="NGO">NGO Collaboration</option>
                      <option value="Sponsorship">Event Sponsorship</option>
                      <option value="Program">Program Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <TextArea label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} rows={4} />
                  {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                  <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                    {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
