import { useState } from 'react';
import { Calendar, MapPin, Megaphone, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState } from '@/components/ui';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/router';
import type { CommunityPost } from '@/lib/types';

const communityImage = 'https://images.pexels.com/photos/36780246/pexels-photo-36780246.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/36780246/pexels-photo-36780246.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  announcement: { icon: Megaphone, color: 'bg-plum-600' },
  event: { icon: Calendar, color: 'bg-gold-400' },
  webinar: { icon: Users, color: 'bg-plum-500' },
};

function CommunityDetail({ post, onBack }: { post: CommunityPost; onBack: () => void }) {
  const config = typeConfig[post.type] || typeConfig.announcement;

  return (
    <div className="bg-cream-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-lato text-sm text-plum-600 hover:text-plum-700 mb-8 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Community
        </button>

        <article className="bg-white rounded-3xl p-8 md:p-12 border border-plum-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-lato text-xs font-semibold ${config.color}`}>
              <config.icon className="w-3.5 h-3.5" />
              {post.type}
            </span>
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-plum-700 mb-6">{post.title}</h1>

          <div className="rounded-2xl overflow-hidden mb-8">
            <img src={post.image_url || fallbackImage} alt={post.title} className="w-full h-80 md:h-96 object-cover" />
          </div>

          {(post.event_date || post.event_location) && (
            <div className="space-y-3 mb-8 bg-cream-50 p-6 rounded-2xl border border-plum-100/50">
              {post.event_date && (
                <p className="flex items-center gap-2 font-lato text-sm text-charcoal-700 font-medium">
                  <Calendar className="w-4 h-4 text-plum-500" /> {post.event_date}
                </p>
              )}
              {post.event_location && (
                <p className="flex items-center gap-2 font-lato text-sm text-charcoal-700 font-medium">
                  <MapPin className="w-4 h-4 text-plum-500" /> {post.event_location}
                </p>
              )}
            </div>
          )}

          {post.description && (
            <p className="font-lato text-charcoal-700 leading-relaxed text-base md:text-lg whitespace-pre-line mb-8">
              {post.description}
            </p>
          )}

          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold rounded-lg transition-all"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </article>
      </div>
    </div>
  );
}

export function CommunityPage() {
  useScrollReveal();
  const [selected, setSelected] = useState<CommunityPost | null>(null);

  const { data: posts, loading } = useQuery<CommunityPost>('community_posts', {
    eq: { column: 'published', value: true },
    order: { column: 'created_at', ascending: false },
  });

  if (selected) {
    return <CommunityDetail post={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <PageHero
        eyebrow="Our Community"
        title="A Global Sisterhood"
        subtitle="Stay Connected with webinars, announcements, events and opportunities."
        image={communityImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, i) => {
                const config = typeConfig[post.type] || typeConfig.announcement;
                return (
                  <Card key={post.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 animate-on-scroll flex flex-col">
                    <div style={{ transitionDelay: `${i * 0.08}s` }} className="flex flex-col flex-1">
                      <div className="aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => setSelected(post)}>
                        <img src={post.image_url || fallbackImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-lato text-xs font-semibold ${config.color}`}>
                            <config.icon className="w-3.5 h-3.5" />
                            {post.type}
                          </span>
                        </div>
                        <h3
                          className="font-playfair text-xl font-bold text-plum-700 mb-2 cursor-pointer hover:text-gold-500 transition-colors"
                          onClick={() => setSelected(post)}
                        >
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-4 line-clamp-3">
                            {post.description}
                          </p>
                        )}
                        <div className="mt-auto space-y-2">
                          {post.event_date && (
                            <p className="flex items-center gap-2 font-lato text-xs text-charcoal-500">
                              <Calendar className="w-4 h-4 text-plum-500" /> {post.event_date}
                            </p>
                          )}
                          {post.event_location && (
                            <p className="flex items-center gap-2 font-lato text-xs text-charcoal-500">
                              <MapPin className="w-4 h-4 text-plum-500" /> {post.event_location}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setSelected(post)}
                          className="inline-flex items-center gap-1.5 font-lato text-sm font-semibold text-plum-600 hover:text-plum-700 mt-4 transition-colors cursor-pointer text-left"
                        >
                          Learn more <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState title="Our Sisterhood is Growing" message="We're building a vibrant community space with events, webinars, and announcements. The conversation is just getting started — join the movement to be part of it!" />
          )}

          <div className="mt-16 bg-plum-600 rounded-3xl p-8 md:p-12 text-center text-white animate-on-scroll">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-3">Be Part of the Community</h3>
            <p className="font-lato text-cream-100/80 mb-6 max-w-xl mx-auto">
              Join the movement and connect with a global sisterhood of women and allies.
            </p>
            <Link to="/join" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-white font-lato font-semibold rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
              Join the Movement <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}