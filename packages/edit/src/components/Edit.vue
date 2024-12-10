<template>
  <QuestionContainer
    v-bind="{
      allowedEmbedTypes,
      elementData,
      isDirty,
      isDisabled,
      isGradeable,
    }"
    show-feedback
    @cancel="updateData(element.data)"
    @save="save"
    @update="updateData($event)"
  >
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="validation.correct"
    >
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
          @update:model-value="updateAnswer($event, index)"
        >
          <template #prepend>
            <VRadio
              v-if="isGradeable"
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
          <template v-if="!isDisabled && answersCount > 2" #append>
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
import { computed, defineEmits, defineProps, reactive, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-single-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import { QuestionContainer } from '@tailor-cms/core-components';

const emit = defineEmits(['save']);
const props = defineProps<{
  allowedEmbedTypes: string[];
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGradeable: boolean;
}>();

const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => !isEqual(elementData, props.element.data));

const title = computed(() =>
  props.isGradeable ? 'Select correct answer' : 'Options',
);

const placeholder = computed(() =>
  props.isGradeable ? 'Answer...' : 'Option...',
);

const btnLabel = computed(() =>
  props.isGradeable ? 'Add answer' : 'Add option',
);

const validation = computed(() => ({
  answer: [(val: string) => !!val || 'Answer is required'],
  correct: props.isGradeable
    ? [(val?: number) => isNumber(val) || 'Please choose the correct answer']
    : [],
}));

const addAnswer = () => elementData.answers.push('');
const removeAnswer = (index: number) => {
  elementData.answers.splice(index, 1);

  if (props.isGradeable) {
    if (elementData.correct === index) elementData.correct = null;
    if (elementData.correct && elementData.correct >= index)
      elementData.correct--;
  }
};

const updateAnswer = (value: string, index: number) =>
  (elementData.answers[index] = value);

const save = () => {
  emit('save', elementData);
};
const updateData = (data: ElementData) => {
  Object.assign(elementData, cloneDeep(data));
};

watch(() => props.element.data, updateData);
</script>
