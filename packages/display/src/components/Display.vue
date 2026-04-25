<template>
  <div class="tce-single-choice">
    <div class="text-title-small mb-2">Select one:</div>
    <VInput
      :model-value="selectedAnswer"
      :rules="[requiredRule]"
      hide-details="auto"
      validate-on="submit"
    >
      <VItemGroup
        v-model="selectedAnswer"
        class="w-100 d-flex flex-column ga-2"
        mandatory
      >
        <VItem
          v-for="(item, index) in element.data.answers"
          :key="index"
          v-slot="{ toggle, isSelected }"
          :value="index"
        >
          <VCard
            v-bind="isSubmitted ? {} : { onClick: toggle }"
            :class="{ readonly: isSubmitted, selected: isSelected }"
            :color="isSelected ? 'primary' : 'transparent'"
            :variant="isSelected ? 'tonal' : 'flat'"
            class="d-flex align-center px-4 py-3"
            border
          >
            <VAvatar
              :class="{ 'font-weight-bold': isSelected }"
              :variant="isSelected ? 'flat' : 'outlined'"
              class="mr-4"
              color="primary"
              size="small"
            >
              {{ indexToAlpha(index) }}
            </VAvatar>
            {{ item }}
            <VSpacer />
            <template v-if="isSubmitted && isGraded">
              <VIcon
                v-if="isSelected"
                :color="isCorrect(index) ? 'success' : 'error'"
                :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
              />
            </template>
          </VCard>
        </VItem>
      </VItemGroup>
    </VInput>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Element } from '@tailor-cms/ce-single-choice-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits<{
  'user-input': [data: { response: number | null }];
}>();

const isSubmitted = ref(!!props.userState?.isSubmitted);
const selectedAnswer = ref<number | null>(props.userState?.response ?? null);

const isGraded = computed(() => 'isCorrect' in (props.userState ?? {}));

const indexToAlpha = (index: number) => String.fromCharCode(index + 65);
const isCorrect = (index: number) => props.userState?.correct === index;

watch(selectedAnswer, (val) => {
  if (val !== null) emit('user-input', { response: val });
});

const requiredRule = (val: number | null) =>
  typeof val === 'number' || 'You have to select an answer';

watch(
  () => props.userState,
  (state = {}) => {
    selectedAnswer.value = state.response ?? null;
    isSubmitted.value = !!state.isSubmitted;
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.tce-single-choice {
  text-align: left;
}

.v-input .selected.v-card {
  border: 1px solid color-mix(in srgb, currentColor 36%, transparent);
}
</style>
