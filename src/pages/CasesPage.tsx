import { useState } from 'react';
import { MapPin, Heart, ArrowRight, CheckCircle2, Upload, X } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState, Button } from '@/components/ui';
import { Input, TextArea } from '@/pages/CoursesPage';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { CaseStory } from '@/lib/types';

const casesImage = 'https://images.pexels.com/photos/9844168/pexels-photo-9844168.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/9844168/pexels-photo-9844168.jpeg?auto=compress&cs=tinysrgb&h=600&w=800';

const categories = [
  'Gender-Based Violence',
  'Child Marriage',
  'Economic Hardship',
  'Legal Aid',
  'Education',
  'Assessment',
  'Mental Health',
  'Others',
];

export function CasesPage() {
  useScrollReveal();
  const { data: cases, loading } = useQuery<CaseStory>('cases', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', location: '', category: '', title: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `cases/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, imageFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);
        image_url = publicUrl;
      }
    }

    const { error } = await supabase.from('case_submissions').insert({
      ...form,
      image_url,
    });

    if (error) setStatus('error');
    else {
      setStatus('success');
      setForm({ full_name: '', email: '', phone: '', location: '', category: '', title: '', description: '' });
      setImageFile(null);
      setTimeout(() => { setStatus('idle'); setShowForm(false); }, 4000);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="REAL IMPACT"
        title="Our Cases"
        subtitle="Behind every statistic is a real woman, a real life changed. Browse our cases and help us do more."
        image={casesImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : cases && cases.length > 0 ? (
            <div className="space-y-8 md:space-y-12">
              {cases.map((story) => (
                <Card key={story.id} className="group overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                      <img src={story.image_url || fallbackImage} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      {story.program && (
                        <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-3">{story.program}</span>
                      )}
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold text-plum-700 mb-3">{story.title}</h3>
                      {story.beneficiary && (
                        <p className="font-lato text-sm font-semibold text-plum-600 mb-2">{story.beneficiary}</p>
                      )}
                      {story.location && (
                        <p className="flex items-center gap-1.5 font-lato text-xs text-charcoal-500 mb-4">
                          <MapPin className="w-4 h-4 text-plum-500" /> {story.location}
                        </p>
                      )}
                      {story.summary && <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-4">{story.summary}</p>}
                      {story.story && <p className="font-lato text-sm text-charcoal-500 leading-relaxed mb-4">{story.story}</p>}
                      {story.impact && (
                        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mt-2">
                          <p className="flex items-center gap-2 font-lato text-sm text-charcoal-700">
                            <Heart className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" />
                            {story.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Stories Worth Telling" message="We're gathering powerful stories of women whose lives have been transformed. These impact stories are being documented — return soon to be inspired!" />
          )}

          <div className="mt-16 bg-plum-600 text-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">Need Help?</h3>
            <p className="font-lato text-sm md:text-base text-plum-100 mb-6 max-w-2xl mx-auto">If you or someone you know needs assistance, submit a case and our team will review it and reach out.</p>
            <Button variant="gold" onClick={() => setShowForm(true)}>
              Submit a Case <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-plum-950/60 animate-fade-in" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-1">Submit a Case</h3>
            <p className="font-lato text-sm text-charcoal-500 mb-6">Share a case with our team. We review every submission.</p>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <CheckCircle2 className="w-14 h-14 text-gold-400" />
                <p className="font-lato text-charcoal-700 text-center text-lg">Case submitted. Our team will review your submission and reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <Input label="Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Input label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                </div>
                <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required />
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Category<span className="text-gold-500">*</span></label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10 transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Title (Short Description)" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                <TextArea label="Tell us what happened" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required rows={5} />
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Upload Photos</label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-plum-50 hover:bg-plum-100 text-plum-700 font-lato text-sm font-medium rounded-xl border border-plum-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </label>
                    {imageFile && <span className="font-lato text-sm text-charcoal-600 truncate">{imageFile.name}</span>}
                  </div>
                </div>
                {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex-1">
                    {status === 'loading' ? 'Submitting...' : 'Submit Case'}
                    {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
