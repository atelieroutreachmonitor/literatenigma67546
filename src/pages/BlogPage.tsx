import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, Tag, Upload, CheckCircle2, X, Heart } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState, Button } from '@/components/ui';
import { Input, TextArea } from '@/pages/CoursesPage';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/types';

const blogImage = 'https://images.pexels.com/photos/936034/pexels-photo-936034.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/936034/pexels-photo-936034.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

export function BlogPage() {
  useScrollReveal();
  const { data: posts, loading } = useQuery<BlogPost>('blog_posts', {
    eq: { column: 'published', value: true },
    order: { column: 'created_at', ascending: false },
  });
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [writeForm, setWriteForm] = useState({ author_name: '', article_name: '', email: '', summary: '', content: '', tags: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [writeStatus, setWriteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setWriteStatus('loading');
    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `blog-submissions/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, imageFile);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);
        image_url = publicUrl;
      }
    }

    const { error } = await supabase.from('blog_submissions').insert({
      ...writeForm,
      image_url,
    });

    if (error) setWriteStatus('error');
    else {
      setWriteStatus('success');
      setWriteForm({ author_name: '', article_name: '', email: '', summary: '', content: '', tags: '' });
      setImageFile(null);
      setTimeout(() => { setWriteStatus('idle'); setShowWriteForm(false); }, 4000);
    }
  };

  if (selected) {
    return <BlogDetail post={selected} onBack={() => setSelected(null)} />;
  }

  const featured = posts?.find((p) => p.featured) || posts?.[0];
  const rest = posts?.filter((p) => p.id !== featured?.id) || [];

  return (
    <div>
      <PageHero
        eyebrow="Insight and Stories"
        title="The Journal"
        subtitle="Stories of courage and insight and transformation from our community and beyond."
        image={blogImage}
      />

      <div className="bg-cream-50 pt-8 text-center">
        <Button variant="primary" onClick={() => setShowWriteForm(true)} className="mb-4">
          Write for Us <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : posts && posts.length > 0 ? (
            <>
              {featured && (
                <Card className="group mb-10 md:mb-14 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-plum-900/5 transition-all" >
                  <div onClick={() => setSelected(featured)} className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                      <img src={featured.image_url || fallbackImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-3">Featured</span>
                      {featured.category && <span className="font-lato text-xs text-charcoal-500 mb-3">{featured.category}</span>}
                      <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-plum-700 mb-4">{featured.title}</h2>
                      {featured.excerpt && <p className="font-lato text-charcoal-600 leading-relaxed mb-6">{featured.excerpt}</p>}
                      <div className="flex items-center gap-4 font-lato text-xs text-charcoal-500">
                        {featured.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {featured.author}</span>}
                        {featured.created_at && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(featured.created_at).toLocaleDateString()}</span>}
                      </div>
                      <span className="inline-flex items-center gap-2 font-lato text-sm font-semibold text-plum-600 mt-6">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {rest.map((post, i) => (
                  <Card key={post.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1  cursor-pointer flex flex-col" >
                    <div onClick={() => setSelected(post)} style={{ transitionDelay: `${i * 0.08}s` }} className="flex flex-col flex-1">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={post.image_url || fallbackImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        {post.category && (
                          <span className="inline-flex items-center gap-1.5 font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-2">
                            <Tag className="w-3.5 h-3.5" /> {post.category}
                          </span>
                        )}
                        <h3 className="font-playfair text-xl font-bold text-plum-700 mb-2">{post.title}</h3>
                        {post.excerpt && <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-4">{post.excerpt}</p>}
                        <div className="mt-auto flex items-center gap-3 font-lato text-xs text-charcoal-500">
                          {post.author && <span>{post.author}</span>}
                          {post.created_at && <span>{new Date(post.created_at).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="Words are Being Crafted" message="Our writers are working on stories, insights, and updates from the movement. Fresh articles are on the way — stay tuned!" />
          )}
        </div>
      </section>

      {/* Write for Us Modal */}
      {showWriteForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-plum-950/60 animate-fade-in" onClick={() => setShowWriteForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowWriteForm(false)} className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-1">Submit Blog</h3>
            <p className="font-lato text-sm text-charcoal-500 mb-6">Share your story, write for the journal. Your story matters. Submit your article to our team will review before publishing.</p>

            {writeStatus === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <CheckCircle2 className="w-14 h-14 text-gold-400" />
                <p className="font-lato text-charcoal-700 text-center text-lg">Thank you for your submission! Our team will review your article and reach out before publishing.</p>
              </div>
            ) : (
              <form onSubmit={submitArticle} className="space-y-4">
                <Input label="Your Name" value={writeForm.author_name} onChange={(v) => setWriteForm({ ...writeForm, author_name: v })} required />
                <Input label="Article Name" value={writeForm.article_name} onChange={(v) => setWriteForm({ ...writeForm, article_name: v })} required />
                <Input label="Email" type="email" value={writeForm.email} onChange={(v) => setWriteForm({ ...writeForm, email: v })} required />
                <Input label="Short Summary" value={writeForm.summary} onChange={(v) => setWriteForm({ ...writeForm, summary: v })} required />
                <TextArea label="Full Article" value={writeForm.content} onChange={(v) => setWriteForm({ ...writeForm, content: v })} required rows={6} />
                <Input label="Tags (comma-separated, e.g. health, empowerment, leadership)" value={writeForm.tags} onChange={(v) => setWriteForm({ ...writeForm, tags: v })} required />
                <div>
                  <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">Photo Upload</label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-plum-50 hover:bg-plum-100 text-plum-700 font-lato text-sm font-medium rounded-xl border border-plum-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </label>
                    {imageFile && <span className="font-lato text-sm text-charcoal-600 truncate">{imageFile.name}</span>}
                  </div>
                </div>
                {writeStatus === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowWriteForm(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={writeStatus === 'loading'} className="flex-1">
                    {writeStatus === 'loading' ? 'Submitting...' : 'Submit Article'}
                    {writeStatus !== 'loading' && <ArrowRight className="w-4 h-4" />}
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

function BlogDetail({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  const [likes, setLikes] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [likeStatus, setLikeStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    let mounted = true;
    const storageKey = `shecan_liked_${post.id}`;
    setHasLiked(localStorage.getItem(storageKey) === 'true');

    supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', post.id)
      .then(({ count }) => {
        if (mounted && count !== null) setLikes(count);
      });

    return () => { mounted = false; };
  }, [post.id]);

  const handleLikeClick = () => {
    if (hasLiked) return;
    setShowEmailInput((v) => !v);
  };

  const submitLike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    setLikeStatus('loading');

    const { error } = await supabase
      .from('blog_likes')
      .insert({ blog_post_id: post.id, email: userEmail.trim() });

    if (error) {
      // Unique constraint violation — already liked (possibly from another device)
      if (error.code === '23505') {
        localStorage.setItem(`shecan_liked_${post.id}`, 'true');
        setHasLiked(true);
        setShowEmailInput(false);
        setLikeStatus('idle');
      } else {
        setLikeStatus('error');
      }
      return;
    }

    localStorage.setItem(`shecan_liked_${post.id}`, 'true');
    setHasLiked(true);
    setLikes((c) => c + 1);
    setShowEmailInput(false);
    setLikeStatus('idle');
  };

  return (
    <div className="pt-20">
      <article className="bg-cream-50 min-h-screen">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={post.image_url || fallbackImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-plum-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white font-lato text-sm mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </button>
                {post.category && <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-400">{post.category}</span>}
                <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 text-balance">{post.title}</h1>
              </div>
            </div>
          </div>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-plum-600 hover:text-plum-700 font-lato text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          <div className="flex items-center gap-4 font-lato text-xs text-charcoal-500 mb-8 pb-8 border-b border-plum-100">
            {post.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>}
            {post.created_at && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString()}</span>}
          </div>
          {post.excerpt && <p className="font-lato text-lg text-charcoal-600 leading-relaxed mb-6 italic">{post.excerpt}</p>}
          {post.content && (
            <div className="font-lato text-charcoal-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {post.content}
            </div>
          )}

          {/* Like button */}
          <div className="mt-10 pt-8 border-t border-plum-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeClick}
                aria-label={hasLiked ? 'You have liked this post' : 'Like this post'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-lato text-sm font-medium transition-all ${
                  hasLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-plum-200 text-charcoal-600 hover:border-rose-300 hover:text-rose-500'
                }`
              }
              >
                <Heart className={`w-5 h-5 transition-all ${hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'fill-none'}`} />
                <span>{likes}</span>
              </button>
              {hasLiked && <span className="font-lato text-xs text-charcoal-400">You liked this post ❤</span>}
            </div>

            {showEmailInput && !hasLiked && (
              <form
                onSubmit={submitLike}
                className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3 animate-fade-in"
              >
                <div className="flex-1">
                  <Input
                    label="Your email to like this post"
                    type="email"
                    value={userEmail}
                    onChange={setUserEmail}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" disabled={likeStatus === 'loading'}>
                  {likeStatus === 'loading' ? 'Liking...' : 'Like'}
                </Button>
              </form>
            )}
            {likeStatus === 'error' && (
              <p className="font-lato text-sm text-red-500 mt-2">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
