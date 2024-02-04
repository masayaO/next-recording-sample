import React, { useState } from "react";

const ScreenRecording: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  const startRecording = async () => {
    try {
      // 画面のキャプチャ
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "motion" } as MediaTrackConstraints,
        audio: true, // これは画面の音をキャプチャします (例: タブ内の音声)
      });

      // マイクからの音声のキャプチャ
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const audioContext = new AudioContext();
      const displaySource = audioContext.createMediaStreamSource(displayStream);
      const audioSource = audioContext.createMediaStreamSource(audioStream);
      const destination = audioContext.createMediaStreamDestination();
      displaySource.connect(destination);
      audioSource.connect(destination);

      // 画面のストリームとマイクのストリームを結合
      const tracks = [
        ...displayStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ];
      const combinedStream = new MediaStream(tracks);

      setMediaStream(combinedStream);

      // MediaRecorderを使用して収録する
      const recorder = new MediaRecorder(combinedStream);
      let chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        setRecordingUrl(URL.createObjectURL(completeBlob));
      };
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error capturing media: ", error);
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
