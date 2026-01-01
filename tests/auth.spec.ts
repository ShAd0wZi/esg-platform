import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('/auth');

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'wrongpassword');

    // Create a promise that resolves when the dialog appears
    const dialogPromise = page.waitForEvent('dialog');

    await page.click('button:has-text("Sign In")');

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Login failed');
    await dialog.accept();
  });

  test('Login with valid credentials (Happy Path)', async ({ page }) => {
    // Mock Supabase Auth Token request
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: 'fake-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            confirmation_sent_at: '',
            confirmed_at: '',
            recovery_sent_at: '',
            last_sign_in_at: '',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: {},
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }),
      });
    });

    // Mock User request (getUser) - often called by client after auth state change
    await page.route('**/auth/v1/user*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'fake-user-id',
                aud: 'authenticated',
                role: 'authenticated',
                email: 'test@example.com',
            })
        });
    });

    // Mock Company Details request
    await page.route('**/rest/v1/companies*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            company_name: 'Test Company',
        }),
      });
    });

    // Mock Metrics request
    await page.route('**/rest/v1/metrics*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]), // Empty metrics for now
      });
    });

    await page.goto('/auth');

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'correctpassword');
    await page.click('button:has-text("Sign In")');

    // Expect to be redirected to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Check if dashboard content loads (e.g. "Test Company" or "Company Dashboard")
    await expect(page.getByText('ESG Overview')).toBeVisible();
  });
});
