import { Dict, Rectangle, StayCanvas, StayImage, StayTools, Text } from "stay-canvas"
import * as PredefinedListenerList from "../predefinedListeners"
import * as DetectionToolListeners from "./listeners"
import { parseCoco, SelectRectangle } from "./utils"

const width = 600
const height = 600

let listenerList = [...Object.values(PredefinedListenerList)]

const containerRect = new SelectRectangle({ x: 0, y: 0, width, height })
let payload: Dict = {}
let initSelectRectangle: Rectangle
let imageUrl: string
let annotations: Dict[]

const [annotationMap, imageMap] = parseCoco()
annotationMap.forEach((_annotations, imageId) => {
  const { url, width, height } = imageMap.get(imageId)!
  const { rectangle, scaleRatio, offsetX, offsetY } = containerRect.computeFitInfo(width, height)

  payload = { offsetX, offsetY, scaleRatio }
  initSelectRectangle = rectangle
  imageUrl = url
  annotations = _annotations

  return // 在本demo中, 我们只需要一张图片
})

const initFunc = ({ appendChild }: StayTools) => {
  appendChild({
    className: "image",
    layer: 0,
    shape: new StayImage({
      src: imageUrl,
      x: initSelectRectangle.x,
      y: initSelectRectangle.y,
      width: initSelectRectangle.width,
      height: initSelectRectangle.height,
    }),
  })

  annotations.forEach((annotation) => {
    const [x, y, width, height] = annotation.bbox

    const child = appendChild({
      className: "annotation",
      shape: new SelectRectangle({ x, y, width, height }).worldToScreen(
        payload.offsetX,
        payload.offsetY,
        payload.scaleRatio
      ),
    })
    const label = new Text({
      x: x * payload.scaleRatio + payload.offsetX + width * payload.scaleRatio * 0.5,
      y: y * payload.scaleRatio + payload.offsetY,
      text: annotation.categoeyName,
      font: "12px serif",
      props: { color: "blue" },
    })
    label.update({
      y: label.y - label.height / 2,
    })
    appendChild({
      className: "annotationText",
      shape: label,
    })
  })
}

Object.values(DetectionToolListeners).forEach((listener) => {
  if (typeof listener === "function") {
    listenerList.push(listener(payload))
  } else {
    listenerList.push(listener)
  }
})

const stay = new StayCanvas({
  id: "image-detection-tool",
  width: 500,
  height: 500,
  mounted: initFunc,
  listenerList: listenerList,
})
