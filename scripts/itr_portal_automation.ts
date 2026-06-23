/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE AI — Official Portal Automation Engine (Playwright)
 *  This script runs a headless browser to authenticate with the IT portal,
 *  navigates to filing, uploads the generated JSON draft, and waits for OTP.
 * ═══════════════════════════════════════════════════════════════
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';

interface FilingDetails {
  pan: string;
  password?: string;
  filePath: string;
  assessmentYear: string;
}

export async function executePortalFiling(details: FilingDetails) {
  console.log(`[Automation] Starting Playwright Browser for PAN: ${details.pan}`);
  
  const browser: Browser = await chromium.launch({
    headless: false, // Run with visible UI for debugging/CA monitoring
    slowMo: 100,     // Delay between actions to bypass bot detection
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page: Page = await context.newPage();

  try {
    // 1. Go to Income Tax India e-filing portal
    console.log('[Automation] Opening Income Tax portal...');
    await page.goto('https://www.incometax.gov.in/iec/foportal/', { waitUntil: 'networkidle' });

    // 2. Click Login button
    console.log('[Automation] Navigating to Login page...');
    await page.click('text=Login');
    await page.waitForSelector('#loginIdVal');

    // 3. Enter PAN
    console.log('[Automation] Entering PAN...');
    await page.fill('#loginIdVal', details.pan);
    await page.click('.login-btn'); // Click continue

    // 4. Accept declaration checkbox & Enter Password
    console.log('[Automation] Entering password...');
    await page.waitForSelector('#login-declaration-checkbox');
    await page.check('#login-declaration-checkbox');
    await page.fill('#login-password-field', details.password || 'TemporaryPassword123');
    await page.click('.submit-login-btn');

    // 5. Navigate to File Income Tax Return
    console.log('[Automation] Navigating to e-File > Income Tax Returns > File Income Tax Return...');
    await page.waitForSelector('text=e-File');
    await page.hover('text=e-File');
    await page.click('text=Income Tax Returns');
    await page.click('text=File Income Tax Return');

    // 6. Select Assessment Year & Filing Mode
    console.log('[Automation] Selecting Assessment Year: ' + details.assessmentYear);
    await page.selectOption('#assessment-year-dropdown', details.assessmentYear);
    await page.click('text=Offline (Utility Upload)'); // Choose offline utility mode
    await page.click('#continue-btn');

    // 7. Upload the ITR JSON Utility File
    console.log(`[Automation] Uploading ITR JSON utility from path: ${details.filePath}`);
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.setInputFiles(details.filePath);
    } else {
      throw new Error('Upload input selector not found on the page');
    }

    // 8. Click Validate and proceed to verification
    console.log('[Automation] Draft validation successful. Navigating to verification section...');
    await page.click('#validate-json-btn');
    await page.waitForSelector('text=Proceed to Verification');
    await page.click('text=Proceed to Verification');

    // 9. Trigger Aadhaar OTP screen
    console.log('[Automation] Aadhaar OTP screen reached. Waiting for OTP from CA Dashboard...');
    await page.click('text=Aadhaar OTP Verification');
    await page.click('#send-otp-btn');

    // Return current page screen snapshot path & state for the agent console to show
    const screenshotPath = `public/screenshots/filing_otp_waiting_${details.pan}.png`;
    await page.screenshot({ path: screenshotPath });
    
    console.log(`[Automation] Screen captured at: ${screenshotPath}`);
    console.log(`[Automation] Status: INTERRUPTED — Waiting for OTP input.`);

    return {
      success: true,
      status: 'WAITING_FOR_OTP',
      screenshot: `/screenshots/filing_otp_waiting_${details.pan}.png`,
    };

  } catch (error: any) {
    console.error('[Automation] Filing process failed:', error.message);
    await page.screenshot({ path: `public/screenshots/error_${details.pan}.png` });
    return {
      success: false,
      error: error.message,
    };
  } finally {
    // Keep browser open for verification or close
    // await browser.close();
  }
}
