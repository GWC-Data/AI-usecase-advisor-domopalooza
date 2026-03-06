import React, { useState, useEffect } from "react";
import {
  startSupportWorkflow,
  waitForWorkflowCompletion,
  getSupportTicket,
} from "./api/startWorkflow";
import gwcLogo from "./assert/gwc-logo.png";
import domoLogo from "./assert/domopalooza-logo.svg";
import toast, { Toaster } from "react-hot-toast";

// Celebration Blast Component - GUARANTEED WORKING VERSION
const CelebrationBlast = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create 200 small particles for dense burst effect
    const newParticles = Array.from({ length: 200 }, (_, i) => {
      // Determine if particle comes from bottom left or bottom right corner
      const side = Math.random() > 0.5 ? "left" : "right";

      // Small size range (3-12px)
      const size = Math.random() * 9 + 3; // 3-12px

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 50; // 50-200px

      // Calculate translation
      const tx = Math.cos(angle) * distance;
      const ty = -Math.abs(Math.sin(angle) * distance) - 20; // Always go upward

      return {
        id: i,
        side,
        // Position at bottom corners
        left: side === "left" ? 0 : "100%",
        bottom: 0,
        size: `${size}px`,
        color: [
          "#FBBF24",
          "#F97316",
          "#1E3A8A",
          "#3B82F6",
          "#10B981",
          "#EC4899",
          "#8B5CF6",
          "#EF4444",
          "#F59E0B",
          "#6366F1",
          "#06B6D4",
          "#84CC16",
          "#D946EF",
          "#F43F5E",
          "#14B8A6",
          "#A855F7",
          "#F472B6",
          "#60A5FA",
          "#FBBF24",
          "#F97316",
          "#1E3A8A",
          "#3B82F6",
        ][Math.floor(Math.random() * 22)],
        animationDuration: `${Math.random() * 1.5 + 0.8}s`, // 0.8-2.3 seconds
        animationDelay: `${Math.random() * 0.2}s`,
        rotation: Math.random() * 720,
        tx: tx,
        ty: ty,
        shape: Math.random() > 0.5 ? "circle" : "square",
        opacity: Math.random() * 0.4 + 0.6,
      };
    });

    setParticles(newParticles);

    // Remove particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 9999 }}>
      <style>
        {`
          @keyframes blastAnimation {
            0% {
              transform: scale(0) rotate(0deg) translate(0, 0);
              opacity: 1;
            }
            20% {
              transform: scale(1.3) rotate(180deg) translate(var(--tx, 50px), var(--ty, -50px));
              opacity: 1;
            }
            40% {
              transform: scale(1.1) rotate(270deg) translate(calc(var(--tx, 50px) * 1.5), calc(var(--ty, -50px) * 1.3));
              opacity: 0.9;
            }
            60% {
              transform: scale(0.9) rotate(360deg) translate(calc(var(--tx, 50px) * 1.8), calc(var(--ty, -50px) * 1.6));
              opacity: 0.7;
            }
            80% {
              transform: scale(0.6) rotate(450deg) translate(calc(var(--tx, 50px) * 2), calc(var(--ty, -50px) * 1.9));
              opacity: 0.4;
            }
            100% {
              transform: scale(0) rotate(540deg) translate(calc(var(--tx, 50px) * 2.2), calc(var(--ty, -50px) * 2.2));
              opacity: 0;
            }
          }
        `}
      </style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.left,
            bottom: particle.bottom,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            animation: `blastAnimation ${particle.animationDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: particle.animationDelay,
            borderRadius: particle.shape === "circle" ? "50%" : "2px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            border: "none",
            opacity: particle.opacity,
            ["--tx"]: particle.tx + "px",
            ["--ty"]: particle.ty + "px",
            willChange: "transform, opacity",
            transform: "translateZ(0)", // Force hardware acceleration
          }}
        />
      ))}
    </div>
  );
};

function App() {
  // Form State - Only name, email, usecase
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [usecase, setUsecase] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loopTimer, setLoopTimer] = useState(null);

  // Effect to handle looping back to submit after completion (only for workflow, not popup)
  useEffect(() => {
    if (workflowStatus === "COMPLETED" && !loading) {
      if (loopTimer) clearTimeout(loopTimer);

      const timer = setTimeout(() => {
        setWorkflowStatus(null);
        setFormSubmitted(false);
      }, 5000);

      setLoopTimer(timer);
    }

    return () => {
      if (loopTimer) clearTimeout(loopTimer);
    };
  }, [workflowStatus, loading]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!usecase.trim()) {
      newErrors.usecase = "Issue description is required";
    } else if (usecase.trim().length < 10) {
      newErrors.usecase = "Describe the issue in at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setWorkflowStatus("IN_PROGRESS");
    setFormSubmitted(true);

    const requestId = crypto.randomUUID();

    try {
      const res = await startSupportWorkflow({
        customerName,
        email,
        devEmail: "hariharan.pappannan@gwcdata.ai",
        usecase,
        requestId,
      });

      const workflowInstanceId = res.id;

      const submittedData = {
        name: customerName,
        email,
        usecase,
      };

      setCustomerName("");
      setEmail("");
      setUsecase("");
      setErrors({});

      await waitForWorkflowCompletion(workflowInstanceId);

      const doc = await getSupportTicket(requestId);

      const agentResult = doc?.content?.agentResult;

      setWorkflowStatus("COMPLETED");

      setResult({
        ...submittedData,
        status: "COMPLETED",
        agentResult,
        message:
          "Thank you for your submission! We've sent the AI analysis results to your email. Our team will review it and contact you soon with personalized recommendations.",
      });

      setShowPopup(true);
    } catch (err) {
      console.error(err);

      setWorkflowStatus("FAILED");

      setResult({
        name: customerName,
        email,
        usecase,
        status: "FAILED",
        agentResult: "AI analysis failed.",
        message: "Something went wrong. Our team will contact you shortly.",
      });

      setShowPopup(true);
    }

    setLoading(false);
  };

  // Handle manual popup close
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Determine which dot should blink
  const getDotStatus = (step) => {
    if (!formSubmitted) {
      return step === 1 ? "bg-[#FBBF24] animate-pulse" : "bg-gray-300";
    }

    if (workflowStatus === "IN_PROGRESS") {
      if (step === 1) return "bg-green-500";
      if (step === 2) return "bg-[#FBBF24] animate-pulse";
      if (step === 3) return "bg-gray-300";
    }

    if (workflowStatus === "COMPLETED") {
      if (step === 1) return "bg-green-500";
      if (step === 2) return "bg-green-500";
      if (step === 3) return "bg-green-500 animate-pulse";
    }

    return step === 1 ? "bg-[#FBBF24]" : "bg-gray-300";
  };

  // Determine status message based on workflow status
  const getStatusMessage = () => {
    if (!workflowStatus) return "Starting workflow...";

    switch (workflowStatus) {
      case "IN_PROGRESS":
        return `AI agent analyzing your request...`;
      case "COMPLETED":
        return "Analysis complete! Resetting in 5 seconds...";
      case "FAILED":
        return "Processing issue detected. Please wait...";
      default:
        return `Processing...`;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
          
          .animate-progress {
            animation: progress 5s linear forwards;
          }
        `}
      </style>

      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Logos Section */}
          <div className="flex justify-between items-center mb-6 p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg p-1 shadow-xs">
                <img
                  src={gwcLogo}
                  alt="GWC"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg p-1 shadow-xs">
                <img
                  src={domoLogo}
                  alt="DomoPalooza"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Side - Branding */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A1E3C] leading-tight">
                Describe Your Use Case,
                <span className="block text-[#1E3A8A]">
                  Get AI-Powered Guidance
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Share your requirement or use case with us. Our AI agent will
                analyze your request and generate insights. Our team will review
                the analysis and send you
                <span className="font-semibold text-[#1E3A8A]">
                  {" "}
                  personalized recommendations
                </span>{" "}
                directly to your email.
              </p>

              {/* Process flow with enhanced dot indicators */}
              <div className="bg-white rounded-xl p-5 border border-[#1E3A8A]/10 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A8A] to-[#0A1E3C] rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0A1E3C]">
                        AI Analysis Workflow
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Real-time status indicator
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400">Status:</span>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${getDotStatus(1)}`}></span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${getDotStatus(2)}`}></span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${getDotStatus(3)}`}></span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-medium ${
                          !formSubmitted
                            ? "text-[#FBBF24]"
                            : workflowStatus === "COMPLETED"
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}>
                        Submit
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          !formSubmitted
                            ? "bg-[#FBBF24] animate-pulse"
                            : "bg-green-500"
                        }`}></span>
                    </div>
                    <span className="text-[#1E3A8A] text-lg font-bold">→</span>
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-medium ${
                          workflowStatus === "IN_PROGRESS"
                            ? "text-[#FBBF24]"
                            : workflowStatus === "COMPLETED"
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}>
                        AI Analysis
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          workflowStatus === "IN_PROGRESS"
                            ? "bg-[#FBBF24] animate-pulse"
                            : workflowStatus === "COMPLETED"
                              ? "bg-green-500"
                              : "bg-gray-300"
                        }`}></span>
                    </div>
                    <span className="text-[#1E3A8A] text-lg font-bold">→</span>
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-medium ${
                          workflowStatus === "COMPLETED"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        Email Sent
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          workflowStatus === "COMPLETED"
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-300"
                        }`}></span>
                    </div>
                  </div>
                </div>

                {workflowStatus === "COMPLETED" && (
                  <div className="mt-3 text-center">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FBBF24] to-[#1E3A8A] animate-progress"
                        style={{
                          animation: "progress 5s linear forwards",
                        }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Returning to submit in 5 seconds...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Form Card */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-[#1E3A8A]/10 p-8">
              {/* Form Header */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#FBBF24]/30">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-[#0A1E3C] rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-base">AI</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1E3C]">
                    AI Support Portal
                  </h2>
                  <p className="text-sm text-gray-500">
                    Get expert help for your use case
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                      Full Name <span className="text-[#FBBF24]">*</span>
                    </label>
                    <input
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? "border-red-300 bg-red-50 focus:ring-red-200"
                          : "border-gray-200 hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20"
                      }`}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                      Email <span className="text-[#FBBF24]">*</span>
                    </label>
                    <input
                      placeholder="john@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-300 bg-red-50 focus:ring-red-200"
                          : "border-gray-200 hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Usecase Field */}
                <div>
                  <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                    Your Use Case <span className="text-[#FBBF24]">*</span>
                  </label>
                  <textarea
                    placeholder="Tell us about the AI agent you want to build..."
                    value={usecase}
                    onChange={(e) => setUsecase(e.target.value)}
                    disabled={loading}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                      errors.usecase
                        ? "border-red-300 bg-red-50 focus:ring-red-200"
                        : "border-gray-200 hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20"
                    }`}
                  />
                  {errors.usecase && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.usecase}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Minimum 10 characters. Be specific about your requirements.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={submitRequest}
                  disabled={loading || workflowStatus === "COMPLETED"}
                  className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0A1E3C] hover:from-[#0A1E3C] hover:to-[#1E3A8A] text-white font-semibold py-3.5 px-4 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : workflowStatus === "COMPLETED" ? (
                    "Resetting..."
                  ) : (
                    "Submit Request"
                  )}
                </button>

                {/* Progress Bar */}
                {loading && workflowStatus === "IN_PROGRESS" && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FBBF24] to-[#F97316] animate-pulse"
                        style={{ width: "100%" }}></div>
                    </div>
                    <p className="text-center text-xs text-[#1E3A8A] mt-2">
                      ⚡ {getStatusMessage()}
                    </p>
                  </div>
                )}

                {/* Trust Badge */}
                <p className="text-xs text-gray-400 text-center pt-3 flex items-center justify-center">
                  <span className="text-[#1E3A8A] mr-1">🔒</span>
                  Your information is secure. We'll never share your details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Popup */}
      {showPopup && result && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-2xl transform animate-slideUp border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            {/* Bottom Corner Paper Burst - Only show for completed status */}
            {result.status === "COMPLETED" && <CelebrationBlast />}

            {/* Header */}
            <div className="relative sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#1E3A8A] rounded-t-2xl"></div>
              <div className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden ${
                        result.status === "COMPLETED"
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : "bg-gradient-to-br from-[#1E3A8A] to-[#0A1E3C]"
                      }`}>
                      <span className="text-3xl relative z-10">
                        {result.status === "COMPLETED" ? "🎉" : "✓"}
                      </span>
                      {result.status === "COMPLETED" && (
                        <>
                          <div className="absolute inset-0 animate-ping bg-white opacity-30 rounded-lg"></div>
                          <div className="absolute -inset-2 bg-yellow-300 opacity-20 blur-xl animate-pulse"></div>
                        </>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0A1E3C]">
                        {result.status === "COMPLETED"
                          ? "Analysis Completed!"
                          : "Request Received!"}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
              {/* Details Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                  <span className="w-1 h-3 bg-[#FBBF24] rounded-full mr-1.5"></span>
                  Submission Details
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-20 flex items-center text-gray-500 font-medium text-sm">
                      <span className="text-[#1E3A8A] mr-1.5 text-sm">👤</span>
                      <span>Name:</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg px-3 py-1.5 border border-gray-100 text-gray-900 text-sm">
                        {result.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-20 flex items-center text-gray-500 font-medium text-sm">
                      <span className="text-[#1E3A8A] mr-1.5 text-sm">📧</span>
                      <span>Email:</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg px-3 py-1.5 border border-gray-100 text-gray-900 text-sm break-all">
                        {result.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-20 flex items-center text-gray-500 font-medium text-sm pt-1">
                      <span className="text-[#1E3A8A] mr-1.5 text-sm">📋</span>
                      <span>Use Case:</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg px-3 py-2 border border-gray-100 text-gray-800 text-sm max-h-24 overflow-y-auto">
                        <p className="leading-relaxed">{result.usecase}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-20 flex items-center text-gray-500 font-medium text-sm">
                      <span className="text-[#1E3A8A] mr-1.5 text-sm">⚡</span>
                      <span>Status:</span>
                    </div>
                    <div className="flex-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          result.status === "COMPLETED"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-[#FBBF24]/20 text-[#0A1E3C] border border-[#FBBF24]/30"
                        }`}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-green-500 animate-pulse `}></span>
                        OPEN
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Agent Result Card */}
              {result.agentResult && (
                <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0A1E3C]/5 rounded-xl p-4 mb-4 border-l-4 border-[#FBBF24]">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0A1E3C] text-sm mb-2 flex items-center">
                        AI Agent Analysis
                        <span
                          className={`ml-2 px-2 py-0.5 text-[10px] rounded-full border ${
                            result.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-[#FBBF24]/20 text-[#0A1E3C] border-[#FBBF24]/30"
                          }`}>
                          {result.status === "COMPLETED"
                            ? "COMPLETED"
                            : "PROCESSING"}
                        </span>
                      </h4>
                      <div className="bg-white rounded-lg p-3 border border-[#FBBF24]/20 shadow-sm">
                        <div className="text-sm text-gray-700 space-y-1">
                          {Array.isArray(result.agentResult) ? (
                            <ul className="list-disc pl-4 space-y-1">
                              {result.agentResult.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          ) : typeof result.agentResult === "object" ? (
                            <div className="space-y-2">
                              {Object.entries(result.agentResult).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="border-b border-gray-100 pb-1 last:border-0">
                                    <span className="font-medium text-[#1E3A8A] capitalize">
                                      {key}:
                                    </span>{" "}
                                    <span>
                                      {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : value}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {result.agentResult}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Card */}
              <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0A1E3C]/5 rounded-xl p-4 mb-4 border-l-4 border-[#FBBF24]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">📧</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
