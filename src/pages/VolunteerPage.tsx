import { useState } from 'react';
import { Heart, Users, ArrowRight, CheckCircle2, Globe, Clock, Sparkles } from 'lucide-react';
import { PageHero, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';

const volunteerImage = 'https://images.pexels.com/photos/6646880/pexels-photo-6646880.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function VolunteerPage() {
  useScrollReveal();
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', country: '', city: '',
    area_of_interest: '', availability: '', skills: '', experience: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('volunteer_submissions').insert(form);
    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ full_name: '', email: '', phone: '', country: '', city: '', area_of_interest: '', availability: '', skills: '', experience: '', message: '' });
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Lend Your Time"
        title="Volunteer With Us"
        subtitle="Join a passionate community of volunteers making a real difference in women's lives worldwide."
        image={volunteerImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Globe, title: 'Global Impact', desc: 'Volunteer remotely or on-the-ground across multiple continents.' },
              { icon: Users, title: 'Join a Community', desc: 'Connect with like-minded advocates and build lasting friendships.' },
              { icon: Sparkles, title: 'Grow Your Skills', desc: 'Develop leadership, organizing, and advocacy skills with hands-on experience.' },
            ].map((item, i) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-plum-100/50 text-center animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-plum-600 text-white flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-plum-700 mb-2">{item.title}</h3>
                <p className="font-lato text-sm text-charcoal-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto animate-on-scroll">
            {status === 'success' ? (
              <div className="bg-white rounded-3xl p-10 border border-plum-100 shadow-sm text-center">
                <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Welcome to the Team!</h3>
                <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
                  Your volunteer application has been received. Our team will reach out to you soon.
                </p>
                <div className="mt-4">
                  <Link to="/" className="font-lato text-sm text-plum-600 hover:text-plum-700 inline-flex items-center gap-1">
                    Back to Home <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-400 text-white flex items-center justify-center">
                    <Heart className="w-6 h-6" fill="currentColor" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-plum-700">Volunteer Application</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                  <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
                </div>
                <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Area of Interest</label>
                  <select value={form.area_of_interest} onChange={(e) => setForm({ ...form, area_of_interest: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                    <option value="">Select area</option>
                    <option>Education & Literacy</option>
                    <option>Entrepreneurship Training</option>
                    <option>Advocacy & Legal Aid</option>
                    <option>Menstrual Health Education</option>
                    <option>Event Organizing</option>
                    <option>Communications & Social Media</option>
                    <option>Fundraising</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5 flex items-center gap-1"><Clock className="w-4 h-4" /> Availability</label>
                  <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500">
                    <option value="">Select availability</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Flexible</option>
                    <option>One-time events</option>
                  </select>
                </div>
                <Input label="Skills" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} placeholder="e.g. teaching, social media, design..." />
                <TextArea label="Relevant Experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} />
                <TextArea label="Why do you want to volunteer?" value={form.message} onChange={(v) => setForm({ ...form, message: v })} rows={3} />
                {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
