import { Rectangle, StayCanvas } from "stay-canvas"
import * as listeners from "./listeners"
const width = 500
const height = 500
const outer = new Rectangle({ x: 0, y: 0, width, height })
const stay = new StayCanvas({
  id: "seg-drawer",
  width: 500,
  height: 500,
  listenerList: Object.values(listeners),
})

function fileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    stay.trigger("changeFile", {
      src: URL.createObjectURL(target.files[0]),
      container: outer,
    })
  }
}

const container = document.getElementById("seg-drawer")
if (container) {
  const inputButton = document.createElement("input")
  inputButton.type = "file"
  inputButton.addEventListener("change", fileUpload)
  inputButton.accept = "image/*"
  inputButton.style.marginLeft = "500px"

  const drawButton = document.createElement("button")
  drawButton.innerText = "draw"
  drawButton.addEventListener("click", () => {
    stay.trigger("changeState", { state: "draw" })
  })
  drawButton.style.marginLeft = "500px"

  const earserButton = document.createElement("button")
  earserButton.innerText = "eraser"
  earserButton.addEventListener("click", () => {
    stay.trigger("changeState", { state: "eraser" })
  })
  earserButton.style.marginLeft = "500px"

  const hintLabel = document.createElement("span")
  hintLabel.innerText = "arrawUp/arrowDown to Zoom brush"
  hintLabel.style.marginLeft = "500px"

  container.appendChild(hintLabel)
  container.appendChild(inputButton)
  container.appendChild(drawButton)
  container.appendChild(earserButton)
}
