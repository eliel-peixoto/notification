import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://brxxyynxcdjuoanxyvrf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeHh5eW54Y2RqdW9hbnh5dnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTMxMDQsImV4cCI6MjA4MDk4OTEwNH0.gRgSkTLW3CVXP7627RBD2VyV5W0WZinuEKXJUTiRW_U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: 'expo-secure-store',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})