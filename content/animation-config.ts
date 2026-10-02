export const animationConfig = {
  frameCount: 165,
  initialBatchSize: 12,
  batchSize: 12,
  directory: "/animations/canvas",
  // Cropped to the device and downsized for phones; regenerate with scripts/build-mobile-frames.py.
  mobileDirectory: "/animations/canvas-mobile",
  prefix: "living-canvas-",
  extension: "webp",
  desktopMinWidth: 900,
  maxDevicePixelRatio: 1.75,
  posterFrame: 132,
  stageFrames: [1, 45, 95, 165],
} as const;

export const getFrameSrc = (frame: number, mobile = false) =>
  `${mobile ? animationConfig.mobileDirectory : animationConfig.directory}/${animationConfig.prefix}${String(frame).padStart(4, "0")}.${animationConfig.extension}`;
