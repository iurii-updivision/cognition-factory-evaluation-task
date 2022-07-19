<script setup lang="ts">
type PdfEditorProps = {
  src: string;
};

withDefaults(defineProps<PdfEditorProps>(), {});
</script>

<template>
  <header>{{ src }}</header>
  <div>PDF contents here</div>
</template>
