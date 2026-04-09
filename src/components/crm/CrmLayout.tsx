'use client'

import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import {
  LayoutDashboard, Users, Calendar, Link as LinkIcon,
  BarChart2, Settings, HelpCircle, LogOut, Home, ChevronLeft
} from 'lucide-react'

const brand  = '#0066FF'
const fg     = '#0F172A'
const muted  = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white  = '#ffffff'
const brandLight = '#EFF6FF'

const sidebarSt: CSSProperties   = { position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', backgroundColor: white, borderRight: '1px solid ' + border, display: 'flex', flexDirection: 'column', zIndex: 40 }
const logoWrap: CSSProperties    = { padding: '20px 16px 16px', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '10px' }
const logoDot: CSSProperties     = { width: '32px', height: '32px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }
const logoName: CSSProperties    = { fontSize: '13px', fontWeight: 700, color: fg, letterSpacing: '-0.01em' }
const logoSub: CSSProperties     = { fontSize: '10px', fontWeight: 400, color: muted }
const navSt: CSSProperties       = { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }
const bottomSt: CSSProperties    = { padding: '12px 8px', borderTop: '1px solid ' + border, display: 'flex', flexDirection: 'column', gap: '2px' }
const userRowSt: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '10px' }
const userAvatar: CSSProperties  = { width: '28px', height: '28px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }
const userNameSt: CSSProperties  = { fontSize: '12px', fontWeight: 600, color: fg }
const mainSt: CSSProperties      = { marginLeft: '220px', minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/leads',     label: 'Prospects',       icon: Users },
  { href: '/relances',  label: 'Relances',        icon: Calendar },
]

const bottomItems: NavItem[] = [
  { href: '/parametres', label: 'Param\u00e8tres', icon: Settings },
]

function NavLink({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname()
  const active = pathname.startsWith(href)
  const st: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: '10px', textDecoration: 'none',
    fontSize: '13px', fontWeight: active ? 600 : 400,
    color: active ? brand : muted,
    backgroundColor: active ? brandLight : 'transparent',
    transition: 'all 0.15s ease',
  }
  return (
    <Link href={href} style={st}>
      <Icon size={16} />
      {label}
    </Link>
  )
}

export default function CrmLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  async function logout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const logoutSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 400, color: muted, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'left' }
  const siteLink: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 400, color: muted, textDecoration: 'none' }

  return (
    <div style= fontFamily: 'var(--font-inter), system-ui, sans-serif' >
      <aside style={sidebarSt}>
        <div style={logoWrap}>
          <div style={logoDot}>AL</div>
          <div>
            <div style={logoName}>Alex Lopez</div>
            <div style={logoSub}>Mandataire IAD</div>
          </div>
        </div>

        <nav style={navSt}>
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
          ))}
        </nav>

        <div style={bottomSt}>
          <Link href="/" style={siteLink}>
            <Home size={16} /> Site vitrine
          </Link>
          {bottomItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
          ))}
          <button style={logoutSt} onClick={logout}>
            <LogOut size={16} /> Déconnexion
          </button>
          <div style={userRowSt}>
            <div style={userAvatar}>AL</div>
            <div style={userNameSt}>Alex Lopez</div>
          </div>
        </div>
      </aside>

      <main style={mainSt}>
        {children}
      </main>
    </div>
  )
}
