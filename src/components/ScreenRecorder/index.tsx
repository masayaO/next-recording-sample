import React, { useState } from "react";

const ScreenRecording: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  const startRecording = async () => {
    try {
      // 画面収録を開始する
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "motion" } as MediaTrackConstraints,
        audio: true,
      });
      setMediaStream(stream);

      // MediaRecorderを使用して収録する
      const recorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        setRecordingUrl(URL.createObjectURL(completeBlob));
      };
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error capturing screen: ", error);
    }
  };

  const stopRecording = () => {
    // 収録を停止する
    mediaRecorder?.stop();
    mediaStream?.getTracks().forEach((track) => track.stop());
  };

  return (
    <div>
      <button onClick={startRecording}>画面収録開始</button>
      <button onClick={stopRecording} disabled={!mediaRecorder}>
        画面収録停止
      </button>
      {recordingUrl && (
        <video src={recordingUrl} controls style={{ width: "500px" }} />
      )}
    </div>
  );
};

export default ScreenRecording;
