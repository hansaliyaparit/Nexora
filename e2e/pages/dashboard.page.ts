import { Page, expect } from '@playwright/test';
import path from 'path';

export class DashboardPage {
  constructor(public readonly page: Page) {}

  async init() {
    // Registered before page load so no WS event is missed, however early it fires
    await this.page.addInitScript(() => {
      (window as any).__wsEvents = [];
    });
  }

  async uploadCsv(filePath: string) {
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(filePath);
    await this.page.waitForURL(/\/dataset\//, { timeout: 30_000 });
  }

  async selectTargetColumnAndTrain(columnName: string) {
    const select = this.page.locator('[data-testid="target-column-select"], select').first();
    await select.waitFor({ state: 'visible', timeout: 15_000 });
    await select.selectOption(columnName);

    const confirmBtn = this.page.locator('[data-testid="start-training-btn"], button:has-text("Confirm Target")').first();
    await confirmBtn.click();

    // Click Launch Full Benchmark on TrainingArena
    const startBenchBtn = this.page.locator('[data-testid="start-benchmark-btn"], button:has-text("Launch Full Benchmark")').first();
    await startBenchBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await startBenchBtn.click();
  }

  async waitForLeaderboardUpdate(timeout = 60_000) {
    await this.page.waitForFunction(
      () => {
        const events = (window as any).__wsEvents;
        return Array.isArray(events) && events.some((e: string) => e === 'leaderboard_update' || e === 'model_completed');
      },
      { timeout }
    );
  }

  async assertChampionModelCard() {
    const card = this.page.locator('[data-testid="champion-model-card"]');
    await expect(card).toBeVisible({ timeout: 60_000 });

    const accuracyText = await card.locator('[data-testid="champion-accuracy"]').textContent();
    expect(accuracyText).not.toBeNull();
    expect(accuracyText?.trim()).not.toBe('');
    expect(accuracyText).toMatch(/\d/);
  }

  async runBatchPredictAndDownload() {
    // Navigate to Prediction tab if tabs exist
    const predictionTab = this.page.locator('button:has-text("Prediction Studio"), button:has-text("Predictions")').first();
    if (await predictionTab.isVisible()) {
      await predictionTab.click();
    }

    // Check if models need training in Prediction Studio
    const trainSelectedBtn = this.page.locator('button:has-text("Train 2 Selected Models"), button:has-text("Train 1 Selected Model"), button:has-text("Train Selected Models")').first();
    if (await trainSelectedBtn.isVisible()) {
      await trainSelectedBtn.click();
      await this.page.waitForTimeout(3000);
    }

    // Input batch CSV file into batch prediction input
    const fixturePath = path.join(__dirname, '../fixtures/network_traffic.csv');
    const batchInput = this.page.locator('[data-testid="batch-file-input"], input[type="file"]').last();
    await batchInput.setInputFiles(fixturePath);

    // Click Run Batch
    const runBatchBtn = this.page.locator('[data-testid="run-batch-btn"], button:has-text("Run Batch")').first();
    await runBatchBtn.click();

    // Batch prediction download link
    const downloadLink = this.page.locator('[data-testid="batch-predict-download"]').first();
    await expect(downloadLink).toBeVisible({ timeout: 30_000 });

    const downloadPromise = this.page.waitForEvent('download');
    await downloadLink.click();
    const download = await downloadPromise;

    const downloadDir = path.join(__dirname, '../downloads');
    const downloadPath = path.join(downloadDir, download.suggestedFilename());
    await download.saveAs(downloadPath);
    return { downloadPath };
  }
}
