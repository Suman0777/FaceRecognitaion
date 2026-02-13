import { useEffect, useRef } from "react";

const WebVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    async function streamApp() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.log("App access denied", error);
      }
    }

    streamApp();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Text */}
      <p className="text-2xl font-semibold text-center">
        MY WebCam
      </p>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[400px] rounded-2xl shadow-lg"
      />
    </div>
  );
};

export default WebVideo;
