import { createFileRoute } from '@tanstack/react-router'
import { UserInfo } from '#/components/UserInfo'
import { RoleFilter } from '#/components/RoleFilter'
import { users } from '#/data/users'

export const Route = createFileRoute('/users/')({
  validateSearch: (search: Record<string, unknown>) => {
    const role =
      search.role === 'Developer' ||
      search.role === 'Designer' ||
      search.role === 'Project Manager'
        ? search.role
        : undefined
    return { role }
  },

  component: UsersPage,
})

function UsersPage() {
  const { role } = Route.useSearch()
  const visibleUsers = role ? users.filter((user) => user.role === role) : users

  return (
    <>
      <RoleFilter />
      <UserInfo users={visibleUsers} />
    </>
  )
}
