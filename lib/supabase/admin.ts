import { createClient } from '@supabase/supabase-js'

/**
 * Admin client using the service_role key.
 * ONLY use this in server-side Route Handlers (webhook, etc.).
 * NEVER import this in any client component or expose it to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
