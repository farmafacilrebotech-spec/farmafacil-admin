import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirigir al dashboard directamente
  redirect('/dashboard');
}
