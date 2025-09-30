# СоюзМультПарк AR Experience

Интерактивное AR-приложение для посетителей ВДНХ у здания СоюзМультФильм. Проект предоставляет иммерсивный опыт дополненной реальности с любимыми персонажами мультфильмов.

## 🎯 Описание

Мобильное веб-приложение, которое накладывает 3D-модели персонажей СоюзМультФильм при наведении камеры на специальные маркеры. Включает панорамный просмотр локаций и интерактивные элементы с эффектами снега.

## 🚀 Технологии

- **A-Frame** (v1.2.0) - WebXR фреймворк
- **MindAR** (v1.1.5) - Image tracking для AR
- **Three.js** (v0.180.0) - 3D рендеринг и панорамы
- **GSAP** (v3.13.0) - Анимации прелоадера
- **Vite** (v5.0.2) - Сборщик и dev сервер

## 📦 Установка

```bash
# Клонирование репозитория
git clone git@github.com:aribadri/hakaton.git
cd hakaton

# Установка зависимостей
yarn install

# Запуск dev сервера
yarn dev
```

## 🛠️ Команды

```bash
yarn dev      # Запуск dev сервера (http://localhost:5173)
yarn build    # Сборка для production
yarn preview  # Предпросмотр production сборки
```

## 📁 Структура проекта

```
hakaton/
├── src/
│   ├── components/
│   │   ├── preloader/          # Модуль прелоадера с GSAP
│   │   │   ├── preloader.js
│   │   │   ├── preloader-animations.js
│   │   │   ├── preloader-markup.js
│   │   │   └── preloader.css
│   │   ├── snow.js             # Компонент снега
│   │   ├── getScreenshot.js    # Скриншоты AR-сцены
│   │   └── change-textures.js  # Смена текстур
│   ├── styles/
│   │   ├── variables.css       # CSS переменные бренда
│   │   └── buttons.css         # Стили кнопок
│   ├── images/                 # Логотип и персонажи
│   ├── index.html              # Главная страница
│   ├── index.js                # Точка входа
│   ├── panorama.js             # Панорамный просмотр
│   ├── config.js               # Конфигурация
│   ├── style.css               # Основные стили
│   └── DeviceOrientationControls.js
├── static/
│   ├── models/                 # 3D модели (.glb)
│   ├── targets/                # AR маркеры (.mind)
│   └── textures/               # Панорамы
└── package.json
```

## 🎨 Особенности

### AR Tracking
- Распознавание изображений через MindAR
- Target: `targets-volk.mind`
- 3D модель: `santa.glb`
- Разрешение камеры: 1280x720

### Прелоадер
- Градиентный фон с брендовыми цветами (#726de3 → #face18)
- GSAP анимации логотипа и персонажей
- Прогресс-бар загрузки
- Автоскрытие при событии `arReady`

### Панорамы
- Three.js сферический просмотр
- DeviceOrientationControls для мобильных
- Плавные переходы с GSAP
- 3 панорамы в карусели

### Эффекты
- Particle system снега (4000 частиц x2)
- Screenshot функционал
- Динамическая смена текстур

## 📱 Мобильная оптимизация

Проект оптимизирован под мобильные устройства:
- Target: 320-700px ширина экрана
- Touch-friendly интерфейс
- Device orientation support
- High pixel ratio rendering

## 🎨 Брендинг

Цветовая схема СоюзМультПарк:
- Primary: `#726de3`
- Secondary: `#face18`
- Info: `#17a2b8`
- Border radius: `15px`

## 🌐 Deploy

Проект настроен для деплоя на Vercel:

```bash
vercel deploy
```

## 👥 Команда

Разработано на хакатоне Московского инновационного класстера для СоюзМультПарк

## 📄 Лицензия

MIT
