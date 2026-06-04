import { TelegramProvider, useTelegram } from './TelegramProvider'
import './App.css'

function avatarColor(name: string): string {
  const palette = [
    '#e17076',
    '#7bc862',
    '#65aadd',
    '#a695e7',
    '#ee7aae',
    '#6ec9cb',
    '#faa774',
  ]
  const code = name.charCodeAt(0) || 0
  return palette[code % palette.length]
}

function AppContent() {
  const { user, tg, theme } = useTelegram()
  const params = theme.themeParams
  const displayName = user?.first_name ?? 'Гость'
  const initial = displayName.charAt(0).toUpperCase()

  const style = {
    '--tg-bg': params.bg_color ?? '#ffffff',
    '--tg-text': params.text_color ?? '#000000',
    '--tg-hint': params.hint_color ?? '#999999',
    '--tg-button': params.button_color ?? '#2481cc',
    '--tg-button-text': params.button_text_color ?? '#ffffff',
    '--tg-secondary': params.secondary_bg_color ?? '#f4f4f5',
  } as React.CSSProperties

  return (
    <div className="app" style={style} data-theme={theme.colorScheme}>
      <main className="card">
        <div
          className="avatar"
          style={{ backgroundColor: avatarColor(displayName) }}
          aria-hidden
        >
          {initial}
        </div>

        <h1 className="greeting">Привет, {displayName}!</h1>

        {user?.username && (
          <p className="username">@{user.username}</p>
        )}

        {user?.language_code && (
          <p className="meta">Язык: {user.language_code}</p>
        )}

        {!user && (
          <p className="hint">
            Откройте приложение в Telegram, чтобы увидеть данные пользователя.
          </p>
        )}

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => tg.expand()}>
            Развернуть на весь экран
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => tg.showAlert('Привет из Telegram Mini App!')}
          >
            Показать сообщение
          </button>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  )
}

export default App
