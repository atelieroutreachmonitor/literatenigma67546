export type TableName =
  | 'programs'
  | 'courses'
  | 'cases'
  | 'blog_posts'
  | 'merch'
  | 'merch_images'
  | 'community_posts'
  | 'partners'
  | 'newsletter_subscribers'
  | 'join_submissions'
  | 'volunteer_submissions'
  | 'partner_submissions'
  | 'contact_submissions'
  | 'donations'
  | 'course_applications'
  | 'merch_orders'
  | 'case_submissions'
  | 'blog_submissions'
  | 'gallery_events'
  | 'gallery_photos'
  | 'testimonials'
  | 'unsubscribe_submissions'
  | 'blog_likes'
  | 'payment_submissions'
  | 'course_sections'
  | 'course_media'
  | 'program_sections'
  | 'program_media';

export interface Program {
  id: string;
  title: string;
  pillar?: string | null;
  summary?: string | null;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  objectives?: string | null;
  target_beneficiaries?: string | null;
  program_details?: string | null;
  dates?: string | null;
  location?: string | null;
  facilitators?: string | null;
  partners?: string | null;
}

export interface Course {
  id: string;
  title: string;
  category?: string | null;
  instructor?: string | null;
  summary?: string | null;
  description?: string | null;
  image_url?: string | null;
  duration?: string | null;
  level?: string | null;
  enrolled: number;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  is_paid: boolean;
  price?: string | null;
  currency?: string | null;
  objectives?: string | null;
  benefits?: string | null;
  who_for?: string | null;
  format?: string | null;
  requirements?: string | null;
  instructor_bio?: string | null;
  application_instructions?: string | null;
  what_you_receive?: string | null;
  exam_info?: string | null;
  cert_info?: string | null;
  passing_score?: number | null;
  exam_link?: string | null;
  access_link?: string | null;
  email_instructions?: string | null;
  email_subject?: string | null;
  email_confirmation?: string | null;
  email_platform?: string | null;
  email_login_instructions?: string | null;
  email_start_info?: string | null;
  email_instructor_info?: string | null;
  email_important?: string | null;
  email_exam_instructions?: string | null;
  email_certificate?: string | null;
  email_additional?: string | null;
}

export type MediaType = 'image' | 'video';

/** Shared shape for every media-collection table (merch_images, gallery_photos, course_media, program_media). */
export interface MediaItem {
  id?: string;
  image_url: string;
  video_url?: string | null;
  media_type?: MediaType | null;
  caption?: string | null;
  sort_order: number;
}

export interface CaseStory {
  id: string;
  title: string;
  beneficiary?: string | null;
  location?: string | null;
  program?: string | null;
  summary?: string | null;
  story?: string | null;
  image_url?: string | null;
  impact?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string | null;
  author?: string | null;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  category?: string | null;
  tags?: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Merch {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  price?: string | null;
  category?: string | null;
  sizes?: string | null;
  colors?: string | null;
  in_stock: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  currency?: string | null;
  details?: string | null;
  material?: string | null;
  stock_quantity?: number | null;
  preorder?: boolean | null;
  shipping_info?: string | null;
  notes?: string | null;
}

export interface MerchImage extends MediaItem {
  id: string;
  merch_id: string;
  created_at?: string;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at?: string;
}

export interface CourseMedia extends MediaItem {
  id: string;
  course_id: string;
  created_at?: string;
}

export interface ProgramSection {
  id: string;
  program_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at?: string;
}

export interface ProgramMedia extends MediaItem {
  id: string;
  program_id: string;
  created_at?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  type: string;
  description?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  event_location?: string | null;
  link?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  category?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  name?: string | null;
  email: string;
  status: string;
  created_at?: string;
}

export interface JoinSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  interests?: string | null;
  message?: string | null;
  status: string;
  created_at?: string;
}

export interface VolunteerSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  area_of_interest?: string | null;
  availability?: string | null;
  skills?: string | null;
  experience?: string | null;
  message?: string | null;
  status: string;
  created_at?: string;
}

export interface PartnerSubmission {
  id: string;
  organization: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  partnership_type?: string | null;
  message?: string | null;
  status: string;
  created_at?: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: string;
  created_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: string;
  frequency?: string | null;
  purpose?: string | null;
  message?: string | null;
  payment_status: string;
  created_at?: string;
}

export interface CourseApplication {
  id: string;
  course_id?: string | null;
  course_title?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  motivation?: string | null;
  status: string;
  created_at?: string;
}

export interface CaseSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  title: string;
  description: string;
  image_url?: string | null;
  status: string;
  created_at?: string;
}

export interface BlogSubmission {
  id: string;
  author_name: string;
  article_name: string;
  email: string;
  summary: string;
  content: string;
  tags: string;
  image_url?: string | null;
  status: string;
  created_at?: string;
}

export interface MerchOrder {
  id: string;
  merch_id?: string | null;
  merch_name?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  total?: string | null;
  status: string;
  created_at?: string;
}

export interface PaymentInfo {
  id: string;
  label: string;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  sort_code?: string | null;
  mobile_money?: string | null;
  notes?: string | null;
  updated_at?: string;
}

export interface GalleryEvent {
  id: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  event_date?: string | null;
  event_location?: string | null;
  event_type?: string | null;
  impact?: string | null;
  additional_info?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryPhoto extends MediaItem {
  id: string;
  event_id: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role?: string | null;
  author_location?: string | null;
  photo_url?: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface UnsubscribeSubmission {
  id: string;
  email: string;
  reason?: string | null;
  created_at?: string;
}

export interface BlogLike {
  id: string;
  blog_post_id: string;
  email: string;
  created_at?: string;
}

export interface PaymentSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  amount: string;
  reference_number?: string | null;
  purpose?: string | null;
  message?: string | null;
  receipt_url?: string | null;
  source?: string | null;
  status: string;
  created_at?: string;
  course_id?: string | null;
  merch_id?: string | null;
  application_id?: string | null;
  order_id?: string | null;
}
