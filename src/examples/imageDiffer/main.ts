import { ListenerProps, Rectangle, StayCanvas, StayImage, StayTools } from "stay-canvas"
import { DragListener } from "./listeners"

const width = 600
const height = 600
const container = new Rectangle({
  x: 0,
  y: 0,
  width,
  height,
})

const listeners: ListenerProps[] = []

const imagewidth = 200
const imageheight = 300
const splitbarWidth = 10
const splitbarHeight = height
const leftImageSrc = `https://picsum.photos/${imagewidth}/${imageheight}?id=1`
const rightImageSrc = `https://picsum.photos/${imagewidth}/${imageheight}?id=2`

function initFunc({ appendChild }: StayTools) {
  const {
    rectangle: imageRectangle,
    scaleRatio,
    offsetX,
    offsetY,
  } = container.computeFitInfo(imagewidth, imageheight)
  const { rectangle: splitBarRectangle } = container.computeFitInfo(splitbarWidth, splitbarHeight)
  const leftImage = appendChild({
    className: "leftImage",
    shape: new StayImage({
      src: leftImageSrc,
      x: imageRectangle.x,
      y: imageRectangle.y,
      width: imageRectangle.width,
      height: imageRectangle.height,
    }),
  })
  const rightImage = appendChild({
    className: "rightImage",
    shape: new StayImage({
      src: rightImageSrc,
      x: imageRectangle.x + imageRectangle.width / 2,
      y: imageRectangle.y,
      width: imageRectangle.width / 2,
      height: imageRectangle.height,
      sx: imagewidth / 2,
      swidth: imagewidth / 2,
    }),
  })
  const splitBar = appendChild({
    className: "splitBar",
    shape: splitBarRectangle.update({
      props: { color: "black", type: "fill" },
    }),
  })
  listeners.push(DragListener(leftImage, rightImage, scaleRatio, offsetX, offsetY))
}

const stay = new StayCanvas({
  id: "image-differ",
  width,
  height,
  mounted: initFunc,
})

stay.setListenerList(listeners)
