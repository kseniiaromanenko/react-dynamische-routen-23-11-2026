import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  component: UsersLayout,
})

function UsersLayout() {
  return (
    <main>
      <h1>Benutzerbereich</h1>
      <Outlet />
    </main>
  )
}
