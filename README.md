# Telegram Mini App (React + TypeScript)

Мини-приложение для Telegram на Vite, React и `@tma.js/sdk`.

## Требования

- [Node.js](https://nodejs.org/) 18+ (вместе с npm)

## Установка

```bash
cd my-telegram-app
npm install
```

Зависимости уже описаны в `package.json`, включая `@tma.js/sdk` и скрипт Telegram Web App в `index.html`.

## Запуск локально

```bash
npm run dev
```

Vite поднимет dev-сервер (обычно `http://localhost:5173`). В браузере без Telegram данные пользователя не подставятся — для полного теста нужен HTTPS-туннель и открытие через бота.

Сборка для продакшена:

```bash
npm run build
npm run preview
```

## Тестирование в Telegram через ngrok

Telegram открывает Mini App только по **HTTPS**. Локальный `http://localhost` напрямую в BotFather указать нельзя — используйте туннель.

### 1. Установите ngrok

Скачайте с [ngrok.com](https://ngrok.com/), зарегистрируйтесь и привяжите authtoken:

```bash
ngrok config add-authtoken ВАШ_ТОКЕН
```

### 2. Запустите dev-сервер

В одном терминале:

```bash
npm run dev
```

Запомните порт (по умолчанию **5173**).

### 3. Запустите туннель

В другом терминале:

```bash
ngrok http 5173
```

В выводе появится строка вида:

```
Forwarding   https://abcd-1234.ngrok-free.app -> http://localhost:5173
```

Скопируйте **HTTPS**-URL (например `https://abcd-1234.ngrok-free.app`).

> При каждом новом запуске ngrok (бесплатный план) URL может меняться — его нужно снова прописать в BotFather.

### 4. Обновите URL в BotFather

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. Команда `/mybots` → выберите своего бота.
3. **Bot Settings** → **Menu Button** или **Web App** (в зависимости от того, как настроен запуск).
4. Укажите URL мини-приложения: ваш ngrok-адрес, например `https://abcd-1234.ngrok-free.app`.
5. Сохраните и откройте бота — кнопка меню или команда запустит Mini App.

Для продакшена замените ngrok на постоянный хостинг с HTTPS (Vercel, Netlify, свой сервер и т.д.) и снова обновите URL в BotFather на финальный домен.

## Структура проекта

| Файл | Назначение |
|------|------------|
| `index.html` | Подключение `telegram-web-app.js` |
| `src/TelegramProvider.tsx` | Контекст: пользователь, `tg.*`, тема |
| `src/App.tsx` | UI: карточка, кнопки expand / showAlert |

## API в приложении

- `tg.expand()` — развернуть Mini App на весь экран
- `tg.showAlert(message)` — нативное уведомление Telegram
- `tg.close()` — закрыть Mini App
- `theme.colorScheme`, `theme.themeParams` — цвета темы Telegram
