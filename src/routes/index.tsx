import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="p-8">
      <h1>Willkommen im User Dashboard</h1>
      <p>
        Hier kannst du Benutzerprofile ansehen und Benutzer nach ihrer Rolle
        filtern.
      </p>
    </main>
  )
}
