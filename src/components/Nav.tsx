import { Link } from '@/components/Link';

const LOGO_URL = 'https://www.image2url.com/r2/default/images/1789833483559-0ae4cf35-8df3-4948-8516-dafe2c39af46.png';
const ORG_FULL_NAME = 'Women Elevation and Empowerment Initiative';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Programs', path: '/programs' },
  { label: 'Courses', path: '/courses' },
  { label: 'Community', path: '/community' },
  { label: 'Cases', path: '/cases' },
  { label: 'Blog', path: '/blog' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Merch', path: '/merch' },
  { label: 'Donate', path: '/donate' },
  { label: 'Partner', path: '/partner' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Contact', path: '/contact' },
];

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 group flex-shrink-0">
      <img src={LOGO_URL} alt={ORG_FULL_NAME} className="h-10 md:h-12 w-auto object-contain" loading="eager" />
      <div className="flex flex-col leading-none">
        <span className="font-cormorant text-lg md:text-xl font-bold text-plum-700 leading-tight">Women Elevation</span>
        <span className="font-spartan text-[0.55rem] md:text-[0.6rem] tracking-[0.2em] text-plum-400 uppercase font-semibold mt-0.5">&amp; EMPOWERMENT INITIATIVE</span>
      </div>
    </Link>
  );
}

export function DesktopNav() {
  return (
    <nav className="flex items-center gap-0">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="px-2.5 py-2 text-[0.8rem] font-medium text-charcoal-700 hover:text-plum-600 transition-colors rounded-lg hover:bg-plum-50 whitespace-nowrap"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileDropdownLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className="px-3 py-2.5 text-sm font-medium text-charcoal-700 hover:text-plum-600 transition-colors rounded-lg hover:bg-plum-50"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export { navItems };
