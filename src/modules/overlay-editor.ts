import type { Selection } from 'd3-selection'
import * as d3 from 'd3'

export type Node = {
  name: string
  element: Element
}

type PointerPosition = {
  x: number
  y: number
}

type PointerMovementDelta = {
  x: number
  y: number
  distance: number
}

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

export default (nodes: Node[]) => {
  const prepareNode = (node: Node) => {
    type Shape = Selection<SVGSVGElement, unknown, null, undefined>
    type Circle = Selection<SVGCircleElement, unknown, null, undefined>

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
      instance: undefined as Circle | undefined,
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
        shape.instance = shape.container.append('circle')

        shape.container
          .attr('width', 2)
          .attr('height', 2)
          .attr('class', 'shape-container')
          .style('top', position.top)
          .style('left', position.left)

        shape.instance
          .attr('class', 'shape-instance')
          .attr('cx', 1)
          .attr('cy', 1)
          .attr('r', 1)
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

        const distance = getPointerMovementDelta(pointer, event).distance

        shape.container.style('top', position.top - distance)
        shape.container.style('left', position.left - distance)

        shape.container.attr('width', distance * 2)
        shape.container.attr('height', distance * 2)

        shape.instance.attr('cx', distance)
        shape.instance.attr('cy', distance)
        shape.instance.attr('r', distance)
      })
      .node()
  }

  nodes.forEach((node) => prepareNode(node))
}
