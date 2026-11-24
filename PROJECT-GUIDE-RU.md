# Mini User Dashboard — пошаговое объяснение

Этот файл объясняет, как устроен проект, как связаны его компоненты и где используется TypeScript.

## 1. Структура проекта

```text
src/
├── components/
│   ├── Header.comp.tsx
│   ├── RoleFilter.tsx
│   └── UserInfo.tsx
├── data/
│   └── users.ts
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   └── users/
│       ├── route.tsx
│       ├── index.tsx
│       └── $userId.tsx
├── types/
│   └── types.ts
├── main.tsx
├── router.tsx
└── styles.css
```

## 2. Как запускается приложение

`main.tsx` — точка входа. Он создаёт React-приложение и передаёт ему TanStack Router:

```tsx
root.render(<RouterProvider router={router} />)
```

`router.tsx` получает сгенерированное дерево маршрутов из `routeTree.gen.ts`.

`routeTree.gen.ts` создаётся TanStack Router автоматически. Этот файл нельзя редактировать вручную.

## 3. Корневой маршрут

`routes/__root.tsx` — общая оболочка всего приложения.

```tsx
<Header />
<Outlet />
```

`Header` остаётся на всех страницах. Вместо `Outlet` роутер показывает текущую страницу.

```text
URL /        → Outlet показывает Home
URL /about   → Outlet показывает About
URL /users   → Outlet показывает UsersLayout
```

## 4. Обычные маршруты

```text
routes/index.tsx → /
routes/about.tsx → /about
```

В route-файле строка:

```tsx
component: Home
```

не создаёт компонент. Она сообщает роутеру, какой компонент нужно показать.

Сам компонент создаётся отдельно:

```tsx
function Home() {
  return <main>...</main>
}
```

## 5. Вложенный маршрут `/users`

```text
routes/users/route.tsx
```

— layout пользовательского раздела.

```tsx
<h1>Benutzerbereich</h1>
<Outlet />
```

В его `Outlet` попадает одна из дочерних страниц:

```text
/users   → users/index.tsx
/users/1 → users/$userId.tsx
```

## 6. Динамический маршрут

Файл:

```text
routes/users/$userId.tsx
```

обрабатывает разные URL по одному шаблону:

```text
/users/1
/users/2
/users/99
```

Параметр читается так:

```tsx
const { userId } = Route.useParams()
```

Параметр URL является строкой. В данных `id` является числом, поэтому используется преобразование:

```tsx
Number(userId)
```

После этого `find()` ищет одного пользователя:

```tsx
const user = users.find(
  (item) => item.id === Number(userId),
)
```

`find()` возвращает один объект или `undefined`.

## 7. Search Params и фильтрация

URL:

```text
/users?role=Designer
```

состоит из пути `/users` и Search Parameter `role=Designer`.

### Шаг 1: RoleFilter меняет URL

```tsx
<Link to="/users" search={{ role: 'Designer' }}>
  Designer
</Link>
```

`RoleFilter` не фильтрует массив. Он только изменяет URL.

### Шаг 2: validateSearch проверяет URL

```tsx
validateSearch: (search: Record<string, unknown>) => {
  // Проверка role
  return { role }
}
```

`unknown` означает: значение пришло извне, и мы пока не знаем его тип. Перед использованием его необходимо проверить.

### Шаг 3: useSearch читает результат

```tsx
const { role } = Route.useSearch()
```

### Шаг 4: filter создаёт новый массив

```tsx
const visibleUsers = role
  ? users.filter((user) => user.role === role)
  : users
```

`filter()` не изменяет исходный массив. Он создаёт новый массив только с подходящими элементами.

### Шаг 5: результат передаётся через Props

```tsx
<UserInfo users={visibleUsers} />
```

`UserInfo` получает уже подготовленный массив и отображает его.

Полная цепочка:

```text
RoleFilter
  → изменяет URL
  → validateSearch проверяет role
  → useSearch получает role
  → filter создаёт visibleUsers
  → Props передают visibleUsers
  → UserInfo отображает список
```

## 8. Props и TypeScript

Тип одного пользователя:

```tsx
export type TUser = {
  id: number
  name: string
  role: string
}
```

Разница между одним объектом и массивом:

```tsx
TUser    // один пользователь
TUser[]  // массив пользователей
```

Примеры:

```tsx
const user: TUser = {
  id: 1,
  name: 'Max',
  role: 'Developer',
}
```

```tsx
const users: TUser[] = [
  { id: 1, name: 'Max', role: 'Developer' },
  { id: 2, name: 'Lisa', role: 'Designer' },
]
```

Тип Props компонента списка:

```tsx
type UserInfoProps = {
  users: TUser[]
}
```

Компонент получает Props как объект. Деструктуризация `{ users }` извлекает массив из этого объекта:

```tsx
export function UserInfo({ users }: UserInfoProps) {
  return <ul>...</ul>
}
```

## 9. `import type`

Если импорт используется только как TypeScript-тип, пишем:

```tsx
import type { TUser } from '#/types/types'
```

Если импорт нужен приложению во время выполнения, пишем обычный импорт:

```tsx
import { users } from '#/data/users'
```

## 10. Почему приложение работает при красных подчёркиваниях

Vite может собрать и запустить приложение, даже когда TypeScript обнаруживает неправильные типы. Поэтому браузер иногда показывает рабочую страницу, но редактор подчёркивает код красным.

Проверка TypeScript:

```bash
npx tsc --noEmit
```

Проверка ESLint:

```bash
npm run lint
```

Проверка production-сборки:

```bash
npm run build
```

Для законченного задания должны успешно проходить все три команды.

## 11. Текущие места для исправления

### Массив пользователей

`users` содержит массив, поэтому его тип должен быть `TUser[]`, а не `TUser`:

```tsx
export const users: TUser[] = [
  // пользователи
]
```

### Ссылки на `/users`

После добавления `validateSearch` TanStack Router знает, что у маршрута есть объект `search`. При переходе без фильтра передаём:

```tsx
search={{ role: undefined }}
```

Это требуется в ссылке Header:

```tsx
<Link to="/users" search={{ role: undefined }}>
  Benutzer
</Link>
```

И в программной навигации:

```tsx
navigate({
  to: '/users',
  search: { role: undefined },
})
```

### Форматирование импортов

ESLint требует пустую строку между последним импортом и остальным кодом:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { users } from '#/data/users'

export const Route = ...
```

## 12. Практика TypeScript

Выполняй упражнения по одному и после каждого запускай `npx tsc --noEmit`.

### Упражнение 1

Создай переменную одного пользователя:

```tsx
const exampleUser: TUser = {
  id: 4,
  name: 'Anna',
  role: 'Tester',
}
```

Попробуй временно записать `id: '4'` и прочитай ошибку TypeScript. Затем верни число.

### Упражнение 2

Создай тип Props для карточки:

```tsx
type UserCardProps = {
  user: TUser
}
```

Обрати внимание: карточка получает одного пользователя, поэтому здесь `TUser`, а не `TUser[]`.

### Упражнение 3

Добавь необязательное свойство:

```tsx
type UserCardProps = {
  user: TUser
  showId?: boolean
}
```

Знак `?` означает, что Props можно не передавать.

### Упражнение 4

Ограничь возможные роли:

```tsx
export type UserRole =
  | 'Developer'
  | 'Designer'
  | 'Project Manager'

export type TUser = {
  id: number
  name: string
  role: UserRole
}
```

После этого TypeScript не разрешит записать неизвестную роль.

## 13. Что нужно запомнить

```text
type описывает форму данных
TUser описывает один объект
TUser[] описывает массив объектов
Props передают данные от родителя ребёнку
map превращает элементы массива в JSX
filter создаёт отфильтрованный массив
find находит один элемент
useParams читает динамический сегмент пути
useSearch читает Search Params
validateSearch проверяет данные из URL
Outlet показывает дочерний маршрут
```

