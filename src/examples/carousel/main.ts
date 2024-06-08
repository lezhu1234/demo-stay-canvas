import { gsap } from "gsap"

import { Dict, ListenerProps, Rectangle, StayCanvas, StayChild, StayTools } from "stay-canvas"
import * as listeners from "./listeners"

function h(a: number) {
  return a >= 0 ? 0 : 1
}

const width = 600
const height = 600
const backgroundColorList = [
  ["#a18cd1", "#fbc2eb"],
  ["#f6d365", "#fda085"],
  ["#a1c4fd", "#c2e9fb"],
  ["#d4fc79", "#96e6a1"],
  ["#84fab0", "#8fd3f4"],
]
const virtualCtx = document.createElement("canvas").getContext("2d")
const childWidth = width

const offset = { x: 0 }
const fullWidth = backgroundColorList.length * childWidth
const listenerList: ListenerProps[] = []

const wrapX = gsap.utils.wrap((1 - backgroundColorList.length) * childWidth, childWidth)

const proxy = {
  x: 0,
  modifiers: {
    x: wrapX,
  },
}
const timer: gsap.core.Tween = gsap.delayedCall(1, moveSlide, [2, 1])
const timeLines: Dict<gsap.core.Timeline> = {}

function init({ appendChild, updateChild }: StayTools) {
  const children: StayChild<Rectangle>[] = []
  backgroundColorList.forEach((color, index) => {
    const gradient = virtualCtx?.createLinearGradient(0, 0, 0, height)
    gradient?.addColorStop(0, color[0])
    gradient?.addColorStop(1, color[1])
    children.push(
      appendChild({
        className: "c" + index,
        shape: new Rectangle({
          x: (index - backgroundColorList.length + 1) * childWidth,
          y: 0,
          width: childWidth,
          height,
          props: {
            color: gradient!,
            type: "fill",
          },
        }),
      })
    )
  })

  const toValue: gsap.TweenVars = {
    x: fullWidth,
    duration: 1,
    ease: "none",
    onUpdate: () => {
      const offsetX = wrapX(gsap.getProperty(offset, "x") as number)
      children.forEach((child, i) => {
        updateChild({
          child,
          shape: child.shape.update({
            x: wrapX(offsetX + (i - children.length + 1) * childWidth),
          }),
        })
      })
    },
  }

  timeLines.main = gsap.timeline().to(offset, toValue).pause()
  timer.restart(true)

  listenerList.push(
    listeners.dragListener({
      timer,
      offset,
      fullWidth,
      wrapX,
      timeLines: timeLines,
      moveSlide,
      proxy: proxy,
    })
  )
}

function moveSlide(duration: number, offset: number) {
  if (typeof timeLines.slide !== "undefined") {
    timeLines.slide.kill()
  }
  let currentX = gsap.getProperty(proxy, "x") as number
  let currentIndex = Math.floor(currentX / childWidth)
  currentIndex = wrapX(currentIndex + h((2 * currentIndex + 1) * childWidth - 2 * currentX))

  let targetX = (currentIndex + offset) * childWidth
  timeLines.slide = gsap
    .timeline({
      onUpdate: () => {
        const x = gsap.getProperty(proxy, "x") as number
        timeLines.main.progress(((x + 2 * fullWidth) % fullWidth) / fullWidth)
      },
    })
    .to(proxy, { x: targetX, duration })

  timer.delay(duration)
  timer.restart(true)
}

const stay = new StayCanvas({
  id: "carousel",
  width: 500,
  height: 500,
  mounted: init,
})

stay.setListenerList(listenerList)
