import { useState, useEffect, useCallback } from 'react';
import { Mail, Search, Eye, X, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui';
import type { EmailLog } from '@/lib/types';

export function EmailHistory() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('email_log').select('*').order('created_at', { ascending: false }).limit(200);
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    const { data } = await query;
    setEmails((data as EmailLog[]) || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = emails.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.recipient?.toLowerCase().includes(q) ||
      e.subject?.toLowerCase().includes(q) ||
      e.form_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-spartan text-xs uppercase tracking-wider text-gold-500 font-semibold mb-1">Settings</p>
          <h2 className="font-playfair text-2xl font-bold text-plum-700">Email History</h2>
          <p className="font-lato text-sm text-charcoal-500 mt-1">{emails.length} email{emails.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button onClick={load} className="p-2 text-plum-600 hover:bg-plum-50 rounded-lg" title="Refresh">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient, subject, or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-plum-200 bg-white font-lato text-sm focus:outline-none focus:border-plum-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-plum-200 bg-white font-lato text-sm focus:outline-none focus:border-plum-500"
        >
          <option value="all">All Statuses</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner className="text-plum-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-plum-100 p-12 text-center">
          <Mail className="w-12 h-12 text-plum-200 mx-auto mb-3" />
          <p className="font-lato text-charcoal-500">No emails found. Emails will appear here once the email system sends them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-plum-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-plum-100 bg-cream-50">
                  <th className="text-left px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Recipient</th>
                  <th className="text-left px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Subject</th>
                  <th className="text-left px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Date</th>
                  <th className="text-right px-4 py-3 font-spartan text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((email) => (
                  <tr key={email.id} className="border-b border-plum-50 hover:bg-cream-50/50 transition-colors">
                    <td className="px-4 py-3">
                      {email.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-lato text-sm text-charcoal-700">{email.recipient}</td>
                    <td className="px-4 py-3 font-lato text-sm text-charcoal-700 max-w-xs truncate">{email.subject}</td>
                    <td className="px-4 py-3 font-lato text-xs text-charcoal-500">{email.form_type || '—'}</td>
                    <td className="px-4 py-3 font-lato text-xs text-charcoal-500 whitespace-nowrap">
                      {email.created_at ? new Date(email.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedEmail(email)} className="inline-flex items-center gap-1 font-lato text-xs font-semibold text-plum-600 hover:text-plum-700">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEmail && (
        <EmailPreviewModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  );
}

function EmailPreviewModal({ email, onClose }: { email: EmailLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-plum-950/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-plum-100">
          <div>
            <h3 className="font-playfair text-lg font-bold text-plum-700">{email.subject}</h3>
            <p className="font-lato text-xs text-charcoal-500 mt-0.5">To: {email.recipient} &middot; {email.form_type || 'general'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-charcoal-400 hover:bg-plum-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 bg-cream-50">
          {email.html_body ? (
            <div className="bg-white rounded-xl border border-plum-100 overflow-hidden">
              <iframe
                srcDoc={email.html_body}
                className="w-full min-h-[400px] border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-plum-100 p-6">
              <pre className="font-lato text-sm text-charcoal-700 whitespace-pre-wrap">{email.body}</pre>
            </div>
          )}
          {email.resend_id && (
            <p className="font-lato text-xs text-charcoal-400 mt-3">Resend ID: {email.resend_id}</p>
          )}
        </div>
      </div>
    </div>
  );
}
