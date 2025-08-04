import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript }) => {
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-3 rounded-full transition-all duration-300 ${
        isListening 
          ? 'bg-red-500 text-white shadow-lg animate-pulse' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isListening ? 'Stop recording' : 'Start voice recording'}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};