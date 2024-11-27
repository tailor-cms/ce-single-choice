<template>
  <QuestionContainer
    v-bind="{ elementData, isDirty, isDisabled, isGraded, name, icon }"
    show-feedback
    @cancel="updateData(element.data)"
    @save="save"
    @update="updateData($event)"
  >
    <div class="text-left text-subtitle-2 mb-2">{{ title }}</div>
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="[isGraded && requiredRule].filter(Boolean)"
    >
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :rules="[requiredRule]"
          class="my-2 w-100"
          variant="outlined"
          @update:model-value="updateAnswer($event, index)"
        >
          <template #prepend>
            <VRadio
              v-if="isGraded"
              :error="!isValid.value"
              :readonly="isDisabled"
              :value="index"
              color="primary"
              hide-details
              @click="elementData.correct = index"
            />
            <VAvatar v-else color="primary-darken-3" variant="tonal">
              {{ index + 1 }}
            </VAvatar>
          </template>
          <template v-if="!isDisabled && answersCount > 2" #append>
            <VBtn
              aria-label="Remove answer"
              color="primary-darken-4"
              density="comfortable"
              icon="mdi-close"
              variant="text"
              @click="removeAnswer(index)"
            />
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
import manifest, {
  Element,
  ElementData,
} from '@tailor-cms/ce-single-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import { QuestionContainer } from '@tailor-cms/core-components';

const {
  name,
  ui: { icon },
} = manifest;

const emit = defineEmits(['save']);
const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGraded: boolean;
}>();

const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => !isEqual(elementData, props.element.data));

const title = computed(() =>
  props.isGraded ? 'Select correct answer' : 'Options',
);

const placeholder = computed(() =>
  props.isGraded ? 'Answer...' : 'Option...',
);

const btnLabel = computed(() => (props.isGraded ? 'Add answer' : 'Add option'));

const addAnswer = () => elementData.answers.push('');
const removeAnswer = (index: number) => {
  elementData.answers.splice(index, 1);

  if (props.isGraded) {
    if (elementData.correct === index) elementData.correct = null;
    if (elementData.correct && elementData.correct >= index)
      elementData.correct--;
  }
};

const updateAnswer = (value: string, index: number) =>
  (elementData.answers[index] = value);

const save = () => emit('save', elementData);
const updateData = (data: ElementData) => {
  Object.assign(elementData, cloneDeep(data));
};

const requiredRule = (val?: string | number) => {
  return !!val || isNumber(val) || 'The field is required.';
};

watch(() => props.element.data, updateData);

watch(
  () => props.isGraded,
  (val) => {
    if (!val) delete elementData.correct;
    else elementData.correct = null;
    emit('save', elementData);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.tce-single-choice {
  text-align: left;
}
</style>
