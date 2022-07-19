<script setup lang="ts">
import { nextTick, ref } from 'vue'
import renderPdf from '../modules/pdf-renderer'

const props = withDefaults(defineProps<{ src: string }>(), {})
const pages = ref<string[]>([])
const containerRef = ref<HTMLDivElement>()

nextTick(async () => {
  if (!(containerRef.value instanceof HTMLDivElement)) {
    throw Error('Container not ready')
  }

  await renderPdf({
    container: containerRef.value,
    src: props.src,
    canvasId: `canvas-id-${Math.floor(Math.random() * Math.pow(10, 16))}`,
    pages: pages.value,
  })
})
</script>

<template>
  <div class="wrapper">
    <div class="container" ref="containerRef">
      <canvas v-for="page in pages" :key="page" :id="page" />
    </div>
  </div>
</template>

<style scoped>
canvas {
  direction: ltr;
  cursor: crosshair;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.wrapper {
  height: 100vh;
  overflow: scroll;
  padding: 2rem;
}
</style>
