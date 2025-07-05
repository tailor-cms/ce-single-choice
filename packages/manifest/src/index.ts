import { OpenAISchema } from '@tailor-cms/cek-common';
import { times } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'SINGLE_CHOICE';

// Display name (e.g. shown to the author)
export const name = 'Single Choice';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (): ElementData => ({
  embeds: {},
  question: [],
  correct: null,
  answers: ['', ''],
  hint: '',
  feedback: {},
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-order-bool-ascending',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const ai = {
  Schema: {
    type: 'json_schema',
    name: 'ce_tiptap_html',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        answers: { type: 'array', items: { type: 'string' } },
        correct: { type: 'number' },
        feedback: {
          type: 'object',
          // OpenAI does not support pattern properties
          properties: times(4).reduce(
            (acc, it) => ({ ...acc, [it]: { type: 'string' } }),
            {},
          ),
          required: times(4, String),
          additionalProperties: false,
        },
        hint: { type: 'string' },
      },
      required: ['question', 'answers', 'correct', 'feedback', 'hint'],
      additionalProperties: false,
    },
  } as OpenAISchema,
  getPrompt: () => `
    Generate single choice question as an object with the following properties:
    {
      "question": "",
      "correct": 0,
      "answers": [],
      "hint": "",
      "feedback": {}
    }
    where:
      - 'question' is the question prompt
      - 'answers' is an array of possible answers. Define 4 possible answers.
      - 'correct' is an index of the correct answer.
      - 'hint' is an optional hint for the correct solution.
      - 'feedback' is an object with feedback for each answer, using indexes as
        keys. Feedback is optional and should provide more information
        about the answers.
  `,
  processResponse: ({
    correct,
    answers,
    hint,
    feedback,
    question,
  }: any = {}) => {
    const id = uuid();
    return {
      isGradable: true,
      question: [id],
      correct,
      answers,
      hint,
      feedback,
      embeds: {
        [id]: {
          id,
          data: { content: question },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        },
      },
    };
  },
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  isComposite: true,
  isQuestion: true,
  ssr: false,
  initState,
  ui,
  ai,
};

export default manifest;
export * from './interfaces';
