// import { test, expect } from '@playwright/test' <- Replace this with the line below
import { test, expect } from 'playwright-test-coverage';


test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // await page.goto('http://google.com');
});
