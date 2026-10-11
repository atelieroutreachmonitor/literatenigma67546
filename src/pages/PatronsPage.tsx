import { useState } from 'react';
import { Crown, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { PageHero, SectionTitle, Card, SectionLoader, EmptyState, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { useQuery } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { Input, TextArea } from '@/pages/CoursesPage';
import type { Patron } from '@/lib/types';

const patronsHero = 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function PatronsPage() {
  useScrollReveal();
  const { data: patrons, loading } = useQuery<Patron>('patrons', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  const trustees = patrons?.filter((p) => p.role === 'trustee') || [];
  const patronsList = patrons?.filter((p) => p.role === 'patron') || [];

  return (
    <div>
      <PageHero
        eyebrow="Leadership & Support"
        title="Patrons & Trustees"
        subtitle="The distinguished individuals who champion our mission and guide our vision for women's empowerment worldwide."
        image={patronsHero}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : patrons && patrons.length > 0 ? (
            <>
              {trustees.length > 0 && (
                <>
                  <SectionTitle eyebrow="Governance" title="Our Trustees" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {trustees.map((patron, i) => (
                      <PatronCard key={patron.id} patron={patron} delay={i * 0.08} />
                    ))}
                  </div>
                </>
              )}

              {patronsList.length > 0 && (
                <>
                  <SectionTitle eyebrow="Champions" title="Our Patrons" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {patronsList.map((patron, i) => (
                      <PatronCard key={patron.id} patron={patron} delay={i * 0.08} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState title="Building Our Circle" message="We are assembling a distinguished group of patrons and trustees who share our commitment to empowering women and girls. Check back soon to meet them." />
          )}
        </div>
      </section>

      {/* Become a Patron CTA */}
      <BecomePatronSection />
    </div>
  );
}

function PatronCard({ patron, delay }: { patron: Patron; delay: number }) {
  return (
    <Card className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 animate-on-scroll" >
      <div className="aspect-[4/5] overflow-hidden" style={{ transitionDelay: `${delay}s` }}>
        {patron.portrait_url ? (
          <img src={patron.portrait_url} alt={patron.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-plum-100 flex items-center justify-center">
            <Crown className="w-12 h-12 text-plum-300" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-playfair text-xl font-bold text-plum-700 mb-1">{patron.name}</h3>
        {patron.title && <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-3">{patron.title}</p>}
        {patron.bio && <p className="font-lato text-sm text-charcoal-600 leading-relaxed">{patron.bio}</p>}
      </div>
    </Card>
  );
}

function BecomePatronSection() {
  useScrollReveal();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', location: '', role_interest: 'patron', occupation: '', motivation: '', experience: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('patron_submissions').insert(form);
    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ full_name: '', email: '', phone: '', location: '', role_interest: 'patron', occupation: '', motivation: '', experience: '' });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-plum-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-lg blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 animate-on-scroll">
          <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3">Get Involved</p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Become a Patron or Trustee</h2>
          <p className="font-lato text-cream-100/80 max-w-2xl mx-auto">
            Join a circle of changemakers dedicated to elevating women and girls. Your support, expertise, and network can transform lives.
          </p>
        </div>

        {!showForm ? (
          <div className="text-center animate-on-scroll">
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-plum-950 font-lato font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-0.5">
              <Heart className="w-5 h-5" fill="currentColor" />
              Express Your Interest
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-2xl mx-auto animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Thank You!</h3>
            <p className="font-lato text-charcoal-600 mb-6 max-w-md mx-auto">
              Your interest has been received. Our team will review your application and reach out shortly to discuss next steps.
            </p>
            <Link to="/" className="font-lato text-sm text-plum-600 hover:text-plum-700 inline-flex items-center gap-1">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm space-y-4 max-w-2xl mx-auto animate-scale-in">
            <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Input label="Location (City, Country)" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
            <div>
              <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Role of Interest</label>
              <select value={form.role_interest} onChange={(e) => setForm({ ...form, role_interest: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm focus:outline-none focus:border-plum-500">
                <option value="patron">Patron</option>
                <option value="trustee">Trustee</option>
              </select>
            </div>
            <Input label="Occupation / Profession" value={form.occupation} onChange={(v) => setForm({ ...form, occupation: v })} />
            <TextArea label="Why do you want to join?" value={form.motivation} onChange={(v) => setForm({ ...form, motivation: v })} rows={3} />
            <TextArea label="Relevant experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} rows={3} />
            {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting...' : 'Submit Application'}
              {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
