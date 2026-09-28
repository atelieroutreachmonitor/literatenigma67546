import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useQuery<T>(table: string, opts?: {
  filter?: { column: string; value: unknown };
  eq?: { column: string; value: unknown };
  order?: { column: string; ascending?: boolean };
  limit?: number;
}) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from(table).select('*');
    if (opts?.eq) {
      query = query.eq(opts.eq.column, opts.eq.value);
    }
    if (opts?.order) {
      query = query.order(opts.order.column, { ascending: opts.order.ascending ?? true });
    }
    if (opts?.limit) {
      query = query.limit(opts.limit);
    }
    (async () => {
      setLoading(true);
      const { data: result, error: err } = await query;
      if (err) setError(err.message);
      else setData(result as T[]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, JSON.stringify(opts)]);

  return { data, loading, error };
}

export function useSingle<T>(table: string, id: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data: result, error: err } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (err) setError(err.message);
      else setData(result as T);
      setLoading(false);
    })();
  }, [table, id]);

  return { data, loading, error };
}
