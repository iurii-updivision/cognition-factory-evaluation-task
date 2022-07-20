import type { Selection } from 'd3-selection'
import * as d3 from 'd3'
import type { Ref } from 'vue'

export type Node = {
  name: string
  element: Element
}

export type PointerPosition = {
  x: number
  y: number
}

export type PointerMovementDelta = {
  x: number
  y: number
  distance: number
}

export enum ShapeVariant {
  Circle,
  Rectangle,
}

export type ClickHandler = (event: MouseEvent) => void

const getPointerMovementDelta = (
  initial: PointerPosition,
  current: PointerPosition,
): PointerMovementDelta => {
  const delta = {
    x: 0,
    y: 0,
    distance: 0,
  } as PointerMovementDelta

  if (current.x > initial.x) {
    delta.x = current.x - initial.x
  } else {
    delta.x = initial.x - current.x
  }

  if (current.y > initial.y) {
    delta.y = current.y - initial.y
  } else {
    delta.y = initial.y - current.y
  }

  delta.distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

  return delta
}

export default (
  nodes: Node[],
  shapeVariant: Ref<ShapeVariant>,
  onClick: ClickHandler,
) => {
  const prepareNode = (node: Node) => {
    type Shape = Selection<SVGSVGElement, unknown, null, undefined>
    type Circle = Selection<SVGCircleElement, unknown, null, undefined>
    type Rectangle = Selection<SVGRectElement, unknown, null, undefined>

    const pointer = {
      x: 0,
      y: 0,
    }

    const position = {
      top: 0,
      left: 0,
    }

    const shape = {
      container: undefined as Shape | undefined,
      instance: undefined as Circle | Rectangle | undefined,
    }

    d3.select(node.element)
      .on('mousedown', (event: MouseEvent) => {
        if (!(event.target as Element).classList.contains('overlay')) {
          return
        }

        pointer.x = event.x
        pointer.y = event.y
        position.top = event.offsetY - 2
        position.left = event.offsetX - 2

        shape.container = d3.select(node.element).append('svg')

        shape.container.on('click', onClick)
        shape.container.attr('width', 2)
        shape.container.attr('height', 2)
        shape.container.attr('class', 'shape-container')
        shape.container.style('top', position.top)
        shape.container.style('left', position.left)

        if (shapeVariant.value === ShapeVariant.Circle) {
          shape.instance = shape.container.append('circle')
          shape.instance.attr('class', 'shape-instance')
          shape.instance.attr('cx', 1)
          shape.instance.attr('cy', 1)
          shape.instance.attr('r', 1)
        }

        if (shapeVariant.value === ShapeVariant.Rectangle) {
          shape.instance = shape.container.append('rect')
          shape.instance.attr('class', 'shape-instance')
          shape.instance.attr('x', 1)
          shape.instance.attr('y', 1)
          shape.instance.attr('width', 2)
          shape.instance.attr('height', 2)
        }
      })
      .on('mouseup', () => {
        if (shape.container === undefined) {
          return
        }

        shape.container.attr('class', 'shape-container finished')

        shape.container = undefined
        shape.instance = undefined
        pointer.x = 0
        pointer.y = 0
        position.top = 0
        position.left = 0
      })
      .on('mousemove', function (event: MouseEvent) {
        if (shape.container === undefined || shape.instance === undefined) {
          return
        }

        const delta = getPointerMovementDelta(pointer, event)

        if (shapeVariant.value === ShapeVariant.Circle) {
          shape.container.style('top', position.top - delta.distance)
          shape.container.style('left', position.left - delta.distance)
          shape.container.attr('width', delta.distance * 2)
          shape.container.attr('height', delta.distance * 2)

          shape.instance.attr('cx', delta.distance)
          shape.instance.attr('cy', delta.distance)
          shape.instance.attr('r', delta.distance)
        }

        if (shapeVariant.value === ShapeVariant.Rectangle) {
          shape.container.attr('width', delta.x)
          shape.container.attr('height', delta.y)

          shape.instance.attr('width', delta.x)
          shape.instance.attr('height', delta.y)
        }
      })
      .node()
  }

  nodes.forEach((node) => prepareNode(node))
}
