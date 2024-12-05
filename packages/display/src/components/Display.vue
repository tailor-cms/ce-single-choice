<template>
  <VCard class="question-container pa-4">
    <VForm ref="form" class="tce-root" @submit.prevent="submit">
      <TailorEmbeddedContainer :elements="questionPrompt" class="mb-4" />
      <div class="d-flex align-center text-subtitle-2 mb-2">
        Select one:
        <VSpacer />
        <VTooltip
          v-if="data.hint"
          v-model="showHint"
          :open-on-hover="false"
          location="bottom"
          max-width="350"
          close-on-back
          open-on-click
        >
          <template #activator="{ isActive, props: tooltipProps }">
            <VBtn
              v-click-outside="() => (showHint = false)"
              v-bind="tooltipProps"
              :active="isActive"
              :prepend-icon="`mdi-lightbulb-${isActive ? 'on' : 'outline'}`"
              size="small"
              text="Hint"
              variant="text"
              rounded
            />
          </template>
          {{ data.hint }}
        </VTooltip>
      </div>
      <VInput
        :rules="[requiredRule]"
        :validation-value="selectedAnswer !== null"
        hide-details="auto"
        validate-on="submit"
      >
        <VItemGroup
          v-model="selectedAnswer"
          class="w-100 d-flex flex-column ga-2"
          selected-class="bg-blue-grey-lighten-5"
          mandatory
        >
          <VItem
            v-for="(item, index) in data.answers"
            :key="index"
            v-slot="{ toggle, isSelected, selectedClass }"
            :value="index"
          >
            <VCard
              :class="selectedClass"
              :disabled="submitted"
              class="d-flex align-center px-4 py-3"
              border
              flat
              rounded
              @click="toggle"
            >
              <VAvatar
                :class="{ 'font-weight-bold': isSelected }"
                :variant="isSelected ? 'flat' : 'outlined'"
                class="mr-4"
                color="blue-grey-darken-2"
                size="small"
              >
                {{ index + 1 }}
              </VAvatar>
              {{ item }}
              <VSpacer />
              <template v-if="submitted && 'isCorrect' in userState">
                <VIcon v-if="isSelected" v-bind="iconProps(index)" />
              </template>
            </VCard>
          </VItem>
        </VItemGroup>
      </VInput>
      <VDivider class="my-4 mx-n4" />
      <VAlert
        v-if="submitted"
        v-bind="alertProps"
        class="mb-3"
        rounded="lg"
        variant="tonal"
      />
      <div class="d-flex justify-end">
        <VBtn
          v-if="!submitted"
          color="primary"
          prepend-icon="mdi-check"
          type="submit"
          variant="tonal"
        >
          Submit
        </VBtn>
        <VBtn
          v-else
          prepend-icon="mdi-refresh"
          variant="tonal"
          @click="submitted = false"
        >
          Retry
        </VBtn>
      </div>
    </VForm>
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElementData } from '@tailor-cms/ce-single-choice-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const form = ref<HTMLFormElement>();
const showHint = ref(false);
const submitted = ref(false);
const selectedAnswer = ref<string>(props.userState.response ?? null);

const alertProps = computed(() => {
  const isGraded = 'isCorrect' in props.userState;
  const isCorrect = props.userState.isCorrect;

  if (!isGraded) return { text: 'Submitted', type: 'info' };
  if (isCorrect) return { text: 'Correct', type: 'success' };
  return { text: 'Incorrect', type: 'error' };
});

const questionPrompt = computed(() => {
  return props.data.question.map((id) => props.data.embeds[id]);
});

const submit = async () => {
  const { valid } = await form.value?.validate();
  if (valid) {
    submitted.value = true;
    emit('interaction', { response: selectedAnswer.value });
  }
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'You have to select an answer.';
};

const iconProps = (index: number) => {
  const isCorrect = props.userState.correct === index;
  if (isCorrect) return { icon: 'mdi-check-circle', color: 'success' };
  return { icon: 'mdi-close-circle', color: 'error' };
};

watch(
  () => props.userState,
  (state = {}) => {
    selectedAnswer.value = state.response ?? null;
  },
  { deep: true },
);
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>
