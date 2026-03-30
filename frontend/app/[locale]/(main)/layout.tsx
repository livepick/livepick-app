import { NavigationLayout } from './NavigationLayout'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NavigationLayout>{children}</NavigationLayout>
}
