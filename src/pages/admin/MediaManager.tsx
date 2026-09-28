import { useState } from 'react';
import { ArrowDown, ArrowUp, Eye, Film, ImagePlus, Link2, Loader2, RefreshCw, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MediaItem } from '@/lib/types';

export async function uploadToStorage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, file, { upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from('uploads').getPublicUrl(fileName).data.publicUrl;
}

function isVideo(item: MediaItem) {
  return item.media_type === 'video';
}

export function MediaManager({
  items,
  onChange,
  folder,
  allowVideo = true,
  allowCaption = true,
  label = 'Images & Videos',
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  folder: string;
  allowVideo?: boolean;
  allowCaption?: boolean;
  label?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const renumber = (list: MediaItem[]) => list.map((m, i) => ({ ...m, sort_order: i }));

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy('add');
    const added: MediaItem[] = [];
    try {
      for (const file of Array.from(files)) {
        const url = await uploadToStorage(file, folder);
        const video = file.type.startsWith('video/');
        added.push({
          image_url: video ? '' : url,
          video_url: video ? url : null,
          media_type: video ? 'video' : 'image',
          caption: '',
          sort_order: 0,
        });
      }
      onChange(renumber([...items, ...added]));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(null);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    const video = allowVideo && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
    onChange(renumber([
      ...items,
      { image_url: video ? '' : url, video_url: video ? url : null, media_type: video ? 'video' : 'image', caption: '', sort_order: 0 },
    ]));
    setUrlInput('');
  };

  const replace = async (index: number, file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(`replace-${index}`);
    try {
      const url = await uploadToStorage(file, folder);
      const video = file.type.startsWith('video/');
      const next = [...items];
      next[index] = { ...next[index], image_url: video ? '' : url, video_url: video ? url : null, media_type: video ? 'video' : 'image' };
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(null);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(renumber(next));
  };

  const remove = (index: number) => onChange(renumber(items.filter((_, i) => i !== index)));

  const setCaption = (index: number, caption: string) => {
    const next = [...items];
    next[index] = { ...next[index], caption };
    onChange(next);
  };

  const accept = allowVideo ? 'image/*,video/*' : 'image/*';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-lato text-sm font-semibold text-charcoal-700">
          {label} <span className="font-normal text-charcoal-400">({items.length})</span>
        </p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-plum-600 px-3 py-1.5 font-lato text-xs font-semibold text-white hover:bg-plum-700">
          {busy === 'add' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
          {busy === 'add' ? 'Uploading...' : allowVideo ? 'Add Images / Videos' : 'Add Images'}
          <input type="file" accept={accept} multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </label>
      </div>

      {error && <p className="font-lato text-xs text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-plum-200 px-4 py-6 text-center font-lato text-sm text-charcoal-500">
          No media yet. Upload one or many files at once.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, i) => (
            <li key={`${item.id ?? 'new'}-${i}`} className="overflow-hidden rounded-xl border border-plum-100 bg-cream-50">
              <div className="relative aspect-square bg-plum-950">
                {isVideo(item) ? (
                  <video src={item.video_url || ''} muted className="h-full w-full object-cover" />
                ) : (
                  <img src={item.image_url} alt={item.caption || `Media ${i + 1}`} className="h-full w-full object-cover" />
                )}
                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-plum-950/70 px-1.5 py-0.5 font-lato text-[0.65rem] text-white">
                  {isVideo(item) && <Film className="h-3 w-3" />}
                  {i === 0 ? 'Cover' : `#${i + 1}`}
                </span>
                {busy === `replace-${i}` && (
                  <span className="absolute inset-0 flex items-center justify-center bg-plum-950/60">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-1.5 py-1.5">
                <IconBtn label="Move left" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5 -rotate-90" /></IconBtn>
                <IconBtn label="Move right" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-3.5 w-3.5 -rotate-90" /></IconBtn>
                <IconBtn label="Preview" onClick={() => setPreview(item)}><Eye className="h-3.5 w-3.5" /></IconBtn>
                <label title="Replace" className="cursor-pointer rounded p-1 text-plum-600 hover:bg-plum-100">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="sr-only">Replace</span>
                  <input type="file" accept={accept} className="hidden" onChange={(e) => { replace(i, e.target.files?.[0]); e.target.value = ''; }} />
                </label>
                <IconBtn label="Delete" onClick={() => remove(i)} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
              </div>
              {allowCaption && (
                <input
                  type="text"
                  value={item.caption ?? ''}
                  onChange={(e) => setCaption(i, e.target.value)}
                  placeholder="Short description"
                  aria-label={`Description for media ${i + 1}`}
                  className="w-full border-t border-plum-100 bg-white px-2 py-1.5 font-lato text-xs text-charcoal-800 focus:outline-none"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); addUrl(); }
            }}
            placeholder={allowVideo ? 'Or paste an image / video URL' : 'Or paste an image URL'}
            className="w-full rounded-xl border border-plum-200 bg-cream-50 py-2 pl-9 pr-3 font-lato text-sm focus:border-plum-500 focus:outline-none"
          />
        </div>
        <button type="button" onClick={addUrl} className="rounded-xl bg-cream-100 px-3 font-lato text-sm font-semibold text-plum-700 hover:bg-plum-100">
          Add
        </button>
      </div>
      <p className="font-lato text-xs text-charcoal-400">The first item is used as the cover. Changes are saved when you click Save.</p>

      {preview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-plum-950/90 p-4" onClick={() => setPreview(null)}>
          <button type="button" aria-label="Close preview" className="absolute right-4 top-4 p-2 text-white" onClick={() => setPreview(null)}>
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {isVideo(preview) ? (
              <video src={preview.video_url || ''} controls autoPlay className="max-h-[80vh] rounded-lg" />
            ) : (
              <img src={preview.image_url} alt={preview.caption || 'Preview'} className="max-h-[80vh] rounded-lg object-contain" />
            )}
            {preview.caption && <p className="mt-3 text-center font-lato text-sm text-cream-100">{preview.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, label, onClick, disabled, danger }: {
  children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded p-1 transition disabled:opacity-30 ${danger ? 'text-red-500 hover:bg-red-50' : 'text-plum-600 hover:bg-plum-100'}`}
    >
      {children}
    </button>
  );
}
