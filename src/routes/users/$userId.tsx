import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { users } from '#/data/users'

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()

  const user = users.find((item) => item.id === Number(userId))

  if (!user) {
    return (
      <section className="user-detail">
        <h2>Benutzer nicht gefunden</h2>
        <p>Für diese ID wurde kein Benutzer gefunden.</p>

        <button
          onClick={() =>
            navigate({ to: '/users', search: { role: undefined } })
          }
        >
          Zurück zur Übersicht
        </button>
      </section>
    )
  }

  return (
    <section className="user-detail">
      <p className="user-detail-label">Benutzerprofil</p>

      <h2>{user.name}</h2>

      <div className="user-information">
        <p>
          <strong>Benutzer-ID:</strong> {user.id}
        </p>

        <p>
          <strong>Rolle:</strong> {user.role}
        </p>
      </div>

      <button
        onClick={() => navigate({ to: '/users', search: { role: undefined } })}
      >
        Zurück zur Übersicht
      </button>
    </section>
  )
}
