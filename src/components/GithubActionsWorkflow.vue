<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

const emit = defineEmits(['reveal'])
const props = defineProps<{
  workflowId: string
}>()


onMounted(() => {
   // TODO
});

</script>

<template>
    A Github Workflow is being built here
</template>

<style scoped>

</style>
