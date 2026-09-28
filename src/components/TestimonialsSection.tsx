import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import type { Testimonial } from '@/lib/types';

const fallbackTestimonial: Testimonial = {
  id: 'fallback',
  quote: 'Women Elevation and Empowerment Initiative gave me more than skills — it gave me a voice. I now run my own tailoring business and mentor 12 young women in my community.',
  author_name: 'Amara Osei',
  author_role: 'Program Graduate',
  author_location: 'Accra, Ghana',
  photo_url: null,
  published: true,
  sort_order: 0,
};

export function TestimonialsSection() {
  const { data } = useQuery<Testimonial>('testimonials', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  const testimonials = data && data.length > 0 ? data : [fallbackTestimonial];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[current];

  return (
    <section className="py-20 md:py-28 bg-plum-950 relative overflow-hidden">
      <div className="absolute top-10 left-10 text-plum-800 opacity-30">
        <Quote className="w-32 h-32" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
        <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-6 animate-on-scroll">
          Voices of Change
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8 animate-on-scroll">
          Their Stories
        </h2>

        <div className="relative min-h-[280px] md:min-h-[320px] flex items-center justify-center">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: i === current ? 'auto' : 'none',
              }}
            >
              {t.photo_url && (
                <img
                  src={t.photo_url}
                  alt={t.author_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 mb-6"
                />
              )}
              <blockquote className="font-playfair text-xl md:text-2xl lg:text-3xl text-cream-100 leading-relaxed italic mb-8 text-balance">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="font-lato font-bold text-gold-400">{t.author_name}</p>
                <p className="font-lato text-sm text-cream-200/60 mt-1">
                  {t.author_role}{t.author_location ? ` · ${t.author_location}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-gold-400' : 'w-2 bg-cream-200/30 hover:bg-cream-200/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
