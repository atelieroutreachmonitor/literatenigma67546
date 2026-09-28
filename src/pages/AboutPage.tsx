import { Target, Eye, Heart, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import { PageHero, SectionTitle } from '@/components/ui';
import { Link } from '@/components/Link';
import { useScrollReveal } from '@/lib/router';

const aboutHero = 'https://images.pexels.com/photos/13020784/pexels-photo-13020784.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

const focusAreas = [
  'Menstrual Health & Hygiene Education',
  'Gender-Based Violence Awareness',
  'Leadership & Emotional Intelligence',
  'Economic Empowerment',
  'Wellness Programs (Mental, Emotional, Physical Health)',
  'Legal Literacy & Rights Advocacy',
];

const differences = [
  {
    icon: Users,
    title: 'Community-First',
    description: 'We build with communities, not for them. Every program is co-designed with the women it serves.',
  },
  {
    icon: Heart,
    title: 'Holistic Approach',
    description: 'We address the whole woman: her education, economic needs, mental health, and legal rights.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Our reach spans continents, creating cross-cultural solidarity and shared learning.',
  },
];

export function AboutPage() {
  useScrollReveal();

  return (
    <div>
      <PageHero
        eyebrow="Who We Are"
        title="About Women Elevation and Empowerment Initiative"
        subtitle="Our Story"
        image={aboutHero}
      />

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4">
              Our Story
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700 mb-6 text-balance">
              Born from a Belief in Every Woman
            </h2>
            <div className="space-y-5 font-lato text-charcoal-600 text-base md:text-lg leading-relaxed">
              <p>
                Women Elevation and Empowerment Initiative was born from a simple but powerful belief: women can. Across the world, women and girls continue to face barriers that limit their opportunities, voices, and potential. Yet we believe that every woman is capable of achieving greatness when given the freedom, support, and opportunity to thrive.
              </p>
              <p>
                The name WEE reflects our conviction that women are just as capable of leading, creating, innovating, and transforming society as anyone else. The word Initiative is equally important. It represents our commitment to action and progress, bridging the gap between where women are today and where they deserve to be.
              </p>
              <p>
                We are more than an organization; we are a growing global movement dedicated to empowering women and girls through education, advocacy, opportunity, and community action. Our mission is to reach communities across countries and continents, creating a future where every woman can realize her full potential and live without limitations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-plum-600 rounded-3xl p-8 md:p-12 text-white animate-on-scroll">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-gold-400" />
              </div>
              <p className="font-spartan text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3">Mission</p>
              <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">What We Do</h3>
              <p className="font-lato text-cream-100/90 leading-relaxed">
                To educate, empower, and advocate for women and girls worldwide by providing access to quality education, skill-building opportunities, and legal support that drives lasting individual and community transformation.
              </p>
            </div>
            <div className="bg-gold-400 rounded-3xl p-8 md:p-12 text-plum-900 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-2xl bg-plum-900/15 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-plum-700" />
              </div>
              <p className="font-spartan text-xs uppercase tracking-[0.3em] text-plum-700 font-semibold mb-3">Vision</p>
              <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">What We See</h3>
              <p className="font-lato text-plum-900/80 leading-relaxed">
                A world where every girl is educated, every woman is empowered to lead and thrive, and every community recognizes gender equality as the foundation of human progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 md:py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
              Leadership
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700">
              Meet Our Founder
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-plum-100 shadow-sm animate-on-scroll">
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-lg overflow-hidden shadow-xl border-4 border-gold-400">
                  <img src="/images/founder/close_picture_of_me.JPG" alt="Sharon Okeke Chidera" className="w-full h-full object-cover" />
                </div>
                <p className="font-playfair text-lg font-bold text-plum-700 mt-4 text-center">Sharon Okeke Chidera</p>
                <p className="font-spartan text-xs text-gold-500 font-semibold uppercase tracking-wider text-center mt-1">Founder &amp; Executive Director</p>
              </div>
              <div>
                <p className="font-lato text-charcoal-600 leading-relaxed mb-4">
                  Sharon Okeke Chidera is a passionate advocate for women's rights, education, and economic empowerment. With years of grassroots organizing experience across West Africa and beyond, she founded Women Elevation and Empowerment Initiative to create a structured, scalable platform for women's advancement.
                </p>
                <p className="font-lato text-charcoal-600 leading-relaxed">
                  Her vision is simple and bold: no girl should be left behind because of where she was born or who she was born as. She leads with conviction, compassion, and an unwavering commitment to justice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            eyebrow="What We Focus On"
            title="Our Focus Areas"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {focusAreas.map((area, i) => (
              <div
                key={area}
                className="flex items-center gap-4 bg-cream-50 rounded-2xl p-6 border border-plum-100/50 hover:border-plum-300 transition-all hover:shadow-lg hover:shadow-plum-900/5 animate-on-scroll"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-plum-600 text-white flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="font-lato text-sm font-medium text-charcoal-700">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 md:py-28 bg-plum-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-lg blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3">
              Our Difference
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              What Makes Us Different
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {differences.map((diff, i) => (
              <div
                key={diff.title}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/15 transition-all animate-on-scroll"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-400 text-plum-900 flex items-center justify-center mb-6">
                  <diff.icon className="w-7 h-7" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">{diff.title}</h3>
                <p className="font-lato text-cream-100/80 text-sm leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center animate-on-scroll">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plum-700 mb-4">
            Want to learn more about our work?
          </h2>
          <p className="font-lato text-charcoal-600 mb-8">
            Explore our programs and see how we're making an impact.
          </p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold rounded-full transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
