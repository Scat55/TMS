# TMS — Transportation Management System

Система управления грузоперевозками. Позволяет создавать и отслеживать перевозки, управлять их статусами.

## Стек технологий

### Frontend
- React 19 + TypeScript
- Vite
- React Router v7
- TanStack Query
- Zustand
- React Hook Form + Zod
- Shadcn UI + Tailwind CSS v4
- Framer Motion

### Backend
- NestJS
- PostgreSQL
- Prisma 7
- JWT (httpOnly cookies)
- Docker

## Структура проекта

```
TMS/
├── apps/
│   ├── frontend/
│   │   └── src/
│   │       ├── app/        # Инициализация, провайдеры
│   │       ├── pages/      # Страницы
│   │       ├── widgets/    # Составные блоки UI
│   │       ├── features/   # Фичи
│   │       ├── entities/   # Бизнес-сущности
│   │       └── shared/     # Переиспользуемый код
│   └── backend/
│       └── src/
│           ├── auth/       # Авторизация
│           ├── shipments/  # Перевозки
│           └── prisma/     # Подключение к БД
└── docker-compose.yml
```

## Запуск

### База данных
```bash
docker-compose up -d
```

### Backend
```bash
cd apps/backend
npm install
npm run start:dev
```

### Frontend
```bash
cd apps/frontend
npm install
npm run dev
```
