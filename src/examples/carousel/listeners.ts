import { gsap } from "gsap"
import { Dict, ListenerProps } from "stay-canvas"

type ListenerPropsFunc = (payload: Dict) => ListenerProps

export const dragListener: ListenerPropsFunc = (payload) => ({
  name: "dragListener",
  event: ["dragstart", "drag", "dragend"],
  callback: ({ e, composeStore }) => {
    const fullWidth = payload.fullWidth
    const tl: Dict<gsap.core.Timeline> = payload.timeLines
    const timer: gsap.core.Tween = payload.timer

    const eventMap = {
      dragstart: () => {
        tl.slide.kill()
        timer.pause()
        const currentX = gsap.getProperty(payload.proxy, "x") as number
        return {
          relativeGap: currentX - e.x,
          lastPosition: e.point,
          lastTime: Date.now(),
          lastTenSpeed: [],
        }
      },
      drag: () => {
        const { relativeGap, lastPosition, lastTime, lastTenSpeed } = composeStore
        const offsetX = e.x + relativeGap

        const dt = Date.now() - lastTime
        const dx = e.x - lastPosition.x
        const vx = dx / dt
        const dy = e.y - lastPosition.y
        const vy = dy / dt

        const symbal = dx > 0 ? 1 : -1
        const speed = Math.sqrt(vx * vx + vy * vy) * symbal

        lastTenSpeed.push(speed)
        if (lastTenSpeed.length > 10) {
          lastTenSpeed.shift()
        }
        payload.proxy.x = offsetX
        tl.main.progress(((offsetX + 2 * fullWidth) % fullWidth) / fullWidth)
        return {
          lastPosition: e.point,
          lastTime: Date.now(),
          lastTenSpeed,
        }
      },
      dragend: () => {
        const { lastTenSpeed } = composeStore
        const speed = (lastTenSpeed as number[]).reduce((a, b) => a + b, 0) / lastTenSpeed.length

        payload.moveSlide(2, Math.ceil(isNaN(speed) ? 0.1 : speed))
      },
    }
    return eventMap
  },
})
