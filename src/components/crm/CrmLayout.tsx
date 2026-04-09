'use client'

import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Home } from 'lucide-react'

const brand      = '#0066FF'
const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const surface    = '#F8FAFC'
const white      = '#ffffff'
const brandLight = '#EFF6FF'

const wrapperSt: CSSProperties  = { display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const sidebarSt: CSSProperties  = { position: 'fixed', top: 0, left: 0, bottom: 0, width: '220px', backgroundColor: white, borderRight: '1px solid ' + border, display: 'flex', flexDirection: 'column', zIndex: 40 }
const logoWrap: CSSProperties   = { padding: '20px 16px 16px', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '10px' }
const logoDot: CSSProperties    = { width: '32px', height: '32px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }
const logoName: CSSProperties   = { fontSize: '13px', fontWeight: 700, color: fg, letterSpacing: '-0.01em' }
const logoSub: CSSProperties    = { fontSize: '10px', fontWeight: 400, color: muted }
const navSt: CSSProperties      = { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }
const bottomSt: CSSProperties   = { padding: '12px 8px', borderTop: '1px solid ' + border, display: 'flex', flexDirection: 'column', gap: '2px' }
const userRow: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px' }
const userAvatar: CSSProperties = { width: '28px', height: '28px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }
const userName: CSSProperties   = { fontSize: '12px', fontWeight: 600, color: fg }
const mainSt: CSSProperties     = { marginLeft: '220px', flex: 1, minHeight: '100vh', backgroundColor: surface }
const siteLnk: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 400, color: muted, textDecoration: 'none' }
const logoutBtnSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 400, color: muted, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'left' }

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { href: '/leads',     label: 'Prospects',        Icon: Users },
  { href: '/relances',  label: 'Relances',         Icon: Calendar },
]
const bottomItems = [
  { href: '/parametres', label: 'Param\u00e8tres', Icon: Settings },
]

function navLinkSt(active: boolean): CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: '10px', textDecoration: 'none',
    fontSize: '13px', fontWeight: active ? 600 : 400,
    color: active ? brand : muted,
    backgroundColor: active ? brandLight : 'transparent',
  }
}

function NavLink({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname()
  const active   = pathname.startsWith(href)
  return (
    <Link href={href} style={navLinkSt(active)}>
      <Icon size={16} />{label}
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

  return (
    <div style={wrapperSt}>
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
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.Icon} />
          ))}
        </nav>

        <div style={bottomSt}>
          <Link href="/" style={siteLnk}><Home size={16} /> Site vitrine</Link>
          {bottomItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.Icon} />
          ))}
          <button style={logoutBtnSt} onClick={logout}>
            <LogOut size={16} /> {'D\u00e9connexion'}
          </button>
          <div style={userRow}>
            <div style={userAvatar}>AL</div>
            <div style={userName}>Alex Lopez</div>
          </div>
        </div>
      </aside>

      <main style={mainSt}>{children}</main>
    </div>
  )
}
