import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Logo, DesktopNav, MobileDropdownLinks } from '@/components/Nav';
import { Link } from '@/components/Link';

export function Header() {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-plum-900/5'
          : 'bg-cream-50/95 backdrop-blur-sm shadow-sm shadow-plum-900/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center flex-1 justify-center">
            <DesktopNav />
          </div>

          {/* Desktop action buttons */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/join"
              className="inline-flex items-center px-5 py-2.5 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold text-sm rounded-full transition-all hover:shadow-lg hover:shadow-plum-600/30 hover:-translate-y-0.5"
            >
              Join the Movement
            </Link>
          </div>

          {/* For lg screens (between lg and xl), show a compact menu button */}
          <div className="hidden lg:flex xl:hidden items-center gap-3 flex-shrink-0">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-plum-600 hover:bg-plum-700 text-white font-lato font-semibold text-sm rounded-full transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              Menu
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile (below lg) */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <button
              className="p-2 text-plum-600 hover:bg-plum-50 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu — for both mobile and lg (not xl) */}
      {mobileOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 glass border-t border-plum-100 shadow-xl animate-slide-down max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <MobileDropdownLinks onNavigate={() => setMobileOpen(false)} />
            <div className="mt-4 pt-4 border-t border-plum-100">
              <Link
                to="/join"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3 bg-plum-600 text-white font-lato font-semibold text-sm rounded-full"
              >
                Join the Movement
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
