"use client";
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { verifyAge } from './action';
import { CheckCircle } from 'lucide-react';

export default function VerificationModule({isAlreadyVerified = false}: {isAlreadyVerified?: boolean}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('Loading local face detection AI...');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      setStatus('AI ready. Align face to ellipsis.');
      startVideo();
    };
    setVerified(isAlreadyVerified);
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch((err) => setStatus('Camera access denied.'));
  };

  const handleVideoPlay = () => {
    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withAgeAndGender();

        if (detection) {
          const age = Math.round(detection.age);
          // Using a 2-year buffer to account for estimation inaccuracies
          setStatus(`Verification successful! ${age > 16 ? ` Estimated age is ${age}. You can use NSFW characters.` : ' Estimated age is under 18. You cannot use NSFW characters.'}`);
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
          clearInterval(interval);
          setVerified(true);
          await verifyAge(age > 16); // Call server-side verification function
        }
      }
    }, 2000); // Check every 2 seconds
  };

  return (
    <div className="flex flex-col w-full h-screen items-center p-4 bg-background text-white">
      <h1 className="text-2xl font-bold mb-4">AICord Age Attestation</h1>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        {!verified ? (
        <video
        ref={videoRef}
        autoPlay
        muted
        onPlay={handleVideoPlay}
        className="w-48 h-64 rounded-full bg-gray-800 object-cover scale-x-[-1]"
      />
        ) : (
          <CheckCircle className="text-green-500" size={48} />
        )}
      <div className="mt-4 font-mono">{status}</div>
      </div>
      <p className="text-sm mb-4 text-gray-400 max-w-sm">Face-based age verification happens completely locally on your device and personally identifiable information is never stored or transmitted. AICord only receives the verified age information. The source code of verification module is <a className='link' href="https://github.com/aicordapp/age-attestation">open source</a>.</p>
      
    </div>
  );
}
