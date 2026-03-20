import { test, expect } from '@playwright/test'

// Basic smoke test: login page renders.
test('login page loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByText('Sign in')).toBeVisible()
})
