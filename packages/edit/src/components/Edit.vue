<template>
  <VForm
    ref="form"
    class="tce-single-choice"
    validate-on="submit"
    @submit.prevent="save"
  >
    <VTextarea
      v-model="elementData.question"
      :readonly="isDisabled"
      :rules="[requiredRule]"
      class="my-3"
      label="Question"
      rows="3"
      auto-grow
    />
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <VRadioGroup
      id="correct-answer"
      v-model="elementData.correct"
      :rules="[props.isGraded && requiredRule].filter(Boolean)"
    >
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :rules="[requiredRule]"
          class="my-2"
          @update:model-value="updateAnswer($event, index)"
        >
          <template #prepend>
            <VRadio
              v-if="isGraded"
              :error="correctAnswerValidation"
              :readonly="isDisabled"
              :value="index"
              color="primary"
              hide-details
            />
            <VAvatar v-else color="primary" variant="tonal">
              {{ index + 1 }}
            </VAvatar>
          </template>
          <template #append>
            <VBtn
              v-if="!isDisabled && answersCount > 2"
              aria-label="Remove answer"
              density="comfortable"
              icon="mdi-close"
              variant="text"
              @click="removeAnswer(index)"
            />
          </template>
        </VTextField>
      </VSlideYTransition>
    </VRadioGroup>
    <div class="d-flex justify-center align-center mb-2">
      <VBtn
        v-if="!isDisabled"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        {{ btnLabel }}
      </VBtn>
    </div>
    <div v-if="!isDisabled" class="d-flex justify-end">
      <VBtn :disabled="isDirty" variant="text" @click="cancel">Cancel</VBtn>
      <VBtn :disabled="isDirty" class="ml-2" type="submit" variant="tonal">
        Save
      </VBtn>
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-single-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const emit = defineEmits(['save']);
const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGraded: boolean;
}>();

const form = ref<HTMLFormElement>();
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => isEqual(elementData, props.element.data));
const correctAnswerValidation = computed(() => {
  const radioGroup = form.value?.items.find(
    (it: any) => (it.id = 'correct-answer'),
  );
  return radioGroup?.isValid === false;
});

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

const save = async () => {
  const { valid } = await form.value?.validate();
  if (valid) emit('save', elementData);
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
};

const requiredRule = (val: string | boolean | number) => {
  if (val !== null && val !== undefined && val !== '') return true;
  return 'The field is required';
};

watch(
  () => props.element.data,
  (data) => Object.assign(elementData, cloneDeep(data)),
);
</script>

<style lang="scss" scoped>
.tce-single-choice {
  text-align: left;
}
</style>
