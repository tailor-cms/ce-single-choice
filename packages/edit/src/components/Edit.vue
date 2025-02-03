<template>
  <QuestionContainer
    v-bind="{
      elementData,
      embedElementConfig,
      isDisabled,
    }"
    show-feedback
    @update="emit('update', $event)"
  >
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="validation.correct"
    >
      <div class="text-subtitle-2 mb-2">{{ title }}</div>
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :rules="validation.answer"
          class="my-2 w-100"
          variant="outlined"
          @update:model-value="updateAnswer(index, $event)"
        >
          <template #prepend>
            <VRadio
              v-if="isGradable"
              :error="isValid.value === false"
              :model-value="elementData.correct === index"
              :readonly="isDisabled"
              color="primary"
              hide-details
              @click="elementData.correct = index"
            />
            <VAvatar
              v-else
              class="font-weight-bold ma-1"
              color="primary-darken-3"
              size="small"
            >
              {{ index + 1 }}
            </VAvatar>
          </template>
          <template v-if="!isDisabled && answers.length > 2" #append>
            <VBtn
              aria-label="Remove answer"
              color="primary-darken-4"
              size="x-small"
              variant="text"
              icon
              @click="removeAnswer(index)"
            >
              <VIcon icon="mdi-close" size="large" />
            </VBtn>
          </template>
        </VTextField>
      </VSlideYTransition>
    </VInput>
    <div class="d-flex justify-end mb-4">
      <VBtn
        v-if="!isDisabled"
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        {{ btnLabel }}
      </VBtn>
    </div>
  </QuestionContainer>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { Element } from '@tailor-cms/ce-single-choice-manifest';
import isNumber from 'lodash/isNumber';
import { QuestionContainer } from '@tailor-cms/core-components';
import range from 'lodash/range';
import set from 'lodash/set';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isFocused: boolean;
  isDisabled: boolean;
}>();
const emit = defineEmits(['save', 'update']);

const elementData = computed(() => props.element.data);
const isGradable = computed(() => elementData.value.isGradable);
const answers = computed(() => elementData.value.answers);

const title = computed(() =>
  isGradable.value ? 'Select correct answer' : 'Options',
);

const placeholder = computed(() =>
  isGradable.value ? 'Answer...' : 'Option...',
);

const btnLabel = computed(() =>
  isGradable.value ? 'Add answer' : 'Add option',
);

const validation = computed(() => ({
  answer: [(val: string) => !!val || 'Answer is required'],
  correct: isGradable.value
    ? [(val?: number) => isNumber(val) || 'Please choose the correct answer']
    : [],
}));

const addAnswer = () => emit('update', { answers: [...answers.value, ''] });
const removeAnswer = (index: number) => {
  let { answers, correct, feedback } = cloneDeep(elementData.value);
  answers.splice(index, 1);

  if (isGradable.value) {
    if (correct === index) correct = null;
    if (correct && correct >= index) correct--;
  }

  if (feedback) {
    range(index, answers.length).forEach((it) => {
      feedback[it] = feedback[it + 1];
    });
    delete feedback[answers.length];
  }

  emit('update', { answers, correct, feedback });
};

const updateAnswer = (index: number, value: string) => {
  emit('update', { answers: set(cloneDeep(answers.value), index, value) });
};
</script>
