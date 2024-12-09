<template>
  <TailorEmbeddedContainer :elements="questionPrompt" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElementData } from '@tailor-cms/ce-single-choice-manifest';

const props = defineProps<{ data: ElementData; }>();

const questionPrompt = computed(() => {
  return props.data.question.map((id) => props.data.embeds[id]);
});
</script>
