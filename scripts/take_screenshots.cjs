const { chromium } = require('playwright');

(async () => {
    console.log('Starting browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });

    await context.addInitScript(() => {
        class MockSpeechRecognition {
            constructor() {
                this.continuous = false;
                this.interimResults = true;
                this.lang = 'id-ID';
            }
            start() {
                setTimeout(() => {
                    if (this.onresult) this.onresult({ results: [[{ transcript: window.__mockTranscript || 'Siti 85' }]] });
                }, 500);
                setTimeout(() => {
                    if (this.onend) this.onend();
                }, 600);
            }
            stop() { if (this.onend) this.onend(); }
            abort() { }
        }
        window.SpeechRecognition = window.webkitSpeechRecognition = MockSpeechRecognition;
    });

    const page = await context.newPage();
    const baseUrl = 'http://localhost:5174';

    try {
        await page.goto(baseUrl);
        await page.waitForTimeout(1000);
        page.on('dialog', dialog => dialog.accept());

        await page.screenshot({ path: 'docs/tutorial/assets/1-pengaturan-awal.png' });

        await page.click('.landing-nav-right .btn-secondary');
        await page.waitForTimeout(1000);

        for (const btn of await page.$$('.class-card button:has-text("Hapus"), .class-card button:has-text("Delete")')) {
            await btn.click();
            await page.waitForTimeout(500);
        }

        console.log('Taking backup screenshot...');
        await page.click('.backup-menu-container > button').catch(() => { });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'docs/tutorial/assets/7-backup-restore.png' });
        await page.keyboard.press('Escape');

        // Modal create class
        console.log('Clicking create class...');
        await page.evaluate(() => {
            const btn = document.querySelector('.page-header .btn-primary');
            if (btn) btn.click();
        });
        await page.waitForTimeout(500);
        await page.fill('.modal input', '10 IPA 1');
        await page.screenshot({ path: 'docs/tutorial/assets/2-membuat-kelas.png' });
        await page.click('.modal .btn-primary');
        await page.waitForTimeout(1000);

        // Enter Setup
        const aturBtns = await page.$$('.class-card button');
        if (aturBtns.length > 0) await aturBtns[0].click();
        await page.waitForTimeout(1000);

        // 3a - Student
        await page.fill('input[placeholder*="nama siswa"]', 'Budi Santoso');
        await page.keyboard.press('Enter');
        await page.fill('input[placeholder*="nama siswa"]', 'Budi Setiawan');
        await page.keyboard.press('Enter');
        await page.fill('input[placeholder*="nama siswa"]', 'Siti Aminah');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'docs/tutorial/assets/3a-setup-siswa.png' });

        // 3b - Subject
        await page.fill('input[placeholder*="mata pelajaran"]', 'Matematika');
        await page.keyboard.press('Enter');
        await page.fill('input[placeholder*="mata pelajaran"]', 'Fisika');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'docs/tutorial/assets/3b-setup-mapel.png' });

        // Go to session directly from Setup Header
        console.log('Entering session...');
        await page.evaluate(() => {
            const btn = document.querySelector('.setup-page .page-header .btn-primary');
            if (btn) btn.click();
        });
        await page.waitForTimeout(1000);

        console.log('Clicking modal start...');
        await page.evaluate(() => {
            const btn = document.querySelector('.modal-footer .btn-primary');
            if (btn) btn.click();
        });
        console.log('Clicked modal start, waiting...');
        await page.waitForTimeout(2000);

        // Session Page Actions
        console.log('Waiting for mic btn...');
        await page.waitForSelector('.mic-btn', { timeout: 3000 });
        console.log('Found mic btn!');

        // Mock 1 - Success (creates log entry)
        console.log('Mock 1 - Siti 85');
        await page.evaluate(() => { window.__mockTranscript = 'Siti 85'; });
        await page.click('.mic-btn');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'docs/tutorial/assets/4b-sesi-log.png' });

        // Mock 2 - Ambiguous 
        console.log('Mock 2 - Budi 80');
        await page.evaluate(() => { window.__mockTranscript = 'Budi 80'; });
        await page.click('.mic-btn');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'docs/tutorial/assets/4a-ambigu-modal.png' });

        // Navigate to Review via Session Header
        console.log('Navigating to Review via Header...');
        await page.evaluate(() => {
            const btn = document.querySelector('.session-header .btn-primary');
            if (btn) btn.click();
        });
        await page.waitForTimeout(2000);

        // Review Page Actions
        await page.waitForSelector('.export-bar', { timeout: 3000 }).catch(() => { });
        await page.screenshot({ path: 'docs/tutorial/assets/5-review-table.png' });

        await page.click('.export-bar button').catch(() => { });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'docs/tutorial/assets/6-export-data.png' });

    } catch (err) {
        console.error('Error during screenshot capture', err);
        const html = await page.content().catch(() => '');
        console.log('HTML CONTENT ON ERROR:', html.slice(-500));
        await page.screenshot({ path: 'docs/tutorial/assets/error-debug.png' }).catch(() => { });
    } finally {
        await browser.close();
        console.log('Done!');
    }
})();
