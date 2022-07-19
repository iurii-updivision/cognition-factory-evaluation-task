<script setup lang="ts">
import * as PdfJs from 'pdfjs-dist'
import { nextTick, ref } from 'vue'

const props = withDefaults(defineProps<{ src: string }>(), {})

const canvasId = `canvas-id-${Math.floor(Math.random() * Math.pow(10, 16))}`

const pages = ref<string[]>([])

const containerRef = ref<HTMLDivElement>()

const workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js'

PdfJs.GlobalWorkerOptions.workerSrc = workerSrc

nextTick(async () => {
  if (!(containerRef.value instanceof HTMLDivElement)) {
    throw Error('Container not ready')
  }

  const pdf = await PdfJs.getDocument(props.src).promise

  for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
    const pageId = `${canvasId}-${i}`

    pages.value.push(pageId)

    const page = await pdf.getPage(i)

    const canvas = document.getElementById(pageId) as HTMLCanvasElement

    let viewport = page.getViewport({ scale: 1 })

    viewport = page.getViewport({
      scale: containerRef.value.offsetWidth / viewport.width,
    })

    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)

    page.render({
      canvasContext: canvas.getContext('2d') as object,
      viewport,
    })
  }
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
