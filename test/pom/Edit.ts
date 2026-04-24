import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly form: pom.EditQuestionForm;
  readonly root: Locator;
  readonly answerInputs: Locator;
  readonly radios: Locator;
  readonly addAnswerBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.form = new pom.EditQuestionForm(this.el);
    this.root = this.form.el.locator('.tce-single-choice');
    this.answerInputs = this.root.locator('.answer-input').getByRole('textbox');
    this.radios = this.root.getByRole('radio');
    this.addAnswerBtn = this.root.getByRole('button', { name: 'Add answer' });
  }

  removeAnswerBtn(index: number): Locator {
    return this.root.getByRole('button', { name: 'Remove answer' }).nth(index);
  }
}
