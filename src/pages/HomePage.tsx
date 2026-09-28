import { ArrowRight, Heart, Scale, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const heroImage = 'https://images.pexels.com/photos/18855930/pexels-photo-18855930.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const focusImage = 'https://images.pexels.com/photos/34211744/pexels-photo-34211744.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200';

const pillars = [
  {
    icon: BookOpen,
    title: 'Educate',
    description: 'Literacy programs, leadership training, and menstrual health awareness that unlock the full potential of every girl.',
    items: ['Literacy Programs', 'Leadership Academies', 'Menstrual Health Education'],
  },
  {
    icon: Sparkles,
    title: 'Empower',
    description: 'Skill-building workshops and entrepreneurship training that equip women with tools to build thriving lives.',
    items: ['Skill-Building Workshops', 'Entrepreneurship Training', 'Economic Independence'],
  },
  {
    icon: Scale,
    title: 'Advocate',
    description: 'Fighting for gender equality, providing legal aid, and driving policy reform that creates lasting systemic change.',
    items: ['Gender Equality Campaigns', 'Legal Aid Access', 'Policy Reform'],
  },
];

const goals = [
  { value: '10,000+', label: 'Goal for 2027: Train 10,000 women' },
  { value: '50,000+', label: 'Goal for 2027: Educate 50,000 girls' },
  { value: '100+', label: 'Goal for 2027: Reach 100 communities' },
  { value: '2,000+', label: 'Goal for 2027: Empower 2,000 young leaders' },
  { value: '5,000+', label: 'Goal for 2027: Support 5,000 small businesses' },
];

export function HomePage() {
  useScrollReveal();

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-plum-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Women Elevation and Empowerment Initiative team" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum-950 via-plum-950/80 to-plum-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-950 via-transparent to-plum-950/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-32 md:py-40 w-full">
          <div className="max-w-3xl">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-4 animate-fade-up">
              Women Elevation and Empowerment Initiative
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Every Girl<br />
              Deserves a<br />
              <span className="text-gold-400 italic">Future.</span>
            </h1>
            <p className="font-lato text-lg md:text-xl text-cream-100/90 max-w-xl mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Educating. Empowering. Advocating for Women Worldwide. Join a global movement that transforms lives, builds leaders, and breaks barriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/join"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold rounded-full transition-all hover:shadow-2xl hover:shadow-plum-600/40 hover:-translate-y-1"
              >
                Join the Movement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/partner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-plum-950 font-lato font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
              >
                Partner With Us
              </Link>
            </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-100/60 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <span className="font-spartan text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Focus + Mission */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="relative">
                <img
                  src={focusImage}
                  alt="Women Elevation and Empowerment Initiative team with children"
                  className="rounded-3xl shadow-2xl shadow-plum-900/10 w-full object-cover aspect-[4/3]"
                />

              </div>
            </div>
            <div className="animate-on-scroll">
              <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4">
                Our Focus
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700 mb-4 text-balance leading-tight">
                Reaching girls where they are
              </h2>
              <p className="font-lato text-charcoal-600 text-base md:text-lg mb-8 leading-relaxed">
                Reaching girls where they are — in schools, communities, and homes — equipping them with knowledge, confidence, and opportunity to build extraordinary futures.
              </p>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-plum-100 shadow-sm">
                <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">Our Mission</h3>
                <p className="font-lato text-charcoal-600 leading-relaxed mb-4">
                  We believe every woman holds the power to change her world.
                </p>
                <p className="font-lato text-charcoal-600 leading-relaxed">
                  Women Elevation and Empowerment Initiative is a global women's empowerment organization on a mission to educate, empower, and advocate for women and girls worldwide. We work at the intersection of education, economic development, and human rights — because we know that when women rise, entire communities thrive.
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 mt-5 font-lato font-semibold text-plum-600 hover:text-plum-700 transition-colors">
                  Learn Our Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
              What We Stand For
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700">
              Our Three Pillars
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="group bg-cream-50 rounded-3xl p-8 md:p-10 border border-plum-100/50 hover:border-plum-300 transition-all hover:shadow-xl hover:shadow-plum-900/5 hover:-translate-y-1 animate-on-scroll"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-plum-600 text-white flex items-center justify-center mb-6 group-hover:bg-gold-400 transition-colors">
                  <pillar.icon className="w-7 h-7" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-3">{pillar.title}</h3>
                <p className="font-lato text-charcoal-600 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>
                <ul className="space-y-2.5">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-lato text-sm text-charcoal-700">
                      <span className="w-1.5 h-1.5 rounded-lg bg-gold-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals & Vision */}
      <section className="py-20 md:py-28 bg-plum-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-400 rounded-lg blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-plum-400 rounded-lg blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3">
              Our Goals for 2027
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our Goals &amp; Vision
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {goals.map((goal, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all animate-on-scroll"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <p className="font-playfair text-2xl md:text-3xl font-bold text-gold-400">{goal.value}</p>
                <p className="font-lato text-xs md:text-sm text-cream-100/80 mt-2 leading-snug">{goal.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-on-scroll">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-plum-700 font-lato font-semibold rounded-full hover:bg-cream-50 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
              What We Offer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { image: 'https://images.pexels.com/photos/8761349/pexels-photo-8761349.jpeg?auto=compress&cs=tinysrgb&h=500&w=700', title: 'Programs', desc: 'From literacy to entrepreneurship, explore programs designed to unlock every woman\'s potential.', cta: 'Explore Programs', to: '/programs' },
              { image: 'https://images.pexels.com/photos/36780246/pexels-photo-36780246.jpeg?auto=compress&cs=tinysrgb&h=500&w=700', title: 'Community', desc: 'Webinars, events, announcements, and a global sisterhood. You belong here.', cta: 'Join Community', to: '/community' },
              { image: 'https://images.pexels.com/photos/936034/pexels-photo-936034.jpeg?auto=compress&cs=tinysrgb&h=500&w=700', title: 'Vision', desc: 'A world where every girl is educated, every woman is empowered, and every voice is heard.', cta: 'Our Vision', to: '/about' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl border border-plum-100/50 hover:border-plum-300 transition-all hover:shadow-xl hover:shadow-plum-900/5 hover:-translate-y-1 animate-on-scroll overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/50 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-playfair text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-spartan text-xs text-gold-500 font-semibold uppercase tracking-wider mb-3">{item.title}</p>
                  <p className="font-lato text-charcoal-600 text-sm leading-relaxed mb-5">{item.desc}</p>
                  <Link to={item.to} className="inline-flex items-center gap-2 font-lato font-semibold text-plum-600 hover:text-plum-700 transition-colors">
                    {item.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gold-400 to-gold-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-lg blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-plum-900/70 font-semibold mb-4 animate-on-scroll">
            Be Part of the Change
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-plum-900 mb-6 text-balance animate-on-scroll">
            Ready to Rise?
          </h2>
          <p className="font-lato text-lg text-plum-900/80 max-w-2xl mx-auto mb-8 animate-on-scroll">
            Join thousands of women and allies building a more equal, empowered world. Your moment is now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll">
            <Link
              to="/join"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-plum-700 hover:bg-plum-800 text-white font-lato font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Join the Movement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/partner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-cream-50 text-plum-700 font-lato font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
