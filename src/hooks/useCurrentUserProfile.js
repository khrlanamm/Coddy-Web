import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useCurrentUserProfile() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) {
          if (isMounted) {
            setUser(null)
            setProfile(null)
          }
          return
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // selain "no rows", anggap error
          throw profileError
        }

        if (isMounted) {
          setUser(user)
          setProfile(data) // bisa null kalau belum ada row
        }
      } catch (err) {
        if (isMounted) {
          console.error('load profile error', err)
          setError(err)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return { loading, user, profile, error }
}
