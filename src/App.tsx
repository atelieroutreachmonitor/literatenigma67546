import { useRouter, matchRoute } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Spinner } from '@/components/ui';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { CasesPage } from '@/pages/CasesPage';
import { BlogPage } from '@/pages/BlogPage';
import { MerchPage } from '@/pages/MerchPage';
import { DonatePage } from '@/pages/DonatePage';
import { PartnerPage } from '@/pages/PartnerPage';
import { VolunteerPage } from '@/pages/VolunteerPage';
import { ContactPage } from '@/pages/ContactPage';
import { JoinPage } from '@/pages/JoinPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { UnsubscribePage } from '@/pages/UnsubscribePage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

function App() {
  const { path } = useRouter();
  const { isAdmin, loading } = useAuth();

  // Admin routes — no header/footer, full screen
  if (path === '/admin' || path === '/admin/') {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-plum-950">
          <Spinner className="text-gold-400 w-8 h-8" />
        </div>
      );
    }
    if (!isAdmin) return <AdminLogin />;
    return <AdminDashboard />;
  }

  // Check for parameterized routes first
  const courseMatch = matchRoute('/courses/:id', path);
  const merchMatch = matchRoute('/merch/:id', path);
  const programMatch = matchRoute('/programs/:id', path);
  const galleryMatch = matchRoute('/gallery/:id', path);

  const publicPages: Record<string, React.ComponentType> = {
    '/': HomePage,
    '/about': AboutPage,
    '/programs': ProgramsPage,
    '/courses': CoursesPage,
    '/community': CommunityPage,
    '/cases': CasesPage,
    '/blog': BlogPage,
    '/donate': DonatePage,
    '/merch': MerchPage,
    '/partner': PartnerPage,
    '/volunteer': VolunteerPage,
    '/contact': ContactPage,
    '/join': JoinPage,
    '/gallery': GalleryPage,
    '/payment': PaymentPage,
    '/unsubscribe': UnsubscribePage,
  };

  let Page: React.ComponentType<{ routeParams?: Record<string, string> }> = HomePage;
  let routeParams: Record<string, string> | undefined;

  if (courseMatch) {
    Page = CoursesPage;
    routeParams = courseMatch;
  } else if (merchMatch) {
    Page = MerchPage;
    routeParams = merchMatch;
  } else if (programMatch) {
    Page = ProgramsPage;
    routeParams = programMatch;
  } else if (galleryMatch) {
    Page = GalleryPage;
    routeParams = galleryMatch;
  } else {
    Page = publicPages[path] || HomePage;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      <main className="flex-1">
        <Page routeParams={routeParams} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
