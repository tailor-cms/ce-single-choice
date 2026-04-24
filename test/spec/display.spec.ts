import { expect, test } from '@playwright/test';
import { elementClient, pom } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-single-choice-display';

const SEED = {
  isGradable: true,
  answers: ['Paris', 'Berlin', 'Madrid', 'Rome'],
  correct: 0,
  embeds: {
    prompt: {
      id: 'prompt',
      type: 'TIPTAP_HTML',
      position: 1,
      embedded: true,
      data: { content: 'Capital of France?' },
    },
  },
  question: ['prompt'],
  hint: '',
  feedback: {},
};

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when no answers are set', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
  });
});

test.describe('With answers set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, SEED);
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders all answer cards', async ({ page }) => {
    const display = new Display(page);
    await expect(display.cards).toHaveCount(4);
    await expect(display.cardAt(0)).toContainText('Paris');
    await expect(display.cardAt(1)).toContainText('Berlin');
  });

  test('Selecting and submitting locks the selection', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(1).click();
    await expect(display.cardAt(1)).toHaveClass(/selected/);
    await form.submit();
    await expect(display.cardAt(1)).toHaveClass(/readonly/);
  });

  test('Submitting the correct answer shows a success icon', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await form.submit();
    await expect(display.cardAt(0).locator('.mdi-check-circle')).toBeVisible();
  });

  test('Submitting a wrong answer shows an error icon', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(2).click();
    await form.submit();
    await expect(display.cardAt(2).locator('.mdi-close-circle')).toBeVisible();
  });

  test('Submitting correct answer marks feedback as success', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await form.submit();
    await expect(form.feedback).toHaveClass(/success/);
  });

  test('Submitting wrong answer marks feedback as error', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(2).click();
    await form.submit();
    await expect(form.feedback).toHaveClass(/error/);
  });
});

test.describe('Non-gradable mode', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      ...SEED,
      isGradable: false,
      correct: undefined,
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Feedback is not flagged as success or error', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.cardAt(0).click();
    await form.submit();
    await expect(form.feedback).not.toHaveClass(/success/);
    await expect(form.feedback).not.toHaveClass(/error/);
  });
});
