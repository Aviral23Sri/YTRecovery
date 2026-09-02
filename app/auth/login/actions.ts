'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthFormState =
  | { error?: string; message?: string }
  | undefined

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email    = (formData.get('email')    as string).trim()
  const password = (formData.get('password') as string)

  if (!email || !password) {
    return { error: 'Please fill in both fields.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function googleLoginAction(): Promise<never> {
  // Derive the origin from the actual incoming request so this works on
  // localhost, VS Code dev tunnels, and ngrok — without hardcoding APP_URL.
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data.url) {
    redirect('/auth/login?error=oauth_error')
  }

  redirect(data.url)
}
