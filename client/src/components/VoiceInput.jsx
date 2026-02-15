import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onSpeechInput, lang = 'en-US' }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.continuous = false; // Stop after one sentence/phrase
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = lang;

        recognitionInstance.onstart = () => {
            setIsListening(true);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onSpeechInput(transcript);
        };

        recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        setRecognition(recognitionInstance);
    }, [lang, onSpeechInput]);

    const toggleListening = () => {
        if (!isSupported) {
            alert("Your browser does not support voice input. Please use Chrome, Edge, or Safari.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    if (!isSupported) return null;

    return (
        <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-300 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-red-300 shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600'
                }`}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
        >
            {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            )}
        </button>
    );
};

export default VoiceInput;
