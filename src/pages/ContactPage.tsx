import { useState } from 'react';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { WHATSAPP_CHANNEL } from '@/lib/constants';
import { Input, TextArea } from '@/pages/CoursesPage';

export function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ full_name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('contact_submissions').insert(form);
    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ full_name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Have a question or want to reach out? We'd love to hear from you."
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
            <div className="animate-on-scroll">
              <h2 className="font-playfair text-3xl font-bold text-plum-700 mb-6">Reach Out</h2>
              <p className="font-lato text-charcoal-600 mb-8 leading-relaxed">
                Whether you want to volunteer, partner, donate, or just learn more, we're here to connect.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-plum-600 text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Mail Us</p>
                    <a href="mailto:info@weeinitiative.org" className="font-lato text-charcoal-700 hover:text-plum-600 transition-colors">info@weeinitiative.org</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-plum-600 text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Call Us</p>
                    <p className="font-lato text-charcoal-700">Available upon request</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-plum-600 text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Location</p>
                    <p className="font-lato text-charcoal-700">Global · Headquartered in West Africa</p>
                  </div>
                </div>
                <a
                  href={WHATSAPP_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-lato font-semibold text-sm rounded-lg transition-all hover:shadow-lg mt-2"
                >
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  Join Our WhatsApp Channel
                </a>
              </div>
            </div>

            <div className="animate-on-scroll">
              {status === 'success' ? (
                <div className="bg-white rounded-3xl p-10 border border-plum-100 shadow-sm text-center">
                  <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Message Sent!</h3>
                  <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setStatus('idle')}>Send Another Message</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-4">
                  <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-2">Send a Message</h3>
                  <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                  <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Input label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
                  <TextArea label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} required rows={5} />
                  {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                  <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
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
