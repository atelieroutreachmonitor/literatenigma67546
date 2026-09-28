import { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle2, X, Heart, ArrowRight, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useScrollReveal } from '@/lib/router';
import { Input } from '@/pages/CoursesPage';
import { Button } from '@/components/ui';
import { formatMoney } from '@/lib/constants';

export function PaymentPage() {
  useScrollReveal();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    reference_number: '',
    message: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pendingPayments, setPendingPayments] = useState<Array<{
    id: string; amount: string; source: string; full_name: string; email: string;
    course_id?: string | null; merch_id?: string | null;
  }>>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('payment_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) {
        const coursePayments = (data as any[]).filter((p) => p.source === 'course' || p.source === 'merch');
        if (coursePayments.length > 0) {
          setPendingPayments(coursePayments);
          setForm({
            full_name: coursePayments[0].full_name || '',
            email: coursePayments[0].email || '',
            phone: '',
            reference_number: '',
            message: '',
          });
        }
      }
    })();
  }, []);

  const lockedAmount = pendingPayments.length > 0 ? pendingPayments[0].amount : null;
  const paymentSource = pendingPayments.length > 0 ? pendingPayments[0].source : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    let receipt_url: string | null = null;

    if (receiptFile) {
      const ext = receiptFile.name.split('.').pop();
      const fileName = `receipts/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, receiptFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);
        receipt_url = publicUrl;
      }
    }

    if (lockedAmount && pendingPayments[0]) {
      const { error } = await supabase
        .from('payment_submissions')
        .update({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          reference_number: form.reference_number,
          message: form.message,
          receipt_url,
          status: 'pending_verification',
        })
        .eq('id', pendingPayments[0].id);

      if (error) {
        setStatus('error');
      } else {
        setStatus('success');
        setPendingPayments([]);
      }
    } else {
      const { error } = await supabase.from('payment_submissions').insert({
        ...form,
        amount: '',
        receipt_url,
        source: 'general',
        status: 'pending',
      });

      if (error) {
        setStatus('error');
      } else {
        setStatus('success');
        setForm({ full_name: '', email: '', phone: '', reference_number: '', message: '' });
        setReceiptFile(null);
      }
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-plum-700 via-plum-800 to-plum-950">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400 text-white mb-6 animate-fade-up">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Secure Payment
          </h1>
          <p className="font-lato text-lg text-cream-100/80 mb-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Complete Your Payment
          </p>
          <p className="font-playfair text-base md:text-lg text-gold-400 italic animate-fade-up" style={{ animationDelay: '0.3s' }}>
            "Empowering one woman empowers an entire community." — Women Elevation and Empowerment Initiative
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {/* Transfer Details */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm mb-8 animate-on-scroll">
            <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-6">Transfer Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-plum-50">
                <span className="font-lato text-sm text-charcoal-500">Bank</span>
                <span className="font-lato text-sm font-semibold text-charcoal-800">Nomback Microfinance Bank</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-plum-50">
                <span className="font-lato text-sm text-charcoal-500">Account Name</span>
                <span className="font-lato text-sm font-semibold text-charcoal-800">Sharon Okeke Chidera</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-plum-50">
                <span className="font-lato text-sm text-charcoal-500">Account Number</span>
                <span className="font-lato text-sm font-bold text-charcoal-800">6060776480</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-lato text-sm text-charcoal-500">Currency</span>
                <span className="font-lato text-sm font-semibold text-charcoal-800 flex items-center gap-1.5">
                  <span className="text-base">NGN</span> Nigerian Naira
                </span>
              </div>
            </div>

            {/* Amount Due (locked) */}
            {lockedAmount && (
              <div className="mt-6 bg-plum-50 border border-plum-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-spartan text-xs uppercase tracking-wider text-plum-500 font-semibold mb-1">Amount Due</p>
                    <p className="font-playfair text-3xl font-bold text-plum-700">{lockedAmount}</p>
                    {paymentSource === 'course' && <p className="font-lato text-xs text-charcoal-500 mt-1">Course Payment</p>}
                    {paymentSource === 'merch' && <p className="font-lato text-xs text-charcoal-500 mt-1">Merchandise Order</p>}
                  </div>
                  <div className="flex items-center gap-1.5 text-plum-500">
                    <Lock className="w-4 h-4" />
                    <span className="font-lato text-xs font-semibold">Locked</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-gold-50 border border-gold-200 rounded-2xl p-5">
              <p className="font-lato text-xs text-charcoal-600 leading-relaxed">
                We are currently processing payments through a separate account managed by the initiative's owner while our dedicated organizational account is being finalized. This is a temporary arrangement. Once our dedicated account is available, payment processing will be updated accordingly. Thank you for your understanding and support as we continue to build our organization.
              </p>
              <p className="font-lato text-xs text-charcoal-500 leading-relaxed mt-2">
                Foreign currencies will be available soon.
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm mb-8 animate-on-scroll">
            <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-6">Choose Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 px-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="font-lato text-sm font-semibold text-charcoal-800">Bank Transfer</span>
                <span className="font-spartan text-xs font-semibold text-green-600 uppercase tracking-wider">Available</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-charcoal-50 border border-charcoal-200 rounded-xl opacity-60">
                <span className="font-lato text-sm font-semibold text-charcoal-500">Card</span>
                <span className="font-spartan text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Unavailable</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-charcoal-50 border border-charcoal-200 rounded-xl opacity-60">
                <span className="font-lato text-sm font-semibold text-charcoal-500">USSD</span>
                <span className="font-spartan text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Unavailable</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-charcoal-50 border border-charcoal-200 rounded-xl opacity-60">
                <span className="font-lato text-sm font-semibold text-charcoal-500">Other Methods</span>
                <span className="font-spartan text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Unavailable</span>
              </div>
            </div>
          </div>

          {/* Info badges */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              '100% of funds go directly to Women Elevation and Empowerment Initiative outreach & programs',
              'Every payment is verified manually by our team',
              'You will receive a confirmation email after verification',
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-plum-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <p className="font-lato text-xs text-charcoal-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-plum-100 shadow-sm animate-on-scroll">
            <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-6">Payment Details</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <CheckCircle2 className="w-16 h-16 text-gold-400" />
                <h3 className="font-playfair text-2xl font-bold text-plum-700">Payment Submitted!</h3>
                <p className="font-lato text-charcoal-600 text-center max-w-md">
                  Thank you for your payment. Our team will verify your submission and send you a confirmation email shortly.
                </p>
                <Button variant="primary" onClick={() => setStatus('idle')}>
                  Submit Another Payment
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />

                {lockedAmount ? (
                  <div>
                    <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">
                      Amount Due
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-lato text-sm font-semibold text-charcoal-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                      </span>
                      <input
                        type="text"
                        value={lockedAmount}
                        readOnly
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-plum-200 bg-plum-50 font-lato text-sm font-bold text-plum-700 cursor-not-allowed"
                      />
                    </div>
                    <p className="font-lato text-xs text-charcoal-400 mt-1">This amount is automatically set from your course/product and cannot be edited.</p>
                  </div>
                ) : null}

                <Input label="Reference Number" value={form.reference_number} onChange={(v) => setForm({ ...form, reference_number: v })} placeholder="Optional" />

                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">
                    Anything else you'd like to tell us? (optional)
                  </label>
                  <textarea
                    value={form.message}
                    rows={3}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">
                    Upload Receipt<span className="text-gold-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-plum-50 hover:bg-plum-100 text-plum-700 font-lato text-sm font-medium rounded-xl border border-plum-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        required
                        className="hidden"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    {receiptFile && (
                      <button type="button" onClick={() => setReceiptFile(null)} className="text-charcoal-400 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="font-lato text-xs text-charcoal-400 mt-2">PNG, JPG, PDF accepted</p>
                </div>

                {status === 'error' && (
                  <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>
                )}

                <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-full">
                  {status === 'loading' ? 'Submitting...' : 'Submit Payment'}
                  {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <Heart className="w-4 h-4 text-gold-400" fill="currentColor" />
                  <p className="font-lato text-xs text-charcoal-500">All proceeds go directly to women's empowerment programs.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
