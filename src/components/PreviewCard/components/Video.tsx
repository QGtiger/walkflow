import { useEffect, useRef } from "react";
import { InteractionState, PreviewCardModel } from "../model";
import { useLatest } from "ahooks";

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { recordingUrl, state, targetStepInfo, setState, hasMoreSteps, reset } =
    PreviewCardModel.useModel();

  const latestTargetStepInfo = useLatest(targetStepInfo);
  const latestHasMoreStepsRef = useLatest(hasMoreSteps);

  const animationFrameRef = useRef<number>(0);

  // 播放状态管理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      // 精确时间检测逻辑
      animationFrameRef.current = requestAnimationFrame(
        function checkPlaybackProgress() {
          if (!videoRef.current) return;
          if (!latestHasMoreStepsRef.current) return;
          const _latestTargetStepInfo = latestTargetStepInfo.current;
          if (_latestTargetStepInfo.type !== "hotspot") {
            throw new Error("当前步骤不是 hotspot");
          }

          const currentTime = videoRef.current.currentTime * 1000;

          // 到达目标时间点时暂停
          if (
            _latestTargetStepInfo &&
            currentTime >= _latestTargetStepInfo.t - 300
          ) {
            setState(InteractionState.Paused);
            return;
          }

          // 继续轮询检测
          if (!videoRef.current.paused) {
            animationFrameRef.current = requestAnimationFrame(
              checkPlaybackProgress
            );
          }
        }
      );
    };

    const handlePause = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    const handleEnded = () => {
      setState(InteractionState.Completed);
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (state === InteractionState.NotStarted) {
      videoElement.pause();
      videoElement.currentTime = 0;
    } else if (state === InteractionState.Playing) {
      videoElement.play();
    } else if (state === InteractionState.Paused) {
      videoElement.pause();
      // hotspot 步骤需要跳转到指定时间
      if (targetStepInfo.type === "hotspot") {
        videoElement.currentTime = targetStepInfo.t / 1000;
      }
    } else if (state === InteractionState.Completed) {
      reset();
    }
  }, [state, targetStepInfo]);

  return (
    <video
      ref={videoRef}
      src={recordingUrl}
      controls={false}
      className="h-full"
    ></video>
  );
}
