import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowLeft, Images, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState } from '@/components/ui';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { GalleryEvent, GalleryPhoto } from '@/lib/types';

const galleryImage = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

export function GalleryPage({ routeParams }: { routeParams?: Record<string, string> }) {
  if (routeParams?.id) {
    return <GalleryDetailPage eventId={routeParams.id} />;
  }
  return <GalleryListPage />;
}

function GalleryListPage() {
  useScrollReveal();
  const { data: events, loading } = useQuery<GalleryEvent>('gallery_events', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Moments & Memories"
        title="Gallery"
        subtitle="Browse photos from our events, workshops, and community gatherings."
        image={galleryImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : events && events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 flex flex-col">
                  <Link to={`/gallery/${event.id}`} className="flex flex-col flex-1">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={event.cover_image_url || fallbackImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Images className="w-4 h-4 text-gold-500" />
                        {event.event_type ? (
                          <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500">{event.event_type}</span>
                        ) : (
                          <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500">Event</span>
                        )}
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-plum-700 mb-2">{event.title}</h3>
                      {event.description && <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-3 line-clamp-2">{event.description}</p>}
                      <div className="space-y-1">
                        {event.event_date && (
                          <p className="flex items-center gap-1.5 font-lato text-xs text-charcoal-500">
                            <Calendar className="w-3.5 h-3.5 text-plum-500" /> {event.event_date}
                          </p>
                        )}
                        {event.event_location && (
                          <p className="flex items-center gap-1.5 font-lato text-xs text-charcoal-500">
                            <MapPin className="w-3.5 h-3.5 text-plum-500" /> {event.event_location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Gallery Coming Soon" message="We're collecting photos from our events and community gatherings. Check back soon to see the moments we've shared together!" />
          )}
        </div>
      </section>
    </div>
  );
}

function GalleryDetailPage({ eventId }: { eventId: string }) {
  useScrollReveal();
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: eventData } = await supabase
        .from('gallery_events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();
      if (eventData) {
        setEvent(eventData as GalleryEvent);
        const { data: photoData } = await supabase
          .from('gallery_photos')
          .select('*')
          .eq('event_id', eventId)
          .order('sort_order', { ascending: true });
        setPhotos((photoData as GalleryPhoto[]) || []);
      }
      setLoading(false);
    })();
  }, [eventId]);

  if (loading) {
    return <div className="pt-32"><SectionLoader /></div>;
  }

  if (!event) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="font-lato text-charcoal-500">Gallery event not found.</p>
        <Link to="/gallery" className="inline-flex items-center gap-2 mt-4 font-lato text-sm text-plum-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
      </div>
    );
  }

  const mediaItems = photos.filter((p) => p.image_url || p.video_url);

  return (
    <div className="bg-cream-50 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <Link to="/gallery" className="inline-flex items-center gap-2 font-lato text-sm text-plum-600 hover:text-plum-700 mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>

        <div className="rounded-2xl overflow-hidden mb-8">
          <img src={event.cover_image_url || fallbackImage} alt={event.title} className="w-full h-64 md:h-96 object-cover" />
        </div>

        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-plum-700 mb-4">{event.title}</h1>

        {(event.event_date || event.event_location) && (
          <div className="flex flex-wrap gap-4 mb-6">
            {event.event_date && (
              <p className="flex items-center gap-2 font-lato text-sm text-charcoal-600">
                <Calendar className="w-4 h-4 text-plum-500" /> {event.event_date}
              </p>
            )}
            {event.event_location && (
              <p className="flex items-center gap-2 font-lato text-sm text-charcoal-600">
                <MapPin className="w-4 h-4 text-plum-500" /> {event.event_location}
              </p>
            )}
          </div>
        )}

        {event.description && (
          <p className="font-lato text-charcoal-700 leading-relaxed text-base md:text-lg mb-6 max-w-3xl whitespace-pre-line">
            {event.description}
          </p>
        )}

        {event.impact && (
          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6 mb-10 max-w-3xl">
            <h3 className="font-playfair text-lg font-bold text-plum-700 mb-2">Impact</h3>
            <p className="font-lato text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">{event.impact}</p>
          </div>
        )}

        {mediaItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-plum-100 hover:shadow-lg transition-all"
              >
                {item.video_url ? (
                  <div className="aspect-square overflow-hidden bg-plum-950 flex items-center justify-center">
                    <video src={item.video_url} className="w-full h-full object-cover" controls={false} muted />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Images className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square overflow-hidden">
                    <img src={item.image_url} alt={item.caption || event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                {item.caption && (
                  <p className="font-lato text-xs text-charcoal-600 p-3 line-clamp-2">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-3" />
            <p className="font-lato text-charcoal-500">No photos have been added to this event yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-plum-950/90" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white" onClick={() => setLightboxIndex(null)}>
            <X className="w-6 h-6" />
          </button>
          {mediaItems[lightboxIndex].video_url ? (
            <video src={mediaItems[lightboxIndex].video_url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
          ) : (
            <img src={mediaItems[lightboxIndex].image_url} alt={mediaItems[lightboxIndex].caption || ''} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          )}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev === null ? 0 : (prev - 1 + mediaItems.length) % mediaItems.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev === null ? 0 : (prev + 1) % mediaItems.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          {mediaItems[lightboxIndex].caption && (
            <p className="absolute bottom-6 left-0 right-0 text-center font-lato text-sm text-cream-100">{mediaItems[lightboxIndex].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
