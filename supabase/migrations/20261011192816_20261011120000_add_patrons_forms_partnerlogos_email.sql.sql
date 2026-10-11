/*
# Add patrons, custom forms, partner logos, email log, and media enhancements

## 1. Patrons & Trustees
- New table `patrons` — portrait, name, title, biography, role (patron/trustee), sort_order, published
- New table `patron_submissions` — application form submissions for becoming a patron/trustee

## 2. Custom Form Builder
- New table `custom_forms` — form title, description, header text, published, shareable slug
- New table `custom_form_questions` — questions for each form (label, type, required, sort_order)
- New table `custom_form_submissions` — stores answers as JSON text keyed by question label

## 3. Partner Logos
- The existing `partners` table already has `logo_url` and `published` columns.
  Admin can add/remove logos through the existing Partners admin section.
  No new table needed — partners with logo_url and published=true are shown in the carousel.

## 4. Email Log
- New table `email_log` — tracks emails sent via the Resend edge function
  (recipient, subject, body, status, related form type)

## 5. Media Enhancement
- Adds `caption`, `video_url`, `media_type` columns to `merch_images`, `course_media`, and `program_media`
  so they match the existing `gallery_photos` schema and the MediaItem interface.

## 6. Sequential Display IDs
- Adds `display_id` serial integer column to content tables (blog_posts, cases, merch, programs, courses, gallery_events)
  for user-facing sequential numbering (001, 002, etc.). UUID remains the primary key.

## Security
- RLS enabled on all new tables.
- Content tables (patrons, custom_forms, custom_form_questions): anon+authenticated read; authenticated write.
- Submission tables (patron_submissions, custom_form_submissions): anon+authenticated insert; authenticated read/update/delete.
- Email log: authenticated-only access (admin tool).
*/