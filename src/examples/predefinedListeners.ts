import { ALLSTATE, ListenerProps, Point } from "stay-canvas"

export const MoveListener: ListenerProps = {
  name: "moveListener",
  event: ["startmove", "move"],
  state: ALLSTATE,
  callback: ({ e, composeStore, tools: { moveStart, move } }) => {
    const eventMap = {
      startmove: () => {
        moveStart()
        return {
          startMovePoint: new Point(e.x, e.y),
        }
      },
      move: () => {
        const { startMovePoint } = composeStore
        if (!startMovePoint) {
          return
        }
        move(e.x - startMovePoint.x, e.y - startMovePoint.y)
      },
    }
    return eventMap
  },
}

export const ZoomListener: ListenerProps = {
  name: "zoomListener",
  event: ["zoomin", "zoomout"],
  state: ALLSTATE,
  callback: ({ e, tools: { zoom } }) => {
    zoom(e.deltaY, new Point(e.x, e.y))
  },
}

export const BackwardListener: ListenerProps = {
  name: "backwardListener",
  event: "backward",
  state: ALLSTATE,
  callback: ({ tools: { undo } }) => {
    undo()
  },
}

export const ForwardListener: ListenerProps = {
  name: "forwardListener",
  event: "forward",
  state: ALLSTATE,
  callback: ({ tools: { redo } }) => {
    redo()
  },
}
