import {
  framePackage,
  framePackageUndefinedCallback,
} from "../data/framesData";
import FrameFactory from "../neutron/frames/FrameFactory";

describe("frame factory", () => {
  test("should build frames from a configuration", () => {
    const frameFactory = new FrameFactory();
    const frames = frameFactory.buildFramePackage(framePackage as any);
    expect(frames).toBeDefined();
    expect(frames.length).toBe(1);
    expect(frames[0].id).toBe("trhtnh5nryt9n4yn4rn5rny");
    expect(frames[0].name).toBe("Move");
  });

  test("should retreive a previously built package", () => {
    const frameFactory = new FrameFactory();
    frameFactory.buildFramePackage(framePackage as any);
    const frames = frameFactory.getFramePackage(framePackage.id);
    expect(frames).toBeDefined();
    expect(frames.length).toBe(1);
    expect(frames[0].id).toBe("trhtnh5nryt9n4yn4rn5rny");
    expect(frames[0].name).toBe("Move");
  });
});

describe("frames", () => {
  test("should build a frame executor from a frame", () => {
    const frameFactory = new FrameFactory();
    const frames = frameFactory.buildFramePackage(framePackage as any);
    const frameExecutor = frames[0].build({ x: 1, y: 2 });
    expect(frameExecutor).toBeDefined();
    expect(frameExecutor.methodType).toBe("publishLoop");
    expect(frameExecutor.payload).toEqual({ x: 1, y: 2 });
  });
});
