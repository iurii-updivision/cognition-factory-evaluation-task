<script setup lang="ts">
import PdfEditor from '@/components/PdfEditor.vue'
import { ref } from 'vue'
import { ShapeVariant } from '@/modules/overlay-editor'

const shapeVariant = ref<ShapeVariant>(ShapeVariant.Circle)
</script>

<template>
  <PdfEditor src="samples/sample1.pdf" :shape-variant="shapeVariant" />
  <PdfEditor src="samples/sample2.pdf" :shape-variant="shapeVariant" />

  <div id="dev">
    <button
      @click="shapeVariant = ShapeVariant.Circle"
      :disabled="shapeVariant === ShapeVariant.Circle"
    >
      circle
    </button>
    <button
      @click="shapeVariant = ShapeVariant.Rectangle"
      :disabled="shapeVariant === ShapeVariant.Rectangle"
    >
      rectangle
    </button>
  </div>
</template>

<style>
#dev {
  position: fixed;
  padding: 1rem;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 0.5rem;
}
#dev button:not(:disabled) {
  cursor: pointer;
}
</style>
