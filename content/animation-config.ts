export const animationConfig = {
  frameCount: 165,
  initialBatchSize: 12,
  batchSize: 12,
  directory: "/animations/canvas",
  prefix: "living-canvas-",
  extension: "webp",
  desktopMinWidth: 900,
  maxDevicePixelRatio: 1.75,
  posterFrame: 132,
  stageFrames: [1, 45, 95, 165],
} as const;

export const getFrameSrc = (frame: number) =>
  `${animationConfig.directory}/${animationConfig.prefix}${String(frame).padStart(4, "0")}.${animationConfig.extension}`;
