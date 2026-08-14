import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

test.describe.serial('CSV upload -> train -> predict happy path', () => {
  let dashboard: DashboardPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    dashboard = new DashboardPage(page);
    await dashboard.init();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('upload sample-data/network_traffic.csv via the file input', async () => {
    const samplePath = path.resolve(__dirname, '../sample-data/network_traffic.csv');
    const fixturePath = path.resolve(__dirname, 'fixtures/network_traffic.csv');
    const filePath = fs.existsSync(samplePath) ? samplePath : fixturePath;

    await dashboard.uploadCsv(filePath);
  });

  test('select a target column and start training', async () => {
    await dashboard.selectTargetColumnAndTrain('is_encrypted');
  });

  test('wait for WebSocket leaderboard_update event (with reasonable timeout)', async () => {
    await dashboard.waitForLeaderboardUpdate(60_000);
  });

  test('assert champion model card is visible with a non-null accuracy score', async () => {
    await dashboard.assertChampionModelCard();
  });

  test('assert batch-predict CSV download link is active and returns a valid CSV', async () => {
    const { downloadPath } = await dashboard.runBatchPredictAndDownload();
    expect(downloadPath).toBeTruthy();
    expect(fs.existsSync(downloadPath)).toBe(true);

    const raw = fs.readFileSync(downloadPath, 'utf-8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.meta.fields?.length).toBeGreaterThan(0);
    expect(parsed.data.length).toBeGreaterThan(0);
  });
});
