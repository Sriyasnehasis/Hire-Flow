"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Feedback {
  technical_depth: string;
  communication: string;
  problem_solving: string;
  confidence: string;
  score_out_of_10: number;
}

interface Question {
  question_id: string;
  question_text: string;
  difficulty: string;
  category: string;
  tts_audio_url: string;
}

interface InterviewSession {
  session_id: string;
  role: string;
  total_questions: number;
  question_number?: number;
  current_question?: Question;
}

interface Message {
  id: string;
  type: "question" | "answer" | "feedback" | "system";
  content: string;
  feedback?: Feedback;
  timestamp: Date;
}

export default function InterviewChat() {
  const { user, token } = useAuth() as any;
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenSharing, setScreenSharing] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize WebRTC connection
  const initializeWebRTC = async () => {
    try {
      // Get user video/audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302"] },
          { urls: ["stun:stun1.l.google.com:19302"] },
        ],
      });

      peerConnection.addTrack(stream.getAudioTracks()[0], stream);
      peerConnection.addTrack(stream.getVideoTracks()[0], stream);

      peerConnectionRef.current = peerConnection;

      // Create and send offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await peerConnection.setLocalDescription(offer);

      // Send offer to backend
      if (session) {
        const offerResponse = await fetch(
          `${API_URL}/api/v1/interviews/sessions/${session.session_id}/rtc-offer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              offer: peerConnection.localDescription,
              video_enabled: videoEnabled,
              audio_enabled: audioEnabled,
            }),
          },
        );

        if (!offerResponse.ok) {
          console.error("Failed to send WebRTC offer");
        }
      }
    } catch (error) {
      console.error("WebRTC initialization error:", error);
      // Fall back to text-only interview
      addSystemMessage(
        "Camera/Microphone access denied. Using text-only mode.",
      );
    }
  };

  const startLiveInterview = async (role: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/v1/interviews/start-live-interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        },
      );

      if (!response.ok) throw new Error("Failed to start interview");

      const data = await response.json();

      setSession({
        session_id: data.session_id,
        role: data.role,
        total_questions: data.total_questions,
        question_number: 1,
        current_question: data.first_question,
      });

      setCurrentQuestion(data.first_question);
      setSessionActive(true);
      setQuestionsAnswered(0);

      // Initialize WebRTC
      await initializeWebRTC();

      // Add first question message
      addQuestionMessage(data.first_question);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  const addQuestionMessage = (question: Question) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        type: "question",
        content: question.question_text,
        timestamp: new Date(),
      },
    ]);
  };

  const addSystemMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        type: "system",
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const submitAnswer = async () => {
    if (!inputValue.trim() || !session) return;

    setLoading(true);
    const answerText = inputValue;

    try {
      // Add user's answer to chat
      const answerMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "answer",
        content: answerText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, answerMessage]);
      setInputValue("");

      // Submit to API with real-time feedback
      const response = await fetch(
        `${API_URL}/api/v1/interviews/sessions/${session.session_id}/submit-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answer_text: answerText,
            duration_seconds: 0,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      const data = await response.json();

      // Add real-time feedback message
      const feedbackMessage: Message = {
        id: `feedback-${Date.now()}`,
        type: "feedback",
        content: `Score: ${data.feedback.score_out_of_10}/10`,
        feedback: data.feedback,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);

      // Update overall score
      setOverallScore(data.score_so_far);
      setQuestionsAnswered(data.questions_answered);

      // Add next question if available
      if (!data.interview_complete && data.next_question) {
        setTimeout(() => {
          addQuestionMessage(data.next_question);
          setCurrentQuestion(data.next_question);
        }, 2000); // 2 second delay for reviewing feedback
      } else if (data.interview_complete) {
        // Fetch final report
        setTimeout(() => {
          endInterview();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      addSystemMessage(
        "Error submitting answer. Please try again or refresh the page.",
      );
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (!session) return;

    try {
      const response = await fetch(
        `${API_URL}/api/v1/interviews/sessions/${session.session_id}/end-interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to get interview report");

      const data = await response.json();
      const report = data.report;

      setSessionActive(false);

      // Add completion message with report summary
      addSystemMessage(
        `🎉 Interview Complete!\n\nOverall Score: ${report.overall_score}/10 (${report.score_rating})\nDuration: ${report.duration_minutes} minutes\nRecommendation: ${report.recommendation}`,
      );
    } catch (error) {
      console.error("Error ending interview:", error);
      addSystemMessage("Error generating interview report.");
    }
  };

  const toggleScreenShare = async () => {
    if (!session) return;

    try {
      const response = await fetch(
        `${API_URL}/api/v1/interviews/sessions/${session.session_id}/screen-share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ enabled: !screenSharing }),
        },
      );

      if (!response.ok) throw new Error("Failed to toggle screen share");

      setScreenSharing(!screenSharing);
      addSystemMessage(
        screenSharing ? "Screen sharing disabled" : "Screen sharing enabled",
      );
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const toggleVideo = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to start an interview
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Role selection screen
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
              🎥 LIVE AI INTERVIEW
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              One-on-One with AI
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time video interview with instant feedback
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select Interview Role
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { role: "Junior Developer", emoji: "👨‍💻" },
                { role: "Senior Developer", emoji: "👴" },
                { role: "DevOps Engineer", emoji: "🔧" },
                { role: "Data Scientist", emoji: "📊" },
                { role: "Product Manager", emoji: "📱" },
                { role: "Fullstack Developer", emoji: "🌐" },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => startLiveInterview(item.role)}
                  disabled={loading}
                  className="group relative overflow-hidden p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-transparent hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <div className="relative text-4xl mb-2">{item.emoji}</div>
                  <div className="font-bold text-gray-900 group-hover:text-indigo-600">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    5 questions • ~10 mins
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-2">🎥</div>
              <h3 className="font-bold text-gray-900 mb-2">Live Video</h3>
              <p className="text-sm text-gray-600">
                Full HD video with your webcam
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">
                Real-time Feedback
              </h3>
              <p className="text-sm text-gray-600">
                Instant AI analysis after each answer
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Scoring</h3>
              <p className="text-sm text-gray-600">
                AI-powered interview scoring
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 mb-3">
              💡 Interview Tips
            </h3>
            <ul className="text-indigo-800 text-sm space-y-2">
              <li>✓ Make sure your webcam and microphone are working</li>
              <li>✓ Find a quiet, well-lit environment</li>
              <li>✓ Think before you speak - structure your answer</li>
              <li>✓ Use specific examples from your experience</li>
              <li>✓ You can screen share to show your work if needed</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Live interview screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-cyan-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-indigo-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">{session.role}</h1>
            <p className="text-sm text-indigo-300">
              Question {questionsAnswered + 1} of {session.total_questions}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {overallScore.toFixed(1)}/10
              </div>
              <div className="text-xs text-gray-400">Current Score</div>
            </div>
            <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all"
                style={{
                  width: `${((questionsAnswered + 1) / session.total_questions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 h-screen flex flex-col gap-4">
        {/* Video and Main Area */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Main Interview Area */}
          <div className="flex-1 flex flex-col bg-black rounded-xl overflow-hidden border border-indigo-500/20">
            {/* Question Display */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-black">
              {currentQuestion ? (
                <div className="text-center max-w-2xl">
                  <div className="text-sm uppercase tracking-wider text-indigo-400 mb-4">
                    Question {questionsAnswered + 1}
                  </div>
                  <p className="text-3xl font-bold text-white mb-6">
                    {currentQuestion.question_text}
                  </p>
                  <div className="flex gap-4 justify-center text-sm">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">
                      {currentQuestion.category}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading question...</div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-gray-900 border-t border-gray-700 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.type === "question" && (
                    <div className="flex justify-center">
                      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 max-w-2xl">
                        <div className="text-xs uppercase font-bold text-indigo-400 mb-2">
                          Question
                        </div>
                        <p className="text-white">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === "answer" && (
                    <div className="flex justify-end">
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 max-w-2xl">
                        <div className="text-xs uppercase font-bold text-cyan-400 mb-2">
                          Your Answer
                        </div>
                        <p className="text-white">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === "feedback" && msg.feedback && (
                    <div className="flex justify-start">
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 max-w-2xl w-full">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs uppercase font-bold text-purple-400">
                            AI Feedback
                          </div>
                          <div className="text-lg font-bold text-purple-400">
                            {msg.feedback.score_out_of_10}/10
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                          <div>
                            <span className="text-purple-400 font-bold">
                              Technical:
                            </span>{" "}
                            {msg.feedback.technical_depth}
                          </div>
                          <div>
                            <span className="text-purple-400 font-bold">
                              Communication:
                            </span>{" "}
                            {msg.feedback.communication}
                          </div>
                          <div>
                            <span className="text-purple-400 font-bold">
                              Problem-solving:
                            </span>{" "}
                            {msg.feedback.problem_solving}
                          </div>
                          <div>
                            <span className="text-purple-400 font-bold">
                              Confidence:
                            </span>{" "}
                            {msg.feedback.confidence}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === "system" && (
                    <div className="flex justify-center">
                      <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 max-w-2xl">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Right Sidebar - Video & Controls */}
          <div className="w-80 flex flex-col gap-4">
            {/* Your Video Feed */}
            <div className="bg-black rounded-xl overflow-hidden border border-indigo-500/20 flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                You
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700">
              <div className="space-y-3">
                {/* Video/Audio Toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleVideo}
                    className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                      videoEnabled
                        ? "bg-indigo-500 text-white"
                        : "bg-red-600/50 text-white"
                    }`}
                  >
                    {videoEnabled ? "🎥 Video ON" : "🎥 Video OFF"}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                      audioEnabled
                        ? "bg-indigo-500 text-white"
                        : "bg-red-600/50 text-white"
                    }`}
                  >
                    {audioEnabled ? "🎤 Audio ON" : "🎤 Audio OFF"}
                  </button>
                </div>

                {/* Screen Share */}
                <button
                  onClick={toggleScreenShare}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                    screenSharing
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {screenSharing ? "📺 Sharing Screen" : "📺 Share Screen"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Input Area */}
        {sessionActive && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700">
            <div className="flex gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                placeholder="Type your answer here... (Ctrl+Enter to submit)"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                rows={2}
              />
              <button
                onClick={submitAnswer}
                disabled={loading || !inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Submit"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Ctrl+Enter to submit your answer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
