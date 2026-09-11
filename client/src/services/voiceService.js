export const getVADConfig = () => ({ pStart: 0.60, pauseMs: 400, endMs: 1200 });

let recognition = null;
if (typeof window !== 'undefined') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  }
}

export const startListening = (language, onTranscript, onEnd) => {
  if (!recognition) {
    console.warn('Speech recognition not supported in this browser.');
    if(onEnd) onEnd();
    return;
  }
  recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  
  recognition.onresult = (event) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) final += event.results[i][0].transcript;
      else interim += event.results[i][0].transcript;
    }
    onTranscript(final || interim, !!final);
  };
  
  recognition.onerror = (e) => console.error('Voice Error:', e.error);
  recognition.onend = () => {
    if(onEnd) onEnd();
  };
  
  try {
    recognition.start();
  } catch (e) {
    console.error("Already started", e);
  }
};

export const stopListening = () => {
  if (recognition) recognition.stop();
};

export const speak = (text, language) => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  window.speechSynthesis.speak(utterance);
};
