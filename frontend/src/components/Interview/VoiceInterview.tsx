"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Feedback {
  technical_depth: string;
  communication: string;
  problem_solving: string;
  confidence: string;
  score_out_of_10: number;
  detailed_improvements?: Array<{
    field: string;
    current_level: string;
    what_to_improve: string;
    specific_actions: string[];
  }>;
}

interface InterviewState {
  sessionId: string;
  role: string;
  questionNumber: number;
  totalQuestions: number;
  currentQuestion: string;
  isListening: boolean;
  isProcessing: boolean;
  userAnswer: string;
  feedback: Feedback | null;
  overallScore: number;
  completed: boolean;
}

interface Message {
  id: string;
  type: "question" | "user_answer" | "feedback" | "system";
  content: string;
  feedback?: Feedback;
  timestamp: Date;
}

const VoiceInterview = () => {
  const { user, token } = useAuth() as any;
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<InterviewState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const roles = [
    { id: "senior_dev", label: "👨‍💻 Senior Developer" },
    { id: "junior_dev", label: "🎓 Junior Developer" },
    { id: "devops", label: "🚀 DevOps Engineer" },
    { id: "data_scientist", label: "📊 Data Scientist" },
    { id: "product_manager", label: "📱 Product Manager" },
    { id: "fullstack", label: "⚙️ Fullstack Developer" },
  ];

  useEffect(() => {
    setMounted(true);
    setupSpeechRecognition();

    // Force reload token from localStorage to ensure it's not stale
    const storedToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null;
    console.log(
      "Component mounted - Token from storage:",
      storedToken ? "EXISTS" : "MISSING",
    );

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Setup Web Speech API
  const setupSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after user stops speaking
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      console.log("Speech recognition started");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }

      console.log("Transcript:", finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        setTranscript("(No speech detected, please try again)");
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      console.log("Requesting camera access...");

      // Try with both audio and video
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });

        console.log("✓ Camera and microphone obtained");
        setVideoStream(stream);

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            console.log("✓ Video stream set to element");
          }
        }, 100);

        return;
      } catch (fullErr: any) {
        console.warn("Camera + audio failed, trying video only...", fullErr);

        // Fallback: try video only without audio
        const videoOnly = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });

        console.log("✓ Video obtained (audio unavailable)");
        setVideoStream(videoOnly);

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = videoOnly;
            console.log("✓ Video stream set to element");
          }
        }, 100);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      const errorMsg = err?.name || "Unknown error";

      if (errorMsg === "NotAllowedError") {
        alert(
          "❌ Camera/Microphone access denied.\n\n" +
            "1. Click the lock icon in the address bar\n" +
            "2. Allow Camera & Microphone\n" +
            "3. Reload the page (F5)\n" +
            "4. Try again",
        );
      } else if (errorMsg === "NotFoundError") {
        alert("❌ No camera found. Please connect a camera and try again.");
      } else {
        alert(
          `Camera error: ${errorMsg}. Please check your device and permissions.`,
        );
      }
    }
  };

  // Start Interview
  const startInterview = async (role: string) => {
    setSelectedRole(role);
    await initializeCamera();

    try {
      // Get fresh token from localStorage to avoid stale state
      const freshToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;

      console.log("Starting interview");
      console.log(
        "Fresh token from storage:",
        freshToken ? "EXISTS (length: " + freshToken.length + ")" : "MISSING",
      );
      console.log("Token from hook:", token ? "EXISTS" : "MISSING");
      console.log("API URL:", API_URL);
      console.log("Role:", role);

      if (!freshToken) {
        throw new Error(
          "Not authenticated - no token found. Please log in again.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/v1/interviews/start-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
          body: JSON.stringify({
            role,
            interview_type: "voice",
          }),
        },
      );

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            `API Error (${response.status}): ${errorData.detail || "Unknown error"}`,
          );
        } catch {
          throw new Error(
            `API Error (${response.status}): ${responseText || "No response body"}`,
          );
        }
      }

      const data = JSON.parse(responseText);
      console.log("Interview data received:", data);

      setState({
        sessionId: data.session_id,
        role,
        questionNumber: 1,
        totalQuestions: data.total_questions,
        currentQuestion: data.current_question.question_text,
        isListening: false,
        isProcessing: false,
        userAnswer: "",
        feedback: null,
        overallScore: 0,
        completed: false,
      });

      // Speak the first question
      speakQuestion(data.current_question.question_text);

      // Add question message
      setMessages([
        {
          id: "1",
          type: "question",
          content: data.current_question.question_text,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Interview error:", err);

      // If 401, prompt to re-login
      if (err instanceof Error && err.message.includes("401")) {
        if (window.confirm("Your session has expired. Please log in again.")) {
          window.location.href = "/login";
        }
        return;
      }

      alert("Error starting interview: " + err);
    }
  };

  // Text-to-Speech
  const speakQuestion = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      setIsSpeaking(false);
      // Automatically start listening after question is asked
      setTimeout(() => {
        startListening();
      }, 500);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Start Speech Recognition
  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition not available");
      return;
    }

    // Only start if not already recording
    if (isRecording) {
      console.log("Already recording, skipping start");
      return;
    }

    try {
      setTranscript("");
      console.log("Starting speech recognition...");
      recognitionRef.current.start();
    } catch (err: any) {
      console.error("Recognition start error:", err.message);
      // If recognition is already running, this error can be safely ignored
      if (err.message?.includes("already started")) {
        console.log("Recognition already running");
        return;
      }
    }
  };

  // Stop Listening and Submit Answer
  const stopListeningAndSubmit = async () => {
    // Stop speech recognition if still running
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        console.log("Speech recognition stopped");
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }

    // Validate transcript
    if (!transcript.trim()) {
      alert("Please say something before submitting");
      return;
    }

    // Validate state
    if (!state || !state.sessionId) {
      alert("Interview session not found");
      return;
    }

    setState((prev) => (prev ? { ...prev, isProcessing: true } : null));

    try {
      console.log("====== SUBMITTING ANSWER ======");
      console.log("Session ID:", state.sessionId);
      console.log("Question Number:", state.questionNumber);
      console.log("Total Questions:", state.totalQuestions);
      console.log("Answer:", transcript.substring(0, 50) + "...");
      console.log("==============================");

      // Get fresh token from localStorage
      const freshToken =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;

      if (!freshToken) {
        throw new Error(
          "Not authenticated - session expired. Please log in again.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/v1/interviews/sessions/${state.sessionId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
          body: JSON.stringify({
            question_id: state.questionNumber,
            user_answer: transcript,
            answer_type: "voice",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit answer");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Add user answer and feedback messages
      setMessages((prev) => [
        ...prev,
        {
          id: `answer-${state.questionNumber}`,
          type: "user_answer",
          content: transcript,
          timestamp: new Date(),
        },
        {
          id: `feedback-${state.questionNumber}`,
          type: "feedback",
          content: `Score: ${data.feedback?.score_out_of_10 || 0}/10`,
          feedback: data.feedback,
          timestamp: new Date(),
        },
      ]);

      // Check if interview is complete
      const isComplete =
        data.status === "interview_complete" ||
        !data.next_question ||
        state.questionNumber >= state.totalQuestions;

      if (isComplete) {
        console.log("Interview complete!");
        setState((prev) =>
          prev
            ? {
                ...prev,
                completed: true,
                isProcessing: false,
                feedback: data.feedback,
                overallScore: data.overall_score || data.score_so_far || 0,
              }
            : null,
        );
        setMessages((prev) => [
          ...prev,
          {
            id: "completed",
            type: "system",
            content: `Interview Completed! Overall Score: ${
              data.overall_score || data.score_so_far || 0
            }/10`,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Move to next question (only if there IS a next question)
        if (data.next_question) {
          setState((prev) =>
            prev
              ? {
                  ...prev,
                  questionNumber: prev.questionNumber + 1,
                  currentQuestion: data.next_question,
                  isProcessing: false,
                  feedback: data.feedback,
                  overallScore: data.score_so_far || prev.overallScore,
                }
              : null,
          );

          // Speak next question
          setTranscript(""); // Clear transcript for next question
          speakQuestion(data.next_question);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert(
        "Error processing answer: " +
          (err instanceof Error ? err.message : String(err)),
      );
      setState((prev) => (prev ? { ...prev, isProcessing: false } : null));
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Not Logged In</p>
          <p className="text-gray-600 mt-2">
            Please log in to access interviews.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Role Selection Screen
  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎤 Voice Interview Practice
            </h1>
            <p className="text-gray-600">
              Select a role and practice your interview with AI
            </p>
            {!token ? (
              <p className="text-red-600 mt-4 text-sm">
                ⚠️ Warning: Not authenticated (no token). Please log in first.
              </p>
            ) : (
              <p className="text-green-600 mt-4 text-sm">
                ✓ Authenticated as {user?.email || "User"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => startInterview(role.id)}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all border-2 border-gray-200 hover:border-blue-500"
              >
                <div className="text-3xl mb-2">{role.label.split(" ")[0]}</div>
                <div className="text-lg font-semibold text-gray-800">
                  {role.label.split(" ").slice(1).join(" ")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Interview Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">
              {state.role.toUpperCase()} Interview
            </h1>
            <p className="text-gray-400">
              Question {state.questionNumber} of {state.totalQuestions}
            </p>
          </div>
          <div className="text-white text-right">
            <p className="text-2xl font-bold text-cyan-400">
              Score: {state.overallScore}/10
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: Video Feed */}
          <div className="col-span-1">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover bg-gray-900"
              />
              <div className="bg-gray-800 p-4 text-white text-center">
                <p className="text-sm font-semibold">
                  {isRecording ? "🔴 Recording..." : "⚫ Ready"}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Interview Content */}
          <div className="col-span-2">
            {/* Current Question */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 mb-4 shadow-lg">
              <p className="text-white text-sm font-semibold mb-2">
                AI INTERVIEWER
              </p>
              <p className="text-white text-xl font-bold">
                {state.currentQuestion}
              </p>
              {isSpeaking && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-100"></div>
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-200"></div>
                  <span className="text-white text-sm">Asking question...</span>
                </div>
              )}
            </div>

            {/* User Transcript */}
            <div className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
              <p className="text-gray-400 text-sm font-semibold mb-2">
                YOUR ANSWER
              </p>
              <p className="text-white text-lg min-h-20">
                {transcript || (
                  <span className="text-gray-500 italic">
                    {isRecording
                      ? "🎤 Listening..."
                      : 'Click "Start Speaking" to begin'}
                  </span>
                )}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!isRecording && !state.isProcessing && !transcript && (
                <button
                  onClick={startListening}
                  disabled={state.isProcessing}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  🎤 Start Speaking
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopListeningAndSubmit}
                  disabled={state.isProcessing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  ⏹️ Stop & Submit
                </button>
              )}

              {!isRecording && transcript && !state.isProcessing && (
                <>
                  <button
                    onClick={() => {
                      setTranscript("");
                      startListening();
                    }}
                    disabled={state.isProcessing}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    🔄 Retry
                  </button>
                  <button
                    onClick={stopListeningAndSubmit}
                    disabled={state.isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    ✅ Submit Answer
                  </button>
                </>
              )}

              {state.isProcessing && (
                <div className="flex-1 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              )}
            </div>

            {/* Feedback Display */}
            {state.feedback && (
              <div className="mt-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 shadow-lg">
                <h3 className="text-white font-bold mb-4">Feedback</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black bg-opacity-30 p-3 rounded">
                    <p className="text-gray-300 text-sm">Technical Depth</p>
                    <p className="text-green-400 font-bold">
                      {state.feedback.technical_depth}
                    </p>
                  </div>
                  <div className="bg-black bg-opacity-30 p-3 rounded">
                    <p className="text-gray-300 text-sm">Communication</p>
                    <p className="text-green-400 font-bold">
                      {state.feedback.communication}
                    </p>
                  </div>
                  <div className="bg-black bg-opacity-30 p-3 rounded">
                    <p className="text-gray-300 text-sm">Problem Solving</p>
                    <p className="text-green-400 font-bold">
                      {state.feedback.problem_solving}
                    </p>
                  </div>
                  <div className="bg-black bg-opacity-30 p-3 rounded">
                    <p className="text-gray-300 text-sm">Confidence</p>
                    <p className="text-green-400 font-bold">
                      {state.feedback.confidence}
                    </p>
                  </div>
                </div>

                {/* Detailed Improvements Section */}
                {state.feedback.detailed_improvements &&
                  state.feedback.detailed_improvements.length > 0 && (
                    <div className="mb-6 bg-black bg-opacity-20 rounded-lg p-4">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span>📋</span> Areas for Improvement
                      </h4>
                      <div className="space-y-4">
                        {state.feedback.detailed_improvements.map(
                          (improvement, idx) => (
                            <div
                              key={idx}
                              className="bg-black bg-opacity-30 p-4 rounded border-l-4 border-yellow-400"
                            >
                              <p className="text-yellow-300 font-bold mb-2">
                                {improvement.field}
                              </p>
                              <p className="text-gray-300 text-sm mb-2">
                                <span className="font-semibold">
                                  Current Level:
                                </span>{" "}
                                {improvement.current_level}
                              </p>
                              <p className="text-gray-300 text-sm mb-3">
                                <span className="font-semibold">
                                  What to Improve:
                                </span>{" "}
                                {improvement.what_to_improve}
                              </p>
                              <div className="ml-4">
                                <p className="text-gray-400 text-sm font-semibold mb-2">
                                  Specific Actions:
                                </p>
                                <ul className="space-y-1">
                                  {improvement.specific_actions.map(
                                    (action, actionIdx) => (
                                      <li
                                        key={actionIdx}
                                        className="text-cyan-300 text-sm flex items-start gap-2"
                                      >
                                        <span className="mt-1">✓</span>
                                        <span>{action}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-4 text-center">
                  <p className="text-white text-sm">Score this question</p>
                  <p className="text-3xl font-bold text-yellow-300">
                    {state.feedback.score_out_of_10}/10
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Screen */}
        {state.completed && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Interview Complete! 🎉
              </h2>
              <p className="text-6xl font-bold text-yellow-300 mb-4 text-center">
                {state.overallScore}/10
              </p>
              <p className="text-white text-lg mb-6 text-center">
                {state.overallScore >= 8
                  ? "STRONG HIRE! 🌟"
                  : state.overallScore >= 6
                    ? "GOOD FIT! ✅"
                    : "NEEDS IMPROVEMENT 📈"}
              </p>

              {/* Summary Improvements from Overall Feedback */}
              {state.feedback &&
                state.feedback.detailed_improvements &&
                state.feedback.detailed_improvements.length > 0 && (
                  <div className="mb-6 bg-black bg-opacity-30 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <span>📋</span> Key Areas to Focus On
                    </h3>
                    <div className="space-y-3">
                      {state.feedback.detailed_improvements.map((imp, idx) => (
                        <div
                          key={idx}
                          className="bg-black bg-opacity-20 p-3 rounded border-l-4 border-yellow-400"
                        >
                          <p className="text-yellow-300 font-semibold text-sm">
                            {imp.field}
                          </p>
                          <p className="text-gray-200 text-xs mt-1">
                            {imp.what_to_improve}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {imp.specific_actions
                              .slice(0, 2)
                              .map((act, aidx) => (
                                <li
                                  key={aidx}
                                  className="text-cyan-300 text-xs flex items-start gap-1"
                                >
                                  <span>→</span> <span>{act}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all"
              >
                Try Another Role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
