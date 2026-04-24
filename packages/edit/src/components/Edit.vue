<template>
  <div class="tce-single-choice">
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="validation.correct"
    >
      <div class="text-title-small mb-2">{{ title }}</div>
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isReadonly"
          :rules="validation.answer"
          class="answer-input my-2 w-100"
          variant="outlined"
          @update:model-value="updateAnswer(index, $event)"
        >
          <template #prepend>
            <VRadio
              v-if="isGradable"
              :error="isValid.value === false"
              :model-value="elementData.correct === index"
              :readonly="isReadonly"
              color="primary"
              hide-details
              @click="selectCorrect(index)"
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
          <template v-if="!isReadonly && answers.length > 2" #append>
            <VBtn
              aria-label="Remove answer"
              color="primary-darken-4"
              icon="mdi-close"
              size="x-small"
              variant="text"
              @click="removeAnswer(index)"
            />
          </template>
        </VTextField>
      </VSlideYTransition>
    </VInput>
    <div class="d-flex justify-end mb-4">
      <VBtn
        v-if="!isReadonly"
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        text="Add answer"
        variant="text"
        @click="addAnswer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, isNumber, range, set } from 'lodash-es';
import type {
  Element,
  ElementData,
} from '@tailor-cms/ce-single-choice-manifest';
import { computed } from 'vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  update: [data: Partial<ElementData>];
}>();

const elementData = computed(() => props.element.data);
const isGradable = computed(() => elementData.value.isGradable);
const answers = computed(() => elementData.value.answers);

const title = computed(() =>
  isGradable.value ? 'Select correct answer' : 'Options',
);

const placeholder = computed(() =>
  isGradable.value ? 'Answer...' : 'Option...',
);

const validation = computed(() => ({
  answer: [(val: string) => !!val || 'Answer is required'],
  correct: isGradable.value
    ? [(val?: number) => isNumber(val) || 'Please choose the correct answer']
    : [],
}));

const selectCorrect = (index: number) => emit('update', { correct: index });

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

<style lang="scss" scoped>
.tce-single-choice {
  text-align: left;
}
</style>
