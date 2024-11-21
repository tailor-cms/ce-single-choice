import type { HookServices, ServerRuntime } from '@tailor-cms/cek-common';
import { initState, type } from '@tailor-cms/ce-single-choice-manifest';
import type { Element } from '@tailor-cms/ce-single-choice-manifest';
import omit from 'lodash/omit.js';

// Detect if hooks are running in CEK (used for mocking end-system runtime)
const IS_CEK = process.env.CEK_RUNTIME;
// Don't use in production, use only when IS_CEK=true
const USER_STATE: any = {};

/* eslint-disable @typescript-eslint/no-unused-vars */
export function beforeSave(element: Element, services: HookServices) {
  return element;
}

export function afterSave(element: Element, services: HookServices) {
  return element;
}

export function afterLoaded(
  element: Element,
  services: HookServices,
  runtime: ServerRuntime,
) {
  if (runtime === 'delivery') {
    const data = omit(element.data, ['correct']);
    return Object.assign(element, { data });
  }
  return element;
}

export function afterRetrieve(
  element: Element,
  services: HookServices,
  runtime: ServerRuntime,
) {
  return element;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function beforeDisplay(element: Element, context: any) {
  return { ...context, ...USER_STATE, correct: element.data.correct };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onUserInteraction(
  element: Element,
  context: any,
  payload: any,
): any {
  const isCorrect = element.data.correct === payload.response;
  // Simulate user state update within CEK
  if (IS_CEK) {
    // Can be reset to initial / mocked state via UI
    Object.assign(context, { response: payload.response, isCorrect });
  }
  // Can have arbitrary return value (interpreted by target system)
  // FE is updated if updateDisplayState is true
  return { updateDisplayState: true };
}

export const hookMap = new Map(
  Object.entries({
    beforeSave,
    afterSave,
    afterLoaded,
    afterRetrieve,
    onUserInteraction,
    beforeDisplay,
  }),
);

export default {
  type,
  hookMap,
  initState,
  beforeSave,
  afterSave,
  afterLoaded,
  afterRetrieve,
  onUserInteraction,
  beforeDisplay,
  mocks,
};

export { type, initState };
