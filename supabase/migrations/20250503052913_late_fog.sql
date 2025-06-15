/*
  # Create continue watching table

  1. New Tables
    - `continue_watching`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `media_id` (integer)
      - `media_type` (text, either 'movie' or 'tv')
      - `title` (text)
      - `poster_path` (text, nullable)
      - `progress` (integer)
      - `season_number` (integer, nullable)
      - `episode_number` (integer, nullable)
      - `playback_position` (integer)
      - `last_watched` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `continue_watching` table
    - Add policies for authenticated users to:
      - View their own data
      - Insert their own data
      - Update their own data
      - Delete their own data
*/

CREATE TABLE IF NOT EXISTS continue_watching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  media_id integer NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title text NOT NULL,
  poster_path text,
  progress integer NOT NULL DEFAULT 0,
  season_number integer,
  episode_number integer,
  playback_position integer NOT NULL DEFAULT 0,
  last_watched timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, media_id, media_type, season_number, episode_number)
);

ALTER TABLE continue_watching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own continue watching data"
  ON continue_watching
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own continue watching data"
  ON continue_watching
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own continue watching data"
  ON continue_watching
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own continue watching data"
  ON continue_watching
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);