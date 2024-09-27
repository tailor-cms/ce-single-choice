<template>
  <VForm ref="form" class="tce-root" @submit.prevent="submit">
    <div class="px-2 my-4">{{ data.question }}</div>
    <VInput
      :rules="[requiredRule]"
      :validation-value="selectedAnswer.length != 0"
      hide-details="auto"
      validate-on="submit"
    >
      <VItemGroup
        v-model="selectedAnswer"
        class="w-100"
        selected-class="bg-blue-grey-lighten-4"
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
            class="d-flex align-center px-4 py-3 mb-3"
            color="blue-grey-darken-2"
            rounded="lg"
            variant="outlined"
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
            <template v-if="submitted">
              <VIcon v-if="isSelected" v-bind="iconProps(index)" />
            </template>
          </VCard>
        </VItem>
      </VItemGroup>
    </VInput>
    <VAlert
      v-if="submitted"
      :text="userState?.isCorrect ? 'Correct' : 'Incorrect'"
      :type="userState?.isCorrect ? 'success' : 'error'"
      class="mb-3"
      rounded="lg"
      variant="tonal"
    />
    <div class="d-flex justify-end">
      <VBtn v-if="!submitted" type="submit" variant="tonal">Submit</VBtn>
      <VBtn v-else variant="tonal" @click="submitted = false">Try Again</VBtn>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElementData } from '@tailor-cms/ce-single-choice-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const form = ref<HTMLFormElement>();
const submitted = ref('isCorrect' in (props.userState ?? {}));
const selectedAnswer = ref<string[]>(props.userState?.response);

const submit = async () => {
  const { valid } = await form.value?.validate();
  if (valid) {
    emit('interaction', { response: selectedAnswer.value });
  }
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'You have to select an answer.';
};

const iconProps = (index: number) => {
  const isCorrect = props.userState?.correct === index;
  if (isCorrect) return { icon: 'mdi-check-circle', color: 'success' };
  return { icon: 'mdi-close-circle', color: 'error' };
};

watch(
  () => props.userState,
  (state = {}) => {
    selectedAnswer.value = state.response;
    submitted.value = 'isCorrect' in state;
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
