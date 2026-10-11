-- 5. Media Enhancement: add caption, video_url, media_type to merch_images, course_media, program_media
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merch_images' AND column_name = 'caption') THEN
    ALTER TABLE merch_images ADD COLUMN caption text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merch_images' AND column_name = 'video_url') THEN
    ALTER TABLE merch_images ADD COLUMN video_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merch_images' AND column_name = 'media_type') THEN
    ALTER TABLE merch_images ADD COLUMN media_type text DEFAULT 'image';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_media' AND column_name = 'caption') THEN
    ALTER TABLE course_media ADD COLUMN caption text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_media' AND column_name = 'video_url') THEN
    ALTER TABLE course_media ADD COLUMN video_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_media' AND column_name = 'media_type') THEN
    ALTER TABLE course_media ADD COLUMN media_type text DEFAULT 'image';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_media' AND column_name = 'caption') THEN
    ALTER TABLE program_media ADD COLUMN caption text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_media' AND column_name = 'video_url') THEN
    ALTER TABLE program_media ADD COLUMN video_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_media' AND column_name = 'media_type') THEN
    ALTER TABLE program_media ADD COLUMN media_type text DEFAULT 'image';
  END IF;
END $$;

-- 6. Sequential display IDs for content tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'display_id') THEN
    ALTER TABLE blog_posts ADD COLUMN display_id serial;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'display_id') THEN
    ALTER TABLE cases ADD COLUMN display_id serial;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'merch' AND column_name = 'display_id') THEN
    ALTER TABLE merch ADD COLUMN display_id serial;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'display_id') THEN
    ALTER TABLE programs ADD COLUMN display_id serial;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'display_id') THEN
    ALTER TABLE courses ADD COLUMN display_id serial;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_events' AND column_name = 'display_id') THEN
    ALTER TABLE gallery_events ADD COLUMN display_id serial;
  END IF;
END $$;