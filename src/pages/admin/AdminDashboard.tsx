import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, GraduationCap, FileText, Newspaper,
  ShoppingBag, Users, Handshake, Mail, Heart, UserPlus, Briefcase, Phone,
  LogOut, Menu, X, ChevronRight, Bell, CreditCard, Quote, Images, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { AdminTable } from '@/pages/admin/AdminTable';
import type {
  Program, Course, CaseStory, BlogPost, Merch, MerchImage, CommunityPost, Partner,
  NewsletterSubscriber, JoinSubmission, VolunteerSubmission, PartnerSubmission,
  ContactSubmission, Donation, CourseApplication, MerchOrder,
  PaymentInfo, PaymentSubmission, Testimonial, GalleryEvent, GalleryPhoto,
} from '@/lib/types';

type Section =
  | 'overview'
  | 'programs' | 'courses' | 'cases' | 'blog' | 'merch' | 'merch_images' | 'community' | 'partners'
  | 'testimonials' | 'gallery'
  | 'newsletter' | 'join' | 'volunteer' | 'partner_sub' | 'contact' | 'donations'
  | 'course_app' | 'merch_orders' | 'payment_submissions'
  | 'payment';

interface NavGroup {
  label: string;
  items: { id: Section; label: string; icon: React.ComponentType<{ className?: string }>; table?: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { id: 'programs', label: 'Programs', icon: BookOpen, table: 'programs' },
      { id: 'courses', label: 'Courses', icon: GraduationCap, table: 'courses' },
      { id: 'cases', label: 'Cases', icon: FileText, table: 'cases' },
      { id: 'blog', label: 'Blog Posts', icon: Newspaper, table: 'blog_posts' },
      { id: 'merch', label: 'Merch', icon: ShoppingBag, table: 'merch' },
      { id: 'merch_images', label: 'Merch Images', icon: ImageIcon, table: 'merch_images' },
      { id: 'community', label: 'Community', icon: Users, table: 'community_posts' },
      { id: 'partners', label: 'Partners', icon: Handshake, table: 'partners' },
      { id: 'testimonials', label: 'Testimonials', icon: Quote, table: 'testimonials' },
      { id: 'gallery', label: 'Gallery', icon: Images, table: 'gallery_events' },
    ],
  },
  {
    label: 'Submissions',
    items: [
      { id: 'newsletter', label: 'Newsletter', icon: Mail, table: 'newsletter_subscribers' },
      { id: 'join', label: 'Join Movement', icon: UserPlus, table: 'join_submissions' },
      { id: 'volunteer', label: 'Volunteers', icon: Users, table: 'volunteer_submissions' },
      { id: 'partner_sub', label: 'Partner Inquiries', icon: Briefcase, table: 'partner_submissions' },
      { id: 'contact', label: 'Contact Messages', icon: Phone, table: 'contact_submissions' },
      { id: 'donations', label: 'Donations', icon: Heart, table: 'donations' },
      { id: 'course_app', label: 'Course Applications', icon: GraduationCap, table: 'course_applications' },
      { id: 'merch_orders', label: 'Merch Orders', icon: ShoppingBag, table: 'merch_orders' },
      { id: 'payment_submissions', label: 'Payment Submissions', icon: CreditCard, table: 'payment_submissions' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'payment', label: 'Payment Info', icon: CreditCard, table: 'payment_info' },
    ],
  },
];

const statusOptions = ['new', 'reviewed', 'approved', 'rejected', 'active', 'completed', 'pending'];
const paymentStatusOptions = ['pending', 'completed', 'failed', 'refunded'];

export function AdminDashboard() {
  const { signOut } = useAuth();
  const { navigate } = useRouter();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingStats(true);
      const tables = [
        'newsletter_subscribers', 'join_submissions', 'volunteer_submissions',
        'partner_submissions', 'contact_submissions', 'donations',
        'course_applications', 'merch_orders', 'payment_submissions',
        'programs', 'courses', 'cases', 'blog_posts', 'merch', 'merch_images', 'testimonials',
        'gallery_events', 'gallery_photos',
      ];
      const counts: Record<string, number> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
          counts[t] = count || 0;
        })
      );
      setStats(counts);
      setLoadingStats(false);
    })();
  }, [section]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <Overview stats={stats} loading={loadingStats} onNavigate={setSection} />;

      // Content tables
      case 'programs':
        return <AdminTable<Program> key="programs"
          table="programs" title="Programs" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ title: '', pillar: '', summary: '', description: '', image_url: '', icon: 'Sparkles', published: true, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'pillar', label: 'Pillar', editable: true, type: 'select', options: ['Educate', 'Empower', 'Advocate', 'Wellness', 'General'] },
            { key: 'summary', label: 'Summary', editable: true, type: 'textarea', full: true },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'icon', label: 'Icon', editable: true, type: 'select', options: ['BookOpen', 'Sparkles', 'Scale', 'Users', 'Heart', 'GraduationCap'] },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'courses':
        return <AdminTable<Course> key="courses"
          table="courses" title="Courses" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ title: '', category: '', instructor: '', summary: '', description: '', image_url: '', duration: '', level: '', enrolled: 0, published: true, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'category', label: 'Category', editable: true },
            { key: 'instructor', label: 'Instructor', editable: true },
            { key: 'summary', label: 'Summary', editable: true, type: 'textarea', full: true },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'duration', label: 'Duration', editable: true },
            { key: 'level', label: 'Level', editable: true, type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
            { key: 'enrolled', label: 'Enrolled', editable: true, type: 'number' },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'cases':
        return <AdminTable<CaseStory> key="cases"
          table="cases" title="Cases" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ title: '', beneficiary: '', location: '', program: '', summary: '', story: '', image_url: '', impact: '', published: true, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'beneficiary', label: 'Beneficiary', editable: true },
            { key: 'location', label: 'Location', editable: true },
            { key: 'program', label: 'Program', editable: true },
            { key: 'summary', label: 'Summary', editable: true, type: 'textarea', full: true },
            { key: 'story', label: 'Story', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'impact', label: 'Impact', editable: true, type: 'textarea', full: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'blog':
        return <AdminTable<BlogPost> key="blog"
          table="blog_posts" title="Blog Posts" eyebrow="Content Management"
          emptyFields={{ title: '', slug: '', author: '', excerpt: '', content: '', image_url: '', category: '', tags: '', published: true, featured: false, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'slug', label: 'Slug', editable: true },
            { key: 'author', label: 'Author', editable: true },
            { key: 'category', label: 'Category', editable: true },
            { key: 'excerpt', label: 'Excerpt', editable: true, type: 'textarea', full: true },
            { key: 'content', label: 'Content', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'tags', label: 'Tags', editable: true, full: true },
            { key: 'featured', label: 'Featured', editable: true, type: 'boolean' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'merch':
        return <AdminTable<Merch> key="merch"
          table="merch" title="Merchandise" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ name: '', description: '', image_url: '', price: '', category: '', sizes: '', colors: '', in_stock: true, published: true, sort_order: 0 }}
          columns={[
            { key: 'name', label: 'Name', editable: true },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'price', label: 'Price', editable: true },
            { key: 'category', label: 'Category', editable: true },
            { key: 'sizes', label: 'Sizes (comma-separated)', editable: true, full: true },
            { key: 'colors', label: 'Colors (comma-separated)', editable: true, full: true },
            { key: 'in_stock', label: 'In Stock', editable: true, type: 'boolean' },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'community':
        return <AdminTable<CommunityPost> key="community"
          table="community_posts" title="Community Posts" eyebrow="Content Management"
          emptyFields={{ title: '', type: 'announcement', description: '', image_url: '', event_date: '', event_location: '', link: '', published: true, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'type', label: 'Type', editable: true, type: 'select', options: ['announcement', 'event', 'webinar'] },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'event_date', label: 'Event Date', editable: true },
            { key: 'event_location', label: 'Event Location', editable: true },
            { key: 'link', label: 'Link', editable: true, full: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'partners':
        return <AdminTable<Partner> key="partners"
          table="partners" title="Partners" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ name: '', description: '', logo_url: '', website: '', category: '', published: true, sort_order: 0 }}
          columns={[
            { key: 'name', label: 'Name', editable: true },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'logo_url', label: 'Logo', editable: true, type: 'image', full: true },
            { key: 'website', label: 'Website', editable: true, full: true },
            { key: 'category', label: 'Category', editable: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'testimonials':
        return <AdminTable<Testimonial> key="testimonials"
          table="testimonials" title="Testimonials" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ quote: '', author_name: '', author_role: '', author_location: '', photo_url: '', published: true, sort_order: 0 }}
          columns={[
            { key: 'quote', label: 'Quote', editable: true, type: 'textarea', full: true },
            { key: 'author_name', label: 'Author Name', editable: true },
            { key: 'author_role', label: 'Author Role', editable: true },
            { key: 'author_location', label: 'Author Location', editable: true },
            { key: 'photo_url', label: 'Photo', editable: true, type: 'image', full: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'gallery':
        return <AdminTable<GalleryEvent> key="gallery"
          table="gallery_events" title="Gallery" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ title: '', description: '', cover_image_url: '', event_date: '', event_location: '', event_type: '', impact: '', published: true, sort_order: 0 }}
          columns={[
            { key: 'title', label: 'Title', editable: true },
            { key: 'description', label: 'Description', editable: true, type: 'textarea', full: true },
            { key: 'cover_image_url', label: 'Cover Image', editable: true, type: 'image', full: true },
            { key: 'event_date', label: 'Event Date', editable: true },
            { key: 'event_location', label: 'Location', editable: true },
            { key: 'event_type', label: 'Type', editable: true, type: 'select', options: ['Outreach', 'Workshop', 'Conference', 'Seminar', 'Fundraiser', 'Community', 'Other'] },
            { key: 'impact', label: 'Impact', editable: true, type: 'textarea', full: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
            { key: 'published', label: 'Published', editable: true, type: 'boolean' },
          ]}
        />;

      case 'merch_images':
        return <AdminTable<MerchImage> key="merch_images"
          table="merch_images" title="Merch Images" eyebrow="Content Management" orderBy="sort_order"
          emptyFields={{ merch_id: '', image_url: '', sort_order: 0 }}
          columns={[
            { key: 'merch_id', label: 'Merch ID', editable: true },
            { key: 'image_url', label: 'Image', editable: true, type: 'image', full: true },
            { key: 'sort_order', label: 'Order', editable: true, type: 'number' },
          ]}
        />;

      // Submission tables
      case 'newsletter':
        return <AdminTable<NewsletterSubscriber> key="newsletter"
          table="newsletter_subscribers" title="Newsletter Subscribers" eyebrow="Submissions"
          emptyFields={{ name: '', email: '', status: 'active' }}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: ['active', 'unsubscribed'] },
            { key: 'created_at', label: 'Subscribed' },
          ]}
        />;

      case 'join':
        return <AdminTable<JoinSubmission> key="join"
          table="join_submissions" title="Join the Movement Submissions" eyebrow="Submissions"
          emptyFields={{ full_name: '', email: '', phone: '', country: '', city: '', interests: '', message: '', status: 'new' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'country', label: 'Country' },
            { key: 'interests', label: 'Interests' },
            { key: 'message', label: 'Message', render: (r) => r.message ? (r.message.length > 50 ? r.message.slice(0, 50) + '...' : r.message) : '—' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'volunteer':
        return <AdminTable<VolunteerSubmission> key="volunteer"
          table="volunteer_submissions" title="Volunteer Applications" eyebrow="Submissions"
          emptyFields={{ full_name: '', email: '', phone: '', country: '', city: '', area_of_interest: '', availability: '', skills: '', experience: '', message: '', status: 'new' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'area_of_interest', label: 'Interest' },
            { key: 'availability', label: 'Availability' },
            { key: 'skills', label: 'Skills' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'partner_sub':
        return <AdminTable<PartnerSubmission> key="partner_sub"
          table="partner_submissions" title="Partner Inquiries" eyebrow="Submissions"
          emptyFields={{ organization: '', contact_name: '', email: '', phone: '', website: '', partnership_type: '', message: '', status: 'new' }}
          columns={[
            { key: 'organization', label: 'Organization' },
            { key: 'contact_name', label: 'Contact' },
            { key: 'email', label: 'Email' },
            { key: 'partnership_type', label: 'Type' },
            { key: 'message', label: 'Message', render: (r) => r.message ? (r.message.length > 50 ? r.message.slice(0, 50) + '...' : r.message) : '—' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'contact':
        return <AdminTable<ContactSubmission> key="contact"
          table="contact_submissions" title="Contact Messages" eyebrow="Submissions"
          emptyFields={{ full_name: '', email: '', subject: '', message: '', status: 'new' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'subject', label: 'Subject' },
            { key: 'message', label: 'Message', render: (r) => r.message ? (r.message.length > 50 ? r.message.slice(0, 50) + '...' : r.message) : '—' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'donations':
        return <AdminTable<Donation> key="donations"
          table="donations" title="Donations" eyebrow="Submissions"
          emptyFields={{ donor_name: '', email: '', amount: '', frequency: '', purpose: '', message: '', payment_status: 'pending' }}
          columns={[
            { key: 'donor_name', label: 'Donor' },
            { key: 'email', label: 'Email' },
            { key: 'amount', label: 'Amount' },
            { key: 'frequency', label: 'Frequency' },
            { key: 'purpose', label: 'Purpose' },
            { key: 'payment_status', label: 'Payment Status', editable: true, type: 'select', options: paymentStatusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'course_app':
        return <AdminTable<CourseApplication> key="course_app"
          table="course_applications" title="Course Applications" eyebrow="Submissions"
          emptyFields={{ course_title: '', full_name: '', email: '', phone: '', country: '', motivation: '', status: 'new' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'course_title', label: 'Course' },
            { key: 'country', label: 'Country' },
            { key: 'motivation', label: 'Motivation', render: (r) => r.motivation ? (r.motivation.length > 50 ? r.motivation.slice(0, 50) + '...' : r.motivation) : '—' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'merch_orders':
        return <AdminTable<MerchOrder> key="merch_orders"
          table="merch_orders" title="Merch Orders" eyebrow="Submissions"
          emptyFields={{ merch_name: '', full_name: '', email: '', phone: '', address: '', size: '', color: '', quantity: 1, total: '', status: 'new' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'merch_name', label: 'Product' },
            { key: 'quantity', label: 'Qty' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: statusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'payment_submissions':
        return <AdminTable<PaymentSubmission> key="payment_submissions"
          table="payment_submissions" title="Payment Submissions" eyebrow="Submissions"
          emptyFields={{ full_name: '', email: '', phone: '', amount: '', reference_number: '', purpose: '', message: '', receipt_url: '', source: 'general', status: 'pending' }}
          columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'amount', label: 'Amount' },
            { key: 'reference_number', label: 'Reference' },
            { key: 'purpose', label: 'Purpose' },
            { key: 'source', label: 'Source' },
            { key: 'receipt_url', label: 'Receipt', editable: true, type: 'image', full: true },
            { key: 'status', label: 'Status', editable: true, type: 'select', options: paymentStatusOptions },
            { key: 'created_at', label: 'Date' },
          ]}
        />;

      case 'payment':
        return <AdminTable<PaymentInfo> key="payment"
          table="payment_info" title="Payment Information" eyebrow="Settings"
          emptyFields={{ label: '', bank_name: '', account_name: '', account_number: '', sort_code: '', mobile_money: '', notes: '' }}
          columns={[
            { key: 'label', label: 'Label', editable: true },
            { key: 'bank_name', label: 'Bank Name', editable: true },
            { key: 'account_name', label: 'Account Name', editable: true },
            { key: 'account_number', label: 'Account Number', editable: true },
            { key: 'sort_code', label: 'Sort Code', editable: true },
            { key: 'mobile_money', label: 'Mobile Money', editable: true },
            { key: 'notes', label: 'Notes', editable: true, type: 'textarea', full: true },
          ]}
        />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-plum-950 text-cream-100 z-50 transition-transform overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-plum-800/50">
          <div className="flex flex-col leading-none">
            <span className="font-cormorant text-lg font-bold text-white">WEEI</span>
            <span className="font-spartan text-[0.6rem] tracking-[0.25em] text-gold-400 uppercase font-semibold">Admin</span>
          </div>
        </div>

        <nav className="p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="font-spartan text-[0.65rem] uppercase tracking-wider text-cream-200/40 font-semibold px-3 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const count = item.table ? stats[item.table] : undefined;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-lato text-sm transition-colors ${
                        section === item.id ? 'bg-plum-700 text-white' : 'text-cream-200/70 hover:bg-plum-800/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {count !== undefined && count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${section === item.id ? 'bg-gold-400 text-plum-900' : 'bg-plum-800 text-cream-200/60'}`}>{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-plum-800/50 mt-auto">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-lato text-sm text-cream-200/70 hover:bg-red-900/30 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <a href="#/" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-lato text-sm text-cream-200/50 hover:text-gold-400 transition-colors">
            <ChevronRight className="w-4 h-4" /> View Website
          </a>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-plum-950/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b border-plum-100 px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-plum-600 hover:bg-plum-50 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-lato text-sm font-semibold text-plum-700 capitalize">
              {navGroups.flatMap(g => g.items).find(i => i.id === section)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-plum-500" />
            <div className="w-8 h-8 rounded-lg bg-plum-600 text-white flex items-center justify-center font-lato text-xs font-bold">A</div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

function Overview({ stats, loading, onNavigate }: {
  stats: Record<string, number>;
  loading: boolean;
  onNavigate: (s: Section) => void;
}) {
  const submissionTotal = ['newsletter_subscribers', 'join_submissions', 'volunteer_submissions', 'partner_submissions', 'contact_submissions', 'donations', 'course_applications', 'merch_orders', 'payment_submissions']
    .reduce((sum, t) => sum + (stats[t] || 0), 0);

  const cards = [
    { label: 'Newsletter Subscribers', value: stats['newsletter_subscribers'], icon: Mail, section: 'newsletter' as Section, color: 'bg-plum-600' },
    { label: 'Join Submissions', value: stats['join_submissions'], icon: UserPlus, section: 'join' as Section, color: 'bg-gold-400' },
    { label: 'Volunteer Applications', value: stats['volunteer_submissions'], icon: Users, section: 'volunteer' as Section, color: 'bg-plum-500' },
    { label: 'Partner Inquiries', value: stats['partner_submissions'], icon: Briefcase, section: 'partner_sub' as Section, color: 'bg-gold-500' },
    { label: 'Contact Messages', value: stats['contact_submissions'], icon: Phone, section: 'contact' as Section, color: 'bg-plum-600' },
    { label: 'Donations', value: stats['donations'], icon: Heart, section: 'donations' as Section, color: 'bg-gold-400' },
    { label: 'Course Applications', value: stats['course_applications'], icon: GraduationCap, section: 'course_app' as Section, color: 'bg-plum-500' },
    { label: 'Merch Orders', value: stats['merch_orders'], icon: ShoppingBag, section: 'merch_orders' as Section, color: 'bg-plum-600' },
    { label: 'Payment Submissions', value: stats['payment_submissions'], icon: CreditCard, section: 'payment_submissions' as Section, color: 'bg-gold-500' },
  ];

  const contentCards = [
    { label: 'Programs', value: stats['programs'], icon: BookOpen, section: 'programs' as Section },
    { label: 'Courses', value: stats['courses'], icon: GraduationCap, section: 'courses' as Section },
    { label: 'Cases', value: stats['cases'], icon: FileText, section: 'cases' as Section },
    { label: 'Blog Posts', value: stats['blog_posts'], icon: Newspaper, section: 'blog' as Section },
    { label: 'Merch Items', value: stats['merch'], icon: ShoppingBag, section: 'merch' as Section },
    { label: 'Community Posts', value: stats['community_posts'], icon: Users, section: 'community' as Section },
    { label: 'Partners', value: stats['partners'], icon: Handshake, section: 'partners' as Section },
    { label: 'Gallery Events', value: stats['gallery_events'], icon: Images, section: 'gallery' as Section },
    { label: 'Merch Images', value: stats['merch_images'], icon: ImageIcon, section: 'merch_images' as Section },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-plum-700 mb-2">Dashboard Overview</h1>
        <p className="font-lato text-charcoal-500">Welcome back! Here's what's happening across Women Elevation and Empowerment Initiative.</p>
      </div>

      {/* Summary banner */}
      <div className="bg-gradient-to-r from-plum-600 to-plum-700 rounded-3xl p-6 md:p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="font-playfair text-3xl md:text-4xl font-bold text-gold-400">{loading ? '...' : submissionTotal}</p>
            <p className="font-lato text-xs text-cream-100/80 mt-1">Total Submissions</p>
          </div>
          <div>
            <p className="font-playfair text-3xl md:text-4xl font-bold text-gold-400">{loading ? '...' : stats['donations'] || 0}</p>
            <p className="font-lato text-xs text-cream-100/80 mt-1">Donations</p>
          </div>
          <div>
            <p className="font-playfair text-3xl md:text-4xl font-bold text-gold-400">{loading ? '...' : stats['newsletter_subscribers'] || 0}</p>
            <p className="font-lato text-xs text-cream-100/80 mt-1">Subscribers</p>
          </div>
          <div>
            <p className="font-playfair text-3xl md:text-4xl font-bold text-gold-400">{loading ? '...' : stats['volunteer_submissions'] || 0}</p>
            <p className="font-lato text-xs text-cream-100/80 mt-1">Volunteers</p>
          </div>
        </div>
      </div>

      {/* Submissions */}
      <div>
        <h2 className="font-playfair text-xl font-bold text-plum-700 mb-4">Recent Submissions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <button
              key={card.label}
              onClick={() => onNavigate(card.section)}
              className="bg-white rounded-2xl p-5 border border-plum-100/50 text-left hover:shadow-lg hover:shadow-plum-900/5 hover:border-plum-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="font-playfair text-2xl font-bold text-plum-700">{loading ? '...' : card.value || 0}</span>
              </div>
              <p className="font-lato text-sm text-charcoal-600">{card.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <h2 className="font-playfair text-xl font-bold text-plum-700 mb-4">Content Management</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentCards.map((card) => (
            <button
              key={card.label}
              onClick={() => onNavigate(card.section)}
              className="bg-white rounded-2xl p-5 border border-plum-100/50 text-left hover:shadow-lg hover:shadow-plum-900/5 hover:border-plum-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cream-100 text-plum-600 flex items-center justify-center">
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="font-playfair text-xl font-bold text-plum-700">{loading ? '...' : card.value || 0}</span>
              </div>
              <p className="font-lato text-sm text-charcoal-600">{card.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
