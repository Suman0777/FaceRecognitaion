import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const WebVideo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  //  Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      console.log(" Models loaded");
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    async function streamApp() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    }

    streamApp();
  }, []);

  // Face detection loop
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (
        video &&
        video.readyState === 4 &&
        video.videoWidth > 0
      ) {
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };


        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        try {
          const detections = await faceapi
            .detectAllFaces(
              video,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          //for Clearing the canvas after Every second load
          const clearrr = canvas.getContext("2d");
          clearrr.clearRect(0, 0, canvas.width, canvas.height);

          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          if (detections.length > 0) {
                console.log(detections[0].expressions);
            }

        } catch (err) {
          console.error("Detection error:", err);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-2xl font-semibold opacity-80 font-mono">
        MY WebCam For Face Detection 
      </p>


        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className=" relative"
        />

        <canvas
          ref={canvasRef}
          className="absolute "
        />

    </div>
  );
};

export default WebVideo;
