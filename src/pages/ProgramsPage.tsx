import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Sparkles, Scale, Users, Heart, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHero, SectionTitle, Card, SectionLoader, EmptyState } from '@/components/ui';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Program, ProgramSection, ProgramMedia } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Sparkles, Scale, Users, Heart, GraduationCap,
};

const programImage = 'https://images.pexels.com/photos/8761349/pexels-photo-8761349.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/8761349/pexels-photo-8761349.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

export function ProgramsPage({ routeParams }: { routeParams?: Record<string, string> }) {
  if (routeParams?.id) {
    return <ProgramDetailPage programId={routeParams.id} />;
  }
  return <ProgramListPage />;
}

function ProgramListPage() {
  useScrollReveal();
  const { data: programs, loading } = useQuery<Program>('programs', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="What We Do"
        title="Our Programs"
        subtitle="From literacy to entrepreneurship, explore programs designed to unlock every woman's potential."
        image={programImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : programs && programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {programs.map((program, i) => {
                const Icon = (program.icon && iconMap[program.icon]) || Sparkles;
                return (
                  <Card key={program.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 flex flex-col">
                    <Link to={`/programs/${program.id}`} className="flex flex-col flex-1">
                      <div style={{ transitionDelay: `${i * 0.08}s` }}>
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={program.image_url || fallbackImage}
                            alt={program.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-plum-600 text-white flex items-center justify-center group-hover:bg-gold-400 transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            {program.pillar && (
                              <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500">
                                {program.pillar}
                              </span>
                            )}
                          </div>
                          <h3 className="font-playfair text-xl font-bold text-plum-700 mb-2">{program.title}</h3>
                          {program.summary && (
                            <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-4">{program.summary}</p>
                          )}
                          {program.description && (
                            <p className="font-lato text-sm text-charcoal-500 leading-relaxed">{program.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState title="Something Amazing is Brewing" message="We're crafting empowering programs tailored to uplift women and girls. Our team is working hard behind the scenes — check back soon for something transformative!" />
          )}

          <div className="mt-16 text-center animate-on-scroll">
            <SectionTitle
              eyebrow="Get Involved"
              title="Want to support our programs?"
              subtitle="Join the movement and help us fund education, training, and advocacy for women and girls."
            />
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Join the Movement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramDetailPage({ programId }: { programId: string }) {
  useScrollReveal();
  const [program, setProgram] = useState<Program | null>(null);
  const [sections, setSections] = useState<ProgramSection[]>([]);
  const [media, setMedia] = useState<ProgramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: progData } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .maybeSingle();
      if (progData) {
        setProgram(progData as Program);
        const [secRes, mediaRes] = await Promise.all([
          supabase.from('program_sections').select('*').eq('program_id', programId).order('sort_order', { ascending: true }),
          supabase.from('program_media').select('*').eq('program_id', programId).order('sort_order', { ascending: true }),
        ]);
        setSections((secRes.data as ProgramSection[]) || []);
        setMedia((mediaRes.data as ProgramMedia[]) || []);
      }
      setLoading(false);
    })();
  }, [programId]);

  if (loading) {
    return <div className="pt-32"><SectionLoader /></div>;
  }

  if (!program) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="font-lato text-charcoal-500">Program not found.</p>
        <Link to="/programs" className="inline-flex items-center gap-2 mt-4 font-lato text-sm text-plum-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    );
  }

  const Icon = (program.icon && iconMap[program.icon]) || Sparkles;
  const allImages = [program.image_url, ...media.map((m) => m.image_url)].filter(Boolean) as string[];

  return (
    <div className="bg-cream-50 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <Link to="/programs" className="inline-flex items-center gap-2 font-lato text-sm text-plum-600 hover:text-plum-700 mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>

        <article className="bg-white rounded-3xl p-8 md:p-12 border border-plum-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-plum-600 text-white flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            {program.pillar && (
              <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500">
                {program.pillar}
              </span>
            )}
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-plum-700 mb-6">{program.title}</h1>

          {allImages.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img src={allImages[activeImage] || fallbackImage} alt={program.title} className="w-full h-80 md:h-96 object-cover" />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-plum-950/60 text-white rounded-full hover:bg-plum-950/80 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-plum-950/60 text-white rounded-full hover:bg-plum-950/80 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-plum-950/60 text-white rounded-full font-lato text-xs">
                    {activeImage + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>
          )}

          {program.summary && (
            <p className="font-lato text-charcoal-700 leading-relaxed text-lg md:text-xl mb-8">{program.summary}</p>
          )}

          {program.description && (
            <Section title="About the Program">
              <p className="whitespace-pre-line">{program.description}</p>
            </Section>
          )}

          {program.objectives && <Section title="Objectives"><p className="whitespace-pre-line">{program.objectives}</p></Section>}
          {program.target_beneficiaries && <Section title="Target Beneficiaries"><p className="whitespace-pre-line">{program.target_beneficiaries}</p></Section>}
          {program.program_details && <Section title="Program Details"><p className="whitespace-pre-line">{program.program_details}</p></Section>}
          {program.dates && <Section title="Dates"><p className="whitespace-pre-line">{program.dates}</p></Section>}
          {program.location && <Section title="Location"><p className="whitespace-pre-line">{program.location}</p></Section>}
          {program.facilitators && <Section title="Facilitators"><p className="whitespace-pre-line">{program.facilitators}</p></Section>}
          {program.partners && <Section title="Partners"><p className="whitespace-pre-line">{program.partners}</p></Section>}

          {sections.map((sec) => (
            <Section key={sec.id} title={sec.title}>
              <p className="whitespace-pre-line">{sec.content}</p>
            </Section>
          ))}

          <div className="mt-12 pt-8 border-t border-plum-100 flex flex-col sm:flex-row gap-4">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Join the Movement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-white font-lato font-semibold rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Donate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-3">{title}</h2>
      <div className="font-lato text-charcoal-700 leading-relaxed text-base">{children}</div>
    </div>
  );
}
