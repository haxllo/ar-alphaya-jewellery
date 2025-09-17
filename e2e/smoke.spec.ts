import { test, expect } from '@playwright/test'

test('home renders and shows featured', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Featured')).toBeVisible()
})

test('PDP renders', async ({ page }) => {
  await page.goto('/')
  const firstLink = page.locator('a[href^="/products/"]').first()
  const href = await firstLink.getAttribute('href')
  expect(href).toBeTruthy()
  await page.goto(href!)
  await expect(page.getByRole('heading').first()).toBeVisible()
})

test('add to cart and view cart', async ({ page }) => {
  await page.goto('/')
  const firstLink = page.locator('a[href^="/products/"]').first()
  const href = await firstLink.getAttribute('href')
  expect(href).toBeTruthy()
  await page.goto(href!)
  const addBtn = page.getByRole('button', { name: /add to cart/i })
  if (await addBtn.isVisible()) {
    await addBtn.click()
  }
  await page.goto('/cart')
  await expect(page.getByText('Shopping Cart')).toBeVisible()
})

test('checkout page renders', async ({ page }) => {
  await page.goto('/checkout')
  await expect(page.getByText('Checkout')).toBeVisible()
})


