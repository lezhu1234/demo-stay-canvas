import { ALLSTATE, ListenerProps, Rectangle, StayCanvas } from "stay-canvas"

const DragListener: ListenerProps = {
  name: "dragListener",
  event: ["dragstart", "drag", "dragend"],
  callback: ({ e, composeStore, tools: { appendChild, updateChild, log } }) => {
    return {
      dragstart: () => ({
        dragStartPosition: e.point,
        dragChild: appendChild({
          shape: new Rectangle({
            x: e.x,
            y: e.y,
            width: 0,
            height: 0,
            props: { color: "red" },
          }),
          className: "annotation",
        }),
      }),
      drag: () => {
        const { dragStartPosition, dragChild } = composeStore
        const x = Math.min(dragStartPosition.x, e.x)
        const y = Math.min(dragStartPosition.y, e.y)
        const width = Math.abs(dragStartPosition.x - e.x)
        const height = Math.abs(dragStartPosition.y - e.y)
        updateChild({
          child: dragChild,
          shape: dragChild.shape.update({ x, y, width, height }),
        })
      },
      dragend: () => {
        log()
      },
    }
  },
}

const undoListener: ListenerProps = {
  name: "undoListener",
  event: "undo",
  state: ALLSTATE,
  callback: ({ tools: { undo } }) => {
    undo()
  },
}

const redoListener: ListenerProps = {
  name: "redoListener",
  event: "redo",
  state: ALLSTATE,
  callback: ({ tools: { redo } }) => {
    redo()
  },
}

const stay = new StayCanvas({
  id: "demo",
  width: 500,
  height: 500,
  listenerList: [DragListener, undoListener, redoListener],
})

const container = document.getElementById("demo")
if (container) {
  const undoButton = document.createElement("button")
  undoButton.innerText = "undo"
  undoButton.style.marginLeft = "500px"
  undoButton.addEventListener("click", () => {
    stay.trigger("undo")
  })
  container.appendChild(undoButton)

  const redoButton = document.createElement("button")
  redoButton.innerText = "redo"
  redoButton.style.marginLeft = "500px"
  redoButton.addEventListener("click", () => {
    stay.trigger("redo")
  })
  container.appendChild(redoButton)
}
