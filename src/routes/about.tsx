import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <h1>Über uns</h1>
      <p>
        Dieses Projekt ist ein kleines User Dashboard mit React und TanStack
        Router.
      </p>
    </main>
  )
}
