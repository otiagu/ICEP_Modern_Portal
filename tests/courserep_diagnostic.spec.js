const { test, expect } = require('@playwright/test');

test.describe('Course Rep Portal Diagnostic Suite', () => {

  test('E2E Full Simulation Walkthrough', async ({ page }) => {
    let unhandledExceptions = [];
    page.on('pageerror', (exception) => {
      unhandledExceptions.push(exception.message);
      console.error(`Uncaught exception: "${exception.message}"`);
    });
    
    // Phase 1: Page Load & Initial State Audit
    await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/ICEP_courserep_modern.html');
    
    // Check for any uncaught exceptions immediately
    expect(unhandledExceptions.length, `Found ${unhandledExceptions.length} uncaught exceptions on load`).toBe(0);

    // Assert the Course Rep profile card displays
    const avatar = page.locator('.portrait-img');
    await expect(avatar).toBeVisible();
    
    // Check for infinite fallback loops by verifying the src hasn't changed repeatedly.
    // In our manual test, naturalWidth > 0 is a good proxy.
    const naturalWidth = await avatar.evaluate((img) => (img).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
    
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.hero-sub')).toContainText('2026/');
    
    // Phase 2: Navigation Drawer & Redundancy Pruning
    await page.locator('.hamburger').click();
    
    // The drawer should slide into view (wait for it to become visible)
    const mobileNav = page.locator('.mobile-menu');
    await expect(mobileNav).toHaveClass(/open/);
    
    // Assert: "Other Portals" link does NOT route in a loop back to the same Course Rep page
    // The "prunePortals" logic should have hidden the Course Rep link.
    const courserepLink = page.locator('.mobile-nav a[href*="ICEP_courserep_modern.html"]');
    // Check if it's hidden by the prunePortals logic (display: none)
    if (await courserepLink.count() > 0) {
       await expect(courserepLink).not.toBeVisible();
    }
    
    // Assert: Unauthenticated "Login Page" link is hidden
    const loginLink = page.locator('.mobile-nav a[href*="ICEP_login_modern.html"]');
    if (await loginLink.count() > 0) {
       await expect(loginLink).not.toBeVisible();
    }
    
    // Click outside or hit the ✕ close button
    await page.locator('.mobile-menu-close').click();
    await expect(mobileNav).not.toHaveClass(/open/);
    await page.waitForTimeout(500);
    // Verify no scroll lock
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).not.toBe('hidden');

    // Phase 3: Timetable Engine & Lecture Schedule Simulation
    // Expand the Timetable accordion first
    await page.locator('#modTime .acc-header').click();
    await page.waitForTimeout(300); // Wait for accordion animation
    await page.locator('.btn-full-detail.blue-btn', { hasText: 'Full Detail' }).click();
    const timetableModal = page.locator('#timetableModal');
    await expect(timetableModal).toHaveClass(/modal-open/);
    
    // Fill Add New Lecture Schedule
    await page.getByPlaceholder('Day').fill('Wednesday');
    await page.getByPlaceholder('Time').fill('10:00 AM - 12:00 PM');
    await page.getByPlaceholder('Course Code').fill('MKT 409');
    await page.getByPlaceholder('Course Title').fill('Digital Marketing Analytics');
    await page.getByPlaceholder('Venue').fill('Hall B, Main Campus');
    
    // Fill Lecturer in Charge (not explicitly in prompt but present in UI)
    await page.getByPlaceholder('Lecturer in Charge').fill('Dr. John Doe');
    
    await page.getByRole('button', { name: '+ Add', exact: true }).click();
    
    // Assert modal appended new entry (we expect this to fail initially)
    const newEntry = page.locator('#timetableModal tbody').locator('text=MKT 409');
    await expect(newEntry).toBeVisible({ timeout: 2000 });
    
    // Close modal via Escape
    await page.keyboard.press('Escape');
    await expect(timetableModal).not.toHaveClass(/modal-open/);

    // Expand the Result accordion first
    await page.locator('#modResult .acc-header').click();
    await page.waitForTimeout(300); // Wait for accordion animation
    await page.locator('#modResult .btn-full-detail').click();
    const broadsheetModal = page.locator('#resultModal');
    await expect(broadsheetModal).toHaveClass(/modal-open/);
    await page.keyboard.press('Escape'); // close broadsheet
    await expect(broadsheetModal).not.toHaveClass(/modal-open/);
    
    // Open Class Roster
    await page.locator('#modRoster .acc-header').click();
    await page.waitForTimeout(300);
    await page.locator('#modRoster .btn-full-detail').click();
    const rosterModal = page.locator('#rosterModal');
    await expect(rosterModal).toHaveClass(/modal-open/);

    // No search needed, just click the first available student
    
    // Test opening student's record
    await page.locator('.neu-student-card .neu-card-name').first().click();
    const studentDetailModal = page.locator('#studentDetailModal');
    await expect(studentDetailModal).toHaveClass(/modal-open/);
    
    // Verify Track visible in detailed inspection
    const trackField = studentDetailModal.locator('text=Track:');
    await expect(trackField).toBeVisible();
    
    await page.keyboard.press('Escape'); // close profile
    await expect(studentDetailModal).not.toHaveClass(/modal-open/);
    await page.keyboard.press('Escape'); // close roster modal
    await expect(rosterModal).not.toHaveClass(/modal-open/);
    await expect(rosterModal).not.toHaveClass(/modal-open/);

    // Phase 5: Attendance / Textbook & Fees Manager
    // Expand the Fee accordion first
    await page.locator('#modFee .acc-header').click();
    await page.waitForTimeout(300); // Wait for accordion animation
    
    // The "Full Detail" amber button
    await page.locator('#modFee .btn-full-detail.amber-btn', { hasText: 'Full Detail' }).click();
    const duesModal = page.locator('#feeModal');
    await expect(duesModal).toHaveClass(/modal-open/);
    
    // Generate Fee Roster first
    await page.locator('button', { hasText: 'Generate Fee Roster' }).click();
    await page.waitForTimeout(300); // Wait for transition
    
    // Check initial status
    const firstRow = page.locator('#feeBody tr').first();
    const statusBadge = firstRow.locator('.badge');
    const initialStatus = await statusBadge.innerText();
    
    if (initialStatus !== 'PAID') {
        // Setup dialog handler for the confirm() box
        page.once('dialog', dialog => dialog.accept());
        
        // Click Mark Paid
        await firstRow.locator('button', { hasText: 'Mark Paid' }).click();
        
        // Wait for re-render
        await page.waitForTimeout(300);
        
        // Check new status
        const newStatus = await page.locator('#feeBody tr').first().locator('.badge').innerText();
        expect(initialStatus).not.toEqual(newStatus);
        expect(newStatus).toEqual('PAID');
    }
    
    await page.keyboard.press('Escape'); // close dues
    await expect(duesModal).not.toHaveClass(/modal-open/);
    
    // Phase 6: Notifications Drawer & Quick Action Redirection
    await page.locator('.nav-bell').click();
    const notifDropdown = page.locator('#notifPanel');
    await expect(notifDropdown).toHaveClass(/notif-open/);
    
    // Click on actionable notification BEFORE marking all read
    await notifDropdown.locator('.notif-item', { hasText: /broadsheet/i }).first().click();
    const petitionModal = page.locator('#resultModal'); // broadsheet notification routes to resultModal
    await expect(petitionModal).toHaveClass(/modal-open/);
    
    await page.keyboard.press('Escape'); // close modal
    await expect(petitionModal).not.toHaveClass(/modal-open/);
    
    // Re-open notifications to mark all read
    await page.locator('.nav-bell').click();
    await expect(notifDropdown).toHaveClass(/notif-open/);
    await page.locator('.notif-mark-all').click();
    
    // Final check for errors
    expect(unhandledExceptions.length, `Test finished with ${unhandledExceptions.length} uncaught exceptions`).toBe(0);
  });

});
