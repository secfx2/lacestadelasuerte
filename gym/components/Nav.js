'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const ITEMS = [
  { href: '/', label: 'Hoy', icon: 'home', match: (p) => p === '/' },
  { href: '/entreno', label: 'Entreno', icon: 'dumbbell', match: (p) => p.startsWith('/entreno') || p.startsWith('/ejercicio') },
  { href: '/dieta', label: 'Dieta', icon: 'food', match: (p) => p.startsWith('/dieta') || p.startsWith('/receta') },
  { href: '/progreso', label: 'Progreso', icon: 'chart', match: (p) => p.startsWith('/progreso') },
  { href: '/plan', label: 'Plan', icon: 'book', match: (p) => p.startsWith('/plan') || p.startsWith('/ajustes') },
];

export default function Nav() {
  const path = usePathname() || '/';
  if (path.startsWith('/login') || path.startsWith('/dev')) return null;
  return (
    <nav className="nav" aria-label="Navegación principal">
      {ITEMS.map((it) => (
        <Link key={it.href} href={it.href} className={it.match(path) ? 'on' : ''} prefetch>
          <Icon name={it.icon} size={22} />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
