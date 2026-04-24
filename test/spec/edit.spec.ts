import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-single-choice-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID, { isGradable: true });
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders 4 answer inputs and 4 radios', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.answerInputs).toHaveCount(4);
    await expect(edit.radios).toHaveCount(4);
    await expect(edit.addAnswerBtn).toBeVisible();
  });
});

test.describe('Answer management', () => {
  test('Adds a new answer', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addAnswerBtn.click();
    await expect(edit.answerInputs).toHaveCount(5);
  });

  test('Persists filled answers and selected correct', async ({ page }) => {
    const edit = new Edit(page);
    await edit.answerInputs.nth(0).fill('Paris');
    await edit.answerInputs.nth(1).fill('Berlin');
    await edit.answerInputs.nth(2).fill('Madrid');
    await edit.answerInputs.nth(3).fill('Rome');
    await edit.radios.nth(0).click();
    await edit.form.saveBtn.click();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(edit.answerInputs.nth(0)).toHaveValue('Paris');
    await expect(edit.radios.nth(0)).toBeChecked();
  });

  test('Removes an answer when more than 2 exist', async ({ page }) => {
    const edit = new Edit(page);
    await edit.removeAnswerBtn(3).click();
    await expect(edit.answerInputs).toHaveCount(3);
  });
});

test.describe('Non-gradable mode', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      isGradable: false,
      answers: ['', '', '', ''],
      embeds: {},
      question: [],
      hint: '',
      feedback: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Shows "Options" label and hides radios', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.root.getByText('Options')).toBeVisible();
    await expect(edit.radios).toHaveCount(0);
  });
});

test.describe('Readonly mode', () => {
  test('Hides add/remove controls', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.addAnswerBtn).not.toBeVisible();
  });
});
