-- Function to increment tutorial view count
CREATE OR REPLACE FUNCTION increment_tutorial_view_count(tutorial_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.tutorials
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = tutorial_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_tutorial_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_tutorial_view_count(UUID) TO anon; 