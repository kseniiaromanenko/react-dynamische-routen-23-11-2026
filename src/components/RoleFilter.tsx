import { Link } from '@tanstack/react-router'
import type { UserRole } from '#/types/types'

const roles: UserRole[] = ['Developer', 'Designer', 'Project Manager']

export function RoleFilter() {
  return (
    <nav className="filter-navigation">
      <Link to="/users" search={{ role: undefined }}>
        Alle
      </Link>
      {roles.map((role) => (
        <Link key={role} to="/users" search={{ role }}>
          {role}
        </Link>
      ))}
    </nav>
  )
}
