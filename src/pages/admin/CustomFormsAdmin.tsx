import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, X, RefreshCw, ChevronDown, ChevronUp, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui';
import type { CustomForm, CustomFormQuestion } from '@/lib/types';

export function CustomFormsAdmin() {
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [creating, setCreating] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formHeaderText, setFormHeaderText] = useState('');
  const [questions, setQuestions] = useState<Partial<CustomFormQuestion>[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('custom_forms').select('*').order('created_at', { ascending: false });
    setForms((data as CustomForm[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startCreate = () => {
    setCreating(true);
    setEditingForm(null);
    setFormTitle('');
    setFormDescription('');
    setFormHeaderText('');
    setQuestions([{ label: '', field_type: 'text', required: false, sort_order: 0 }]);
    setError(null);
  };

  const startEdit = async (form: CustomForm) => {
    setEditingForm(form);
    setCreating(false);
    setFormTitle(form.title);
    setFormDescription(form.description || '');
    setFormHeaderText(form.header_text || '');
    const { data } = await supabase
      .from('custom_form_questions')
      .select('*')
      .eq('form_id', form.id)
      .order('sort_order', { ascending: true });
    setQuestions((data as CustomFormQuestion[]) || [{ label: '', field_type: 'text', required: false, sort_order: 0 }]);
    setError(null);
  };

  const addQuestion = () => {
    setQuestions([...questions, { label: '', field_type: 'text', required: false, sort_order: questions.length }]);
  };

  const updateQuestion = (i: number, field: keyof Partial<CustomFormQuestion>, value: string | boolean) => {
    const next = [...questions];
    next[i] = { ...next[i], [field]: value };
    setQuestions(next);
  };

  const removeQuestion = (i: number) => {
    setQuestions(questions.filter((_, idx) => idx !== i).map((q, idx) => ({ ...q, sort_order: idx })));
  };

  const moveQuestion = (i: number, dir: number) => {
    const target = i + dir;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[i], next[target]] = [next[target], next[i]];
    setQuestions(next.map((q, idx) => ({ ...q, sort_order: idx })));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const validQuestions = questions.filter((q) => q.label && q.label.trim());
    try {
      let formId: string;
      if (creating) {
        const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const { data, error: err } = await supabase.from('custom_forms').insert({
          title: formTitle,
          description: formDescription || null,
          header_text: formHeaderText || null,
          slug,
          published: false,
          sort_order: 0,
        }).select('id').single();
        if (err) throw new Error(err.message);
        formId = (data as { id: string }).id;
      } else if (editingForm) {
        const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const { error: err } = await supabase.from('custom_forms').update({
          title: formTitle,
          description: formDescription || null,
          header_text: formHeaderText || null,
          slug,
        }).eq('id', editingForm.id);
        if (err) throw new Error(err.message);
        formId = editingForm.id;
        await supabase.from('custom_form_questions').delete().eq('form_id', formId);
      } else {
        throw new Error('No form selected');
      }

      if (validQuestions.length > 0) {
        const rows = validQuestions.map((q, i) => ({
          form_id: formId,
          label: q.label!.trim(),
          field_type: q.field_type || 'text',
          required: q.required || false,
          sort_order: i,
        }));
        const { error: qErr } = await supabase.from('custom_form_questions').insert(rows);
        if (qErr) throw new Error(qErr.message);
      }

      setCreating(false);
      setEditingForm(null);
      setQuestions([]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setSaving(false);
  };

  const togglePublished = async (form: CustomForm) => {
    await supabase.from('custom_forms').update({ published: !form.published }).eq('id', form.id);
    await load();
  };

  const deleteForm = async (form: CustomForm) => {
    if (!confirm(`Delete "${form.title}"? All submissions will also be deleted.`)) return;
    await supabase.from('custom_forms').delete().eq('id', form.id);
    await load();
  };

  const shareUrl = (form: CustomForm) => `${window.location.origin}/#/forms/${form.slug || form.id}`;

  if (creating || editingForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Settings</p>
            <h2 className="font-playfair text-2xl font-bold text-plum-700">{creating ? 'Create' : 'Edit'} Custom Form</h2>
          </div>
          <button onClick={() => { setCreating(false); setEditingForm(null); }} className="p-2 text-charcoal-400 hover:bg-plum-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4"><p className="font-lato text-sm text-red-600">{error}</p></div>}

        <div className="bg-white rounded-2xl border border-plum-100 p-6 space-y-5">
          <div>
            <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Form Title</label>
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Event Registration"
              className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm focus:outline-none focus:border-plum-500" />
          </div>
          <div>
            <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Description (optional)</label>
            <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm focus:outline-none focus:border-plum-500 resize-none" />
          </div>
          <div>
            <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Header Text (shown on form page)</label>
            <input value={formHeaderText} onChange={(e) => setFormHeaderText(e.target.value)} placeholder="Welcome message for form respondents"
              className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm focus:outline-none focus:border-plum-500" />
          </div>

          <div className="pt-4 border-t border-plum-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-playfair text-lg font-bold text-plum-700">Questions</h3>
              <button onClick={addQuestion} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-plum-600 text-white rounded-lg font-lato text-xs font-semibold hover:bg-plum-700">
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 bg-cream-50 rounded-xl p-3 border border-plum-100">
                  <div className="flex flex-col gap-1 pt-2">
                    <button onClick={() => moveQuestion(i, -1)} disabled={i === 0} className="text-plum-500 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} className="text-plum-500 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2">
                    <input value={q.label || ''} onChange={(e) => updateQuestion(i, 'label', e.target.value)} placeholder="Question label"
                      className="px-3 py-2 rounded-lg border border-plum-200 bg-white font-lato text-sm focus:outline-none focus:border-plum-500" />
                    <select value={q.field_type || 'text'} onChange={(e) => updateQuestion(i, 'field_type', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-plum-200 bg-white font-lato text-sm focus:outline-none focus:border-plum-500">
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="select">Dropdown</option>
                    </select>
                    <label className="flex items-center gap-1.5 px-2 py-2">
                      <input type="checkbox" checked={q.required || false} onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                        className="w-4 h-4 accent-plum-600" />
                      <span className="font-lato text-xs text-charcoal-600">Required</span>
                    </label>
                  </div>
                  <button onClick={() => removeQuestion(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {questions.length === 0 && <p className="font-lato text-sm text-charcoal-400 text-center py-4">No questions yet. Click "Add Question" to start.</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { setCreating(false); setEditingForm(null); }} className="px-5 py-2.5 rounded-lg font-lato text-sm font-semibold text-charcoal-600 hover:bg-plum-50">Cancel</button>
            <button onClick={save} disabled={saving || !formTitle.trim()} className="px-6 py-2.5 rounded-lg font-lato text-sm font-semibold bg-plum-600 text-white hover:bg-plum-700 disabled:opacity-60 inline-flex items-center gap-2">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Settings</p>
          <h2 className="font-playfair text-2xl font-bold text-plum-700">Custom Forms</h2>
          <p className="font-lato text-sm text-charcoal-500 mt-1">{forms.length} form{forms.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={startCreate} className="px-4 py-2 bg-plum-600 hover:bg-plum-700 text-white font-lato text-sm font-semibold rounded-xl">+ Create Form</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner className="text-plum-500" /></div>
      ) : forms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-plum-100 p-12 text-center">
          <p className="font-lato text-charcoal-500">No custom forms yet. Create one to collect responses for any purpose.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-2xl border border-plum-100 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <button onClick={() => setExpandedId(expandedId === form.id ? null : form.id)} className="flex-1 text-left">
                  <h3 className="font-playfair text-lg font-bold text-plum-700">{form.title}</h3>
                  {form.description && <p className="font-lato text-sm text-charcoal-500 mt-0.5">{form.description}</p>}
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${form.published ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-500'}`}>
                    {form.published ? 'Published' : 'Draft'}
                  </span>
                  <button onClick={() => startEdit(form)} className="font-lato text-xs font-semibold text-plum-600 hover:text-plum-700">Edit</button>
                  <button onClick={() => togglePublished(form)} className="font-lato text-xs font-semibold text-gold-600 hover:text-gold-700">
                    {form.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteForm(form)} className="font-lato text-xs font-semibold text-red-500 hover:text-red-600">Delete</button>
                </div>
              </div>
              {expandedId === form.id && (
                <div className="border-t border-plum-100 p-4 bg-cream-50">
                  <p className="font-lato text-xs text-charcoal-500 mb-2">Share this link to collect responses:</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value={shareUrl(form)} className="flex-1 px-3 py-2 rounded-lg border border-plum-200 bg-white font-lato text-xs text-charcoal-600" />
                    <button onClick={() => { navigator.clipboard.writeText(shareUrl(form)); }} className="p-2 bg-plum-50 text-plum-600 rounded-lg hover:bg-plum-100" title="Copy"><Copy className="w-4 h-4" /></button>
                    <a href={shareUrl(form)} target="_blank" rel="noopener noreferrer" className="p-2 bg-plum-50 text-plum-600 rounded-lg hover:bg-plum-100" title="Open"><ExternalLink className="w-4 h-4" /></a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
