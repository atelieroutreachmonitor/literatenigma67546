import { useState, useEffect } from 'react';
import { Clock, BarChart3, Users, ArrowRight, ArrowLeft, CheckCircle2, User, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHero, Card, SectionLoader, EmptyState, Button } from '@/components/ui';
import { Link } from '@/components/Link';
import { useQuery } from '@/lib/hooks';
import { useScrollReveal, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Course, CourseSection, CourseMedia } from '@/lib/types';
import { formatMoney } from '@/lib/constants';

const courseImage = 'https://images.pexels.com/photos/6550173/pexels-photo-6550173.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const fallbackImage = 'https://images.pexels.com/photos/6550173/pexels-photo-6550173.jpeg?auto=compress&cs=tinysrgb&h=500&w=700';

export function CoursesPage({ routeParams }: { routeParams?: Record<string, string> }) {
  if (routeParams?.id) {
    return <CourseDetailPage courseId={routeParams.id} />;
  }
  return <CourseListPage />;
}

function CourseListPage() {
  useScrollReveal();
  const { data: courses, loading } = useQuery<Course>('courses', {
    eq: { column: 'published', value: true },
    order: { column: 'sort_order', ascending: true },
  });

  return (
    <div>
      <PageHero
        eyebrow="Learn and Grow"
        title="Certificate and Courses"
        subtitle="Invest in yourself. Our programs are designed to equip women with skills, knowledge and recognized certifications."
        image={courseImage}
      />

      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <SectionLoader />
          ) : courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {courses.map((course, i) => (
                <Card key={course.id} className="group hover:shadow-xl hover:shadow-plum-900/5 transition-all hover:-translate-y-1 flex flex-col">
                  <Link to={`/courses/${course.id}`} className="flex flex-col flex-1">
                    <div className="aspect-[16/10] overflow-hidden" style={{ transitionDelay: `${i * 0.08}s` }}>
                      <img src={course.image_url || fallbackImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      {course.category && (
                        <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-2">{course.category}</span>
                      )}
                      <h3 className="font-playfair text-xl font-bold text-plum-700 mb-2">{course.title}</h3>
                      {course.summary && <p className="font-lato text-sm text-charcoal-600 leading-relaxed mb-4">{course.summary}</p>}
                      <div className="flex flex-wrap gap-4 mb-4 mt-auto">
                        {course.duration && (
                          <span className="flex items-center gap-1.5 font-lato text-xs text-charcoal-500">
                            <Clock className="w-4 h-4 text-plum-500" /> {course.duration}
                          </span>
                        )}
                        {course.level && (
                          <span className="flex items-center gap-1.5 font-lato text-xs text-charcoal-500">
                            <BarChart3 className="w-4 h-4 text-plum-500" /> {course.level}
                          </span>
                        )}
                        {course.is_paid && course.price ? (
                          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold text-plum-600">
                            <CreditCard className="w-4 h-4" /> {formatMoney(course.price, course.currency || 'NGN')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold text-green-600">
                            Free
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Learning is on the Way" message="We're curating a collection of courses designed to equip women with life-changing skills. Our classrooms are being set up — stay tuned for enrollment!" />
          )}
        </div>
      </section>
    </div>
  );
}

function CourseDetailPage({ courseId }: { courseId: string }) {
  useScrollReveal();
  const { navigate } = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [media, setMedia] = useState<CourseMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', country: '', motivation: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();
      if (courseData) {
        setCourse(courseData as Course);
        const [secRes, mediaRes] = await Promise.all([
          supabase.from('course_sections').select('*').eq('course_id', courseId).order('sort_order', { ascending: true }),
          supabase.from('course_media').select('*').eq('course_id', courseId).order('sort_order', { ascending: true }),
        ]);
        setSections((secRes.data as CourseSection[]) || []);
        setMedia((mediaRes.data as CourseMedia[]) || []);
      }
      setLoading(false);
    })();
  }, [courseId]);

  const allImages = [course?.image_url, ...media.map((m) => m.image_url)].filter(Boolean) as string[];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setStatus('loading');
    const { data: appData, error: appError } = await supabase
      .from('course_applications')
      .insert({
        course_id: course.id,
        course_title: course.title,
        ...form,
      })
      .select()
      .single();

    if (appError) {
      setStatus('error');
      return;
    }

    if (course.is_paid && course.price) {
      const { error: payError } = await supabase.from('payment_submissions').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        amount: course.price,
        source: 'course',
        course_id: course.id,
        application_id: appData?.id,
        status: 'pending',
      });
      if (payError) {
        setStatus('error');
        return;
      }
      setStatus('success');
      setTimeout(() => {
        navigate('/payment');
      }, 1500);
    } else {
      setStatus('success');
    }
    setForm({ full_name: '', email: '', phone: '', country: '', motivation: '' });
  };

  if (loading) {
    return (
      <div className="pt-32">
        <SectionLoader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="font-lato text-charcoal-500">Course not found.</p>
        <Link to="/courses" className="inline-flex items-center gap-2 mt-4 font-lato text-sm text-plum-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <Link to="/courses" className="inline-flex items-center gap-2 font-lato text-sm text-plum-600 hover:text-plum-700 mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>

        <article className="bg-white rounded-3xl p-8 md:p-12 border border-plum-100 shadow-sm">
          {course.category && (
            <span className="font-spartan text-xs font-semibold uppercase tracking-wider text-gold-500 mb-3 block">{course.category}</span>
          )}

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-plum-700 mb-4">{course.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {course.duration && (
              <span className="flex items-center gap-1.5 font-lato text-sm text-charcoal-600">
                <Clock className="w-4 h-4 text-plum-500" /> {course.duration}
              </span>
            )}
            {course.level && (
              <span className="flex items-center gap-1.5 font-lato text-sm text-charcoal-600">
                <BarChart3 className="w-4 h-4 text-plum-500" /> {course.level}
              </span>
            )}
            {course.enrolled > 0 && (
              <span className="flex items-center gap-1.5 font-lato text-sm text-charcoal-600">
                <Users className="w-4 h-4 text-plum-500" /> {course.enrolled} enrolled
              </span>
            )}
            {course.instructor && (
              <span className="flex items-center gap-1.5 font-lato text-sm text-charcoal-600">
                <User className="w-4 h-4 text-plum-500" /> {course.instructor}
              </span>
            )}
            {course.is_paid && course.price ? (
              <span className="flex items-center gap-1.5 font-lato text-sm font-semibold text-plum-600">
                <CreditCard className="w-4 h-4" /> {formatMoney(course.price, course.currency || 'NGN')}
              </span>
            ) : (
              <span className="font-lato text-sm font-semibold text-green-600">Free Course</span>
            )}
          </div>

          {/* Image carousel */}
          {allImages.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img src={allImages[activeImage] || fallbackImage} alt={course.title} className="w-full h-80 md:h-96 object-cover" />
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

          {course.summary && (
            <p className="font-lato text-lg text-charcoal-600 leading-relaxed mb-8 italic">{course.summary}</p>
          )}

          {course.description && (
            <Section title="About the Course">
              <p className="whitespace-pre-line">{course.description}</p>
            </Section>
          )}

          {course.objectives && <Section title="What the Course Entails"><p className="whitespace-pre-line">{course.objectives}</p></Section>}
          {course.benefits && <Section title="Benefits of Taking This Course"><p className="whitespace-pre-line">{course.benefits}</p></Section>}
          {course.who_for && <Section title="Who This Course Is For"><p className="whitespace-pre-line">{course.who_for}</p></Section>}
          {course.format && <Section title="Course Format"><p className="whitespace-pre-line">{course.format}</p></Section>}
          {course.requirements && <Section title="Course Requirements"><p className="whitespace-pre-line">{course.requirements}</p></Section>}

          {course.instructor && course.instructor_bio && (
            <Section title="Instructor">
              <p className="font-semibold text-plum-700 mb-2">{course.instructor}</p>
              <p className="whitespace-pre-line">{course.instructor_bio}</p>
            </Section>
          )}

          {/* Custom sections from admin */}
          {sections.map((sec) => (
            <Section key={sec.id} title={sec.title}>
              <p className="whitespace-pre-line">{sec.content}</p>
            </Section>
          ))}

          {course.exam_info && (
            <Section title="Examination Information">
              <p className="whitespace-pre-line">{course.exam_info}</p>
              {course.passing_score && (
                <p className="mt-2 font-semibold text-plum-600">Certificate Requirement: {course.passing_score}% minimum examination score.</p>
              )}
              {course.exam_link && (
                <a href={course.exam_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 font-lato text-sm text-plum-600 font-semibold hover:text-plum-700">
                  Access Examination <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </Section>
          )}

          {course.cert_info && (
            <Section title="Certification">
              <p className="whitespace-pre-line">{course.cert_info}</p>
            </Section>
          )}

          {course.application_instructions && (
            <Section title="Application Instructions">
              <p className="whitespace-pre-line">{course.application_instructions}</p>
            </Section>
          )}

          {course.what_you_receive && (
            <Section title="What You Receive After Applying">
              <p className="whitespace-pre-line">{course.what_you_receive}</p>
            </Section>
          )}

          {/* Apply button */}
          <div className="pt-8 border-t border-plum-100 mt-8">
            <Button variant="primary" onClick={() => { setShowApply(true); setStatus('idle'); }} className="w-full sm:w-auto">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </article>
      </div>

      {/* Application modal */}
      {showApply && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-plum-950/60 animate-fade-in" onClick={() => setShowApply(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-1">Apply for Course</h3>
            <p className="font-lato text-sm text-charcoal-500 mb-6">{course.title}</p>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle2 className="w-12 h-12 text-gold-400" />
                {course.is_paid ? (
                  <p className="font-lato text-charcoal-700 text-center">Application received! Redirecting you to payment...</p>
                ) : (
                  <p className="font-lato text-charcoal-700 text-center">
                    Thank you for applying for this course. Your application has been received successfully. Further information, including course access details and instructions, will be sent to the email address you provided.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
                <TextArea label="Why do you want to take this course?" value={form.motivation} onChange={(v) => setForm({ ...form, motivation: v })} />
                {status === 'error' && <p className="font-lato text-sm text-red-500">Something went wrong. Please try again.</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowApply(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex-1">
                    {status === 'loading' ? 'Submitting...' : course.is_paid ? 'Proceed to Payment' : 'Submit Application'}
                    {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-playfair text-2xl font-bold text-plum-700 mb-3">{title}</h2>
      <div className="font-lato text-charcoal-700 leading-relaxed text-base">{children}</div>
    </div>
  );
}

export function Input({ label, value, onChange, type = 'text', required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">{label}{required && <span className="text-gold-500">*</span>}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10 transition-all"
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, required, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block font-lato text-sm font-medium text-charcoal-700 mb-1.5">{label}{required && <span className="text-gold-500">*</span>}</label>
      <textarea
        required={required}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-plum-200 bg-cream-50 font-lato text-sm text-charcoal-800 focus:outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10 transition-all resize-none"
      />
    </div>
  );
}
