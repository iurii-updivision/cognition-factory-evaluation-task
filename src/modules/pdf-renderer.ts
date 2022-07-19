import * as PdfJs from 'pdfjs-dist'

PdfJs.GlobalWorkerOptions.workerSrc =
  '../../node_modules/pdfjs-dist/build/pdf.worker.js'

type PdfRendererParameters = {
  container: HTMLDivElement
  src: string
  canvasId: string
  pages: string[]
}

export default async ({
  container,
  src,
  canvasId,
  pages,
}: PdfRendererParameters) => {
  const pdf = await PdfJs.getDocument(src).promise

  for (let i = 1; i <= pdf._pdfInfo.numPages; i++) {
    const pageId = `${canvasId}-${i}`

    pages.push(pageId)

    const page = await pdf.getPage(i)
    const canvas = document.getElementById(pageId) as HTMLCanvasElement

    let viewport = page.getViewport({ scale: 1 })

    viewport = page.getViewport({
      scale: container.offsetWidth / viewport.width,
    })

    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)

    page.render({
      canvasContext: canvas.getContext('2d') as object,
      viewport,
    })
  }
}
