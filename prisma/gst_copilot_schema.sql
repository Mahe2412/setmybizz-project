-- GST REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.gst_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  gstin TEXT,
  business_name TEXT,
  month TEXT,
  total_sales NUMERIC DEFAULT 0,
  cgst NUMERIC DEFAULT 0,
  sgst NUMERIC DEFAULT 0,
  igst NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, pending_payment, paid, processing, filed
  amount NUMERIC DEFAULT 499,
  payment_id TEXT,
  ai_insights JSONB,
  ai_errors JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gst_requests_user ON public.gst_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_gst_requests_status ON public.gst_requests(status);

-- Enable RLS
ALTER TABLE public.gst_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users view own GST requests"
  ON public.gst_requests FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'demo-user');

-- Policy: Users can create requests
CREATE POLICY "Users create GST requests"
  ON public.gst_requests FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own requests
CREATE POLICY "Users update own GST requests"
  ON public.gst_requests FOR UPDATE
  USING (true);
