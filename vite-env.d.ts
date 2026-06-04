/// <reference types="vite/client" />

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser
    query_id?: string
    auth_date?: number
    hash?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: TelegramThemeParams
  ready: () => void
  expand: () => void
  close: () => void
  showAlert: (message: string, callback?: () => void) => void
  onEvent: (eventType: string, callback: () => void) => void
  offEvent: (eventType: string, callback: () => void) => void
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
