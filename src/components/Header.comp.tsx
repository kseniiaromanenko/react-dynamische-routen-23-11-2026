import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header>
      <h2>User Dashboard</h2>

      <nav>
        <Link to="/">Startseite</Link>
        <Link to="/users" search={{ role: undefined }}>
          Benutzer
        </Link>
        <Link to="/about">Über uns</Link>
      </nav>
    </header>
  )
}
