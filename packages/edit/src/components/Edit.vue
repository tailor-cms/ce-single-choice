<template>
  <div class="tce-single-choice mb-6">
    <VInput
      v-slot="{ isValid }"
      :rules="[validation.correct]"
      :validation-value="elementData"
      hide-details
    >
      <div class="w-100">
        <div class="text-label-large mb-3">{{ title }}</div>
        <div class="mx-2">
          <VSlideYTransition group>
            <VTextField
              v-for="(answer, index) in elementData.answers"
              :key="index"
              :model-value="answer"
              :placeholder="placeholder"
              :readonly="isReadonly"
              :rules="[validation.answer]"
              class="answer-input my-2 w-100"
              density="comfortable"
              variant="outlined"
              hide-details
              @update:model-value="updateAnswer(index, $event)"
            >
              <template #prepend>
                <VRadio
                  v-if="isGradable"
                  :error="isValid.value === false"
                  :model-value="elementData.correct === index"
                  :readonly="isReadonly"
                  class="flex-0-0 mr-1"
                  color="secondary"
                  density="compact"
                  hide-details
                  @click="selectCorrect(index)"
                  @mousedown.stop
                />
                <VAvatar
                  v-else
                  :text="String(index + 1)"
                  class="text-label-medium font-weight-semibold"
                  color="surface-container-highest"
                  rounded="circle"
                  size="small"
                />
              </template>
              <template v-if="!isReadonly" #append>
                <VBtn
                  :disabled="answers.length <= 2"
                  aria-label="Remove answer"
                  density="comfortable"
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="removeAnswer(index)"
                />
              </template>
            </VTextField>
          </VSlideYTransition>
        </div>
      </div>
    </VInput>
    <VInput
      :rules="[validation.correct, validation.answersFilled]"
      :validation-value="elementData"
      hide-details="auto"
      max-errors="2"
    />
    <div v-if="!isReadonly" class="d-flex justify-center mt-2">
      <VBtn
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
  answer: (val: string) => !!val,
  correct: ({ correct }: ElementData) =>
    !isGradable.value ||
    isNumber(correct) ||
    'Please choose the correct answer',
  answersFilled: ({ answers }: ElementData) =>
    answers.every((it) => !!it) ||
    `All ${isGradable.value ? 'answers' : 'options'} are required`,
}));

const selectCorrect = (index: number) => {
  if (props.isReadonly) return;
  emit('update', { correct: index });
};

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
