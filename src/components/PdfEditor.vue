<script setup lang="ts">
import { nextTick, ref, toRef } from 'vue'
import renderPdf from '@/modules/pdf-renderer'
import type { ClickHandler, Node, ShapeVariant } from '@/modules/overlay-editor'
import initiateOverlay from '@/modules/overlay-editor'

type ElementInstance = InstanceType<typeof Element>

type Props = {
  src: string
  shapeVariant: ShapeVariant
  shapeClickHandler: ClickHandler
}

const props = withDefaults(defineProps<Props>(), {})
const pages = ref<string[]>([])
const containerRef = ref<HTMLDivElement>()
const overlayRefs = ref<Node[]>([])
const shapeVariant = toRef(props, 'shapeVariant')

const bindOverlayRef = (name: string, element: ElementInstance) => {
  if (!overlayRefs.value.find((r) => r.name === name)) {
    overlayRefs.value.push({ name, element })
  }
}

nextTick(async () => {
  await renderPdf({
    container: containerRef.value as HTMLDivElement,
    src: props.src,
    canvasId: `${Math.floor(Math.random() * Math.pow(10, 16))}`,
    pages: pages.value,
  })

  initiateOverlay(overlayRefs.value, shapeVariant, props.shapeClickHandler)
})
</script>

<template>
  <div class="wrapper">
    <div ref="containerRef">
      <template v-for="page in pages" :key="page">
        <div class="container">
          <canvas class="page" :id="page" />
          <div
            class="overlay"
            :ref="(el: Element) => bindOverlayRef(page, el)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page {
  direction: ltr;
}

.container {
  overflow: hidden;
  display: grid;
  justify-items: center;
  align-items: stretch;
  margin-bottom: 2rem;
}

.container > * {
  grid-column-start: 1;
  grid-row-start: 1;
}

.overlay {
  width: 100%;
  cursor: crosshair;
}

.wrapper {
  width: 100%;
  height: 100vh;
  overflow: scroll;
  padding: 2rem;
  align-items: center;
}
</style>

<style>
.shape-container {
  position: absolute;
}
.shape-container > * {
  mix-blend-mode: multiply;
}
.shape-container > * {
  fill: rgba(255, 0, 0, 0.9);
}
.shape-container.finished {
  cursor: pointer;
}
.shape-container.finished > * {
  fill: rgba(255, 0, 0, 0.5);
}
.shape-container.finished:hover > * {
  fill: rgba(255, 0, 0, 0.9);
}
</style>
