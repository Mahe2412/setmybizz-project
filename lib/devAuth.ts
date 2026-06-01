import type { User } from '@supabase/supabase-js';

/** Local-only auth bypass — never enable in production builds */
export function isDevAuthBypass(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true'
  );
}

export const DEV_MOCK_USER_ID = '00000000-0000-4000-8000-devlocal01';

export const DEV_MOCK_USER = {
  id: DEV_MOCK_USER_ID,
  email: 'dev@localhost.setmybizz',
  app_metadata: {},
  user_metadata: { full_name: 'Local Dev User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

export const DEV_MOCK_DB_USER = {
  id: DEV_MOCK_USER_ID,
  email: 'dev@localhost.setmybizz',
  full_name: 'Local Dev User',
  registeredId: 'SMB-DEV-LOCAL',
};

export const DEV_MOCK_DB_BUSINESS = {
  id: 'dev-business-local',
  user_id: DEV_MOCK_USER_ID,
  name: 'Local Dev Business',
  business_name: 'Local Dev Business',
  state: '27',
  gstin: '',
  invoice_prefix: 'INV',
  next_invoice_no: 1,
};
