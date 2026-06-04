import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  username?: string
  language_code?: string
}

export interface TelegramTheme {
  colorScheme: 'light' | 'dark'
  themeParams: TelegramThemeParams
}

export interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
}

export interface TelegramApi {
  expand: () => void
  close: () => void
  showAlert: (message: string) => void
}

interface TelegramContextValue {
  user: TelegramUser | null
  tg: TelegramApi
  theme: TelegramTheme
  isReady: boolean
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

function getWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

const fallbackTheme: TelegramTheme = {
  colorScheme: 'light',
  themeParams: {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    button_color: '#2481cc',
    button_text_color: '#ffffff',
    secondary_bg_color: '#f4f4f5',
  },
}

const fallbackTg: TelegramApi = {
  expand: () => console.info('[Telegram] expand() — запустите приложение в Telegram'),
  close: () => console.info('[Telegram] close()'),
  showAlert: (message: string) => window.alert(message),
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [theme, setTheme] = useState<TelegramTheme>(fallbackTheme)

  const tg = useMemo<TelegramApi>(() => {
    const webApp = getWebApp()
    if (!webApp) return fallbackTg

    return {
      expand: () => webApp.expand(),
      close: () => webApp.close(),
      showAlert: (message: string) => webApp.showAlert(message),
    }
  }, [isReady])

  useEffect(() => {
    const webApp = getWebApp()
    if (!webApp) {
      setIsReady(true)
      return
    }

    webApp.ready()

    const unsafe = webApp.initDataUnsafe
    const rawUser = unsafe.user
    if (rawUser) {
      setUser({
        id: rawUser.id,
        first_name: rawUser.first_name,
        username: rawUser.username,
        language_code: rawUser.language_code,
      })
    }

    const syncTheme = () => {
      setTheme({
        colorScheme: webApp.colorScheme,
        themeParams: { ...webApp.themeParams },
      })
    }

    syncTheme()
    setIsReady(true)

    const onThemeChanged = () => syncTheme()
    webApp.onEvent('themeChanged', onThemeChanged)
    return () => webApp.offEvent('themeChanged', onThemeChanged)
  }, [])

  const value = useMemo(
    () => ({ user, tg, theme, isReady }),
    [user, tg, theme, isReady],
  )

  return (
    <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
  )
}

export function useTelegram(): TelegramContextValue {
  const ctx = useContext(TelegramContext)
  if (!ctx) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return ctx
}
