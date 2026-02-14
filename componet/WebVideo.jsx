import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const emotionEmoji = {
  happy: "😁",
  sad: "😢",
  angry: "😡",
  surprised: "😲",
  fearful: "😨",
  disgusted: "🤢",
  neutral: "😐",
};

const WebVideo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [displayExperssion , setdisplayExpression] = useState("...Loading");

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

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

      if (video && video.readyState === 4 && video.videoWidth > 0) {
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        

        // For display the emoji in the ui 
        if(detections.length > 0){
          const expressionss = detections[0].expressions;

          let maxVal = 0;
          let dominatExpression = "neutral";

          for(let exp in expressionss){
            if(expressionss[exp] > maxVal){
              maxVal = expressionss[exp];
              dominatExpression = exp;
            }
          }

          setdisplayExpression(dominatExpression);
        }


        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      
      }
    }, 150);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="shadow-2xs shadow-gray/80 w-full max-w-md sm:max-w-lg bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6">
      {/* Title */}
      <p className=" text-gray-700 text-center text-lg sm:text-2xl font-semibold font-mono mb-4">
        Face Detection Webcam
      </p>

      {/* Camera Container */}
      <div className="relative w-full aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden border border-black/10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Status to see the MOdel is running or not (ON/OFF) */}
      <p className="mt-3 text-center text-sm text-gray-600">
        {modelsLoaded ? "Face Detection Models Started " : "Loading Models..."}
      </p>

      <div className=" font-semibold text-gray-600 text-2xl font-mono flex justify-center">
          <h1>Moood:  </h1>
          <div className=" text-2xl">
            <p>{emotionEmoji[displayExperssion]}</p>
            <p>{displayExperssion}</p>
            {displayExperssion === "sad" && "Dont be sad be Happy "}
          </div>
      </div>
    </div>
  );
};

export default WebVideo;
