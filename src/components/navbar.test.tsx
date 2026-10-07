import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const { getServerSession } = vi.hoisted(() => ({ getServerSession: vi.fn() }))

vi.mock('next-auth/next', () => ({ getServerSession }))
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => undefined }),
}))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))

// Child components have their own dependencies; stub them so this test
// focuses on the Navbar's own output.
vi.mock('./logout-button', () => ({ LogoutButton: () => <button>Log out</button> }))
vi.mock('./theme-toggle', () => ({ ThemeToggle: () => null }))
vi.mock('./language-toggle', () => ({ LanguageToggle: () => null }))
vi.mock('./NotificationBell', () => ({ default: () => null }))
vi.mock('./mobile-menu', () => ({ MobileMenu: () => null }))

import { Navbar } from './navbar'

/** Navbar is an async Server Component: await it, then render the result. */
async function renderNavbar() {
  render(await Navbar())
  return within(screen.getByRole('banner'))
}

describe('Navbar', () => {
  beforeEach(() => {
    getServerSession.mockReset()
  })

  it.each([
    ['ADMIN', '/admin'],
    ['HELPER', '/helper/dashboard'],
    ['CUSTOMER', '/customer/dashboard'],
  ])('links the dashboard for %s to %s', async (role, href) => {
    getServerSession.mockResolvedValue({ user: { role } })
    const header = await renderNavbar()
    expect(header.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', href)
    expect(header.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument()
  })

  it('shows log in and sign up links when not authenticated', async () => {
    getServerSession.mockResolvedValue(null)
    const header = await renderNavbar()
    expect(header.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login')
    expect(header.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register')
    expect(header.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument()
  })
})