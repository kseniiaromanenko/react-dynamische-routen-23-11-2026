import { Link } from '@tanstack/react-router'
import type { TUser } from '#/types/types'

type UserInfoProps = {
  users: TUser[]
}
export function UserInfo({ users }: UserInfoProps) {
  return (
    <section>
      <h2>Benutzerübersicht</h2>
      <p>Wähle einen Benutzer aus.</p>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div>
              <strong>{user.name}</strong>
              <p>{user.role}</p>
            </div>

            <Link
              to="/users/$userId"
              params={{ userId: String(user.id) }}
              className="details-link"
            >
              Details ansehen
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
