"use client";

import React, { useState, useEffect } from 'react';

const AudioRecorder: React.FC = () => {
  const [audioURL, setAudioURL] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // マイクへのアクセスを要求し、レコーダーをセットアップ
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { 'type': 'audio/wav;' });
            const audioURL = window.URL.createObjectURL(blob);
            setAudioURL(audioURL);
          };
          const chunks: BlobPart[] = [];
          mediaRecorder.ondataavailable = e => chunks.push(e.data);
          setRecorder(mediaRecorder);
        })
        .catch(err => {
          console.error('The following error occurred: ' + err);
        });
    }
  }, []);

  const startRecording = () => {
    if (recorder !== null) {
      setIsRecording(true);
      recorder.start();
    }
  };

  const stopRecording = () => {
    if (recorder !== null) {
      setIsRecording(false);
      recorder.stop();
      console.log(audioURL)
    }
  };

  console.log(audioURL)

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>録音開始</button>
      <button onClick={stopRecording} disabled={!isRecording}>録音停止</button>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};

export default AudioRecorder;
