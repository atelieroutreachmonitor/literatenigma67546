import { Loader2, Sparkles } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`w-5 h-5 animate-spin ${className}`} />;
}

export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner className="text-plum-500" />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-plum-600 via-plum-700 to-plum-900" />
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-plum-950/60 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
        {eyebrow && (
          <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-400 font-semibold mb-3 animate-fade-up">
            {eyebrow}
          </p>
        )}
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-up text-balance" style={{ animationDelay: '0.1s' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-lato text-base md:text-lg text-cream-100/80 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-plum-700 hover:bg-plum-800 text-white shadow-lg shadow-plum-900/20 hover:shadow-xl hover:shadow-plum-900/25',
    gold: 'bg-gold-400 hover:bg-gold-500 text-plum-950 shadow-lg shadow-gold-400/25',
    outline: 'border border-plum-600 text-plum-700 hover:bg-plum-700 hover:text-white',
    ghost: 'text-plum-700 hover:bg-plum-50',
    white: 'bg-white hover:bg-cream-50 text-plum-700 shadow-lg',
  };
  const sizes = {
    sm: 'px-5 pt-2.5 pb-2 text-xs',
    md: 'px-7 pt-3.5 pb-3 text-xs',
    lg: 'px-9 pt-4 pb-3.5 text-sm',
  };
  return (
    <button
      className={`btn-premium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm shadow-plum-900/5 border border-plum-100/50 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? 'text-center' : ''} mb-10 md:mb-14`}>
      {eyebrow && (
        <p className="font-spartan text-xs md:text-sm uppercase tracking-[0.3em] text-gold-500 font-semibold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-plum-700 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className={`font-lato text-charcoal-600 mt-4 text-base md:text-lg ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function EmptyState({ message, title }: { message: string; title?: string }) {
  return (
    <div className="text-center py-16 md:py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-plum-50 border border-plum-100 mb-5">
        <Sparkles className="w-8 h-8 text-gold-400" />
      </div>
      {title && (
        <h3 className="font-playfair text-2xl font-bold text-plum-700 mb-2">{title}</h3>
      )}
      <p className="font-lato text-charcoal-500 max-w-md mx-auto leading-relaxed">{message}</p>
    </div>
  );
}
