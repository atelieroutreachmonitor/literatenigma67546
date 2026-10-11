import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { PageHero, Button, SectionLoader, EmptyState } from '@/components/ui';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { Input } from '@/pages/CoursesPage';
import type { CustomForm, CustomFormQuestion } from '@/lib/types';

export function CustomFormPage({ routeParams }: { routeParams?: Record<string, string> }) {
  useScrollReveal();
  const slugOrId = routeParams?.slug;
  const [form, setForm] = useState<CustomForm | null>(null);
  const [questions, setQuestions] = useState<CustomFormQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      if (!slugOrId) return;
      setLoading(true);
      let query = supabase.from('custom_forms').select('*').eq('published', true);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      if (isUuid) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }
      const { data: formData } = await query.maybeSingle();
      if (formData) {
        setForm(formData as CustomForm);
        const { data: qData } = await supabase
          .from('custom_form_questions')
          .select('*')
          .eq('form_id', (formData as CustomForm).id)
          .order('sort_order', { ascending: true });
        setQuestions((qData as CustomFormQuestion[]) || []);
      }
      setLoading(false);
    })();
  }, [slugOrId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setStatus('loading');

    const answersText = questions.map((q) => `${q.label}: ${answers[q.id] || ''}`).join('\n');
    const fullName = answers[questions.find((q) => q.field_type === 'text' && q.label.toLowerCase().includes('name'))?.id || ''] || '';
    const email = answers[questions.find((q) => q.field_type === 'email')?.id || ''] || '';
    const phone = answers[questions.find((q) => q.field_type === 'phone')?.id || ''] || '';

    const { error } = await supabase.from('custom_form_submissions').insert({
      form_id: form.id,
      form_title: form.title,
      answers: answersText,
      full_name: fullName || null,
      email: email || null,
      phone: phone || null,
      status: 'new',
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setAnswers({});
    }
  };

  if (loading) {
    return <div className="pt-32"><SectionLoader /></div>;
  }

  if (!form) {
    return (
      <div className="pt-32 pb-20">
        <EmptyState title="Form Not Found" message="This form may have been removed or is no longer accepting responses." />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-cream-50 min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-10 md:p-12 border border-plum-100 shadow-sm text-center animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Thank You!</h2>
            <p className="font-lato text-charcoal-600 mb-6">
              Your response has been submitted successfully. We'll be in touch soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow={form.title}
        title={form.title}
        subtitle={form.description || undefined}
      />

      <section className="py-16 md:py-24 bg-cream-50">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {form.header_text && (
            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 mb-6">
              <p className="font-lato text-sm text-charcoal-700 leading-relaxed">{form.header_text}</p>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-plum-600 text-white flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="font-playfair text-xl font-bold text-plum-700">{form.title}</h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {questions.map((q) => {
                const val = answers[q.id] || '';
                if (q.field_type === 'textarea') {
                  return (
                    <div key={q.id}>
                      <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">
                        {q.label}{q.required && <span className="text-gold-500">*</span>}
                      </label>
                      <textarea
                        required={q.required}
                        value={val}
                        rows={4}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10 resize-none"
                      />
                    </div>
                  );
                }
                return (
                  <Input
                    key={q.id}
                    label={q.label}
                    type={q.field_type === 'email' ? 'email' : 'text'}
                    required={q.required}
                    value={val}
                    onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                  />
                );
              })}

              {questions.length === 0 && (
                <p className="font-lato text-sm text-charcoal-400 text-center py-4">This form has no questions yet.</p>
              )}

              {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}

              {questions.length > 0 && (
                <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
