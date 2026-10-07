import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))

import { MobileMenu } from './mobile-menu'

const t = {
  services: 'Services',
  howItWorks: 'How it Works',
  becomeHelper: 'Become a Helper',
  dashboard: 'Dashboard',
  login: 'Log in',
  signup: 'Sign Up',
}

/** The menu links are only rendered (into a portal on document.body) after opening. */
async function renderOpenMenu(session: unknown) {
  const user = userEvent.setup()
  render(<MobileMenu t={t} session={session} />)
  await user.click(screen.getByRole('button', { name: /open menu/i }))
}

describe('MobileMenu', () => {
  it('does not show links until the menu is opened', () => {
    render(<MobileMenu t={t} session={null} />)
    expect(screen.queryByRole('link', { name: 'Services' })).not.toBeInTheDocument()
  })

  it.each([
    ['ADMIN', '/admin'],
    ['HELPER', '/helper/dashboard'],
    ['CUSTOMER', '/customer/dashboard'],
  ])('links the dashboard for %s to %s', async (role, href) => {
    await renderOpenMenu({ user: { role } })
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', href)
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })

  it('shows log in and sign up links when there is no session', async () => {
    await renderOpenMenu(null)
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register')
    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument()
  })
})