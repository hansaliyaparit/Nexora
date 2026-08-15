import { Page, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class DashboardPage {
  constructor(public readonly page: Page) {}

  async init() {
    // Registered before page load so no WS event is missed, however early it fires
    await this.page.addInitScript(() => {
      (window as any).__wsEvents = [];
    });
  }

  async uploadCsv(filePath: string) {
    // Always navigate fresh – ensures lazy chunks + Firebase init settle
    await this.page.goto('/', { waitUntil: 'networkidle', timeout: 60_000 });

    // The upload zone is near the bottom of the landing page; scroll to it
    const uploadSection = this.page.locator('#upload');
    if (await uploadSection.count() > 0) {
      await uploadSection.scrollIntoViewIfNeeded();
    }

    const fileInput = this.page.locator('[data-testid="file-input"], input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 45_000 });
    await fileInput.setInputFiles(filePath);
    await this.waitForDatasetReady();
  }

  async waitForDatasetReady() {
    await this.page.waitForURL(/\/dataset\//, { timeout: 45_000 });
    await this.page
      .locator('[data-testid="workflow-tab-configure"]')
      .waitFor({ state: 'visible', timeout: 45_000 });
  }

  async openConfigureTab() {
    const configureTab = this.page.locator('[data-testid="workflow-tab-configure"]');
    await configureTab.waitFor({ state: 'visible', timeout: 30_000 });
    await expect(configureTab).toBeEnabled({ timeout: 30_000 });

    if ((await configureTab.getAttribute('aria-selected')) !== 'true') {
      await configureTab.click();
    }

    await this.page
      .locator('[data-testid="target-column-select"]')
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  async selectTargetColumnAndTrain(columnName: string) {
    await this.waitForDatasetReady();
    await this.openConfigureTab();

    const select = this.page.locator('[data-testid="target-column-select"]');
    await select.locator(`option[value="${columnName}"]`).waitFor({ state: 'attached', timeout: 30_000 });
    await select.selectOption(columnName);

    const confirmBtn = this.page.locator('[data-testid="start-training-btn"]');
    await expect(confirmBtn).toBeEnabled({ timeout: 10_000 });
    const configureResponse = this.page.waitForResponse(
      (resp) => resp.url().includes('/configure') && resp.status() === 200,
      { timeout: 60_000 },
    );
    await confirmBtn.click();
    await configureResponse;

    const arenaTab = this.page.locator('[data-testid="workflow-tab-arena"]');
    await expect(arenaTab).toBeEnabled({ timeout: 30_000 });
    await arenaTab.click();

    const startBenchBtn = this.page.locator('[data-testid="start-benchmark-btn"]');
    await startBenchBtn.waitFor({ state: 'visible', timeout: 30_000 });
    await startBenchBtn.click();
  }

  async waitForLeaderboardUpdate(timeout = 90_000) {
    await this.page.waitForFunction(
      () => {
        const events = (window as any).__wsEvents;
        return Array.isArray(events) && events.some((e: string) => e === 'leaderboard_update' || e === 'model_completed' || e === 'training_complete' || e === 'snapshot');
      },
      { timeout }
    );
  }

  async assertChampionModelCard() {
    const card = this.page.locator('[data-testid="champion-model-card"]');
    await expect(card).toBeVisible({ timeout: 90_000 });

    const accuracyText = await card.locator('[data-testid="champion-accuracy"]').textContent();
    expect(accuracyText).not.toBeNull();
    expect(accuracyText?.trim()).not.toBe('');
    expect(accuracyText).toMatch(/\d/);
  }

  async runBatchPredictAndDownload() {
    // Navigate to Prediction tab
    const predictionTab = this.page.locator('[data-testid="workflow-tab-studio"], button:has-text("Predict"), button:has-text("Prediction Studio")').first();
    await predictionTab.waitFor({ state: 'visible', timeout: 30_000 });
    await predictionTab.click();

    // Check if models need training in Prediction Studio or if batch input is already available
    const trainBtn = this.page.locator('[data-testid="train-selected-models-btn"], button:has-text("Train")').first();
    const batchInput = this.page.locator('[data-testid="batch-file-input"]').first();

    await Promise.race([
      trainBtn.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null),
      batchInput.waitFor({ state: 'attached', timeout: 30_000 }).catch(() => null),
    ]);

    if (await trainBtn.isVisible().catch(() => false)) {
      await trainBtn.click();
      // Wait for models to finish training and batch input to appear in DOM
      await batchInput.waitFor({ state: 'attached', timeout: 60_000 });
    }

    // Input batch CSV file into batch prediction input
    const fixturePath = path.resolve(__dirname, '../fixtures/network_traffic.csv');
    const samplePath = path.resolve(__dirname, '../../sample-data/network_traffic.csv');
    const batchFile = fs.existsSync(samplePath) ? samplePath : fixturePath;

    await batchInput.waitFor({ state: 'attached', timeout: 30_000 });
    await batchInput.setInputFiles(batchFile);

    // Click Run Batch
    const runBatchBtn = this.page.locator('[data-testid="run-batch-btn"], button:has-text("Run Batch")').first();
    await runBatchBtn.waitFor({ state: 'visible', timeout: 30_000 });
    await runBatchBtn.click();

    // Batch prediction download link
    const downloadLink = this.page.locator('[data-testid="batch-predict-download"]').first();
    await expect(downloadLink).toBeVisible({ timeout: 60_000 });

    const downloadPromise = this.page.waitForEvent('download', { timeout: 60_000 });
    await downloadLink.click();
    const download = await downloadPromise;

    const downloadDir = path.resolve(__dirname, '../downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    const downloadPath = path.join(downloadDir, download.suggestedFilename());
    await download.saveAs(downloadPath);
    return { downloadPath };
  }
}
