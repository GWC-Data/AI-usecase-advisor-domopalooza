import React, { useState, useEffect } from "react";
import gwcLogo from "./assert/gwc-logo.png";
import domoLogo from "./assert/domopalooza-logo.svg";
import { Toaster } from "react-hot-toast";
import { submitSupportRequest } from "./api/supportApi";

// ConfettiPartyPopper - Drop-in replacement for the existing component
// Large dual-cannon blast from bottom-left and bottom-right corners of the popup

const ConfettiPartyPopper = () => {
  const [confetti, setConfetti] = React.useState([]);

  React.useEffect(() => {
    const colors = [
      "#FFD700",
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#FF8C42",
      "#A06B9A",
      "#FFB347",
      "#5F9EA0",
      "#FF69B4",
      "#00CED1",
      "#FF1493",
      "#32CD32",
      "#FF4500",
      "#9370DB",
      "#FFDAB9",
      "#98FB98",
      "#FFB6C1",
      "#87CEEB",
      "#F0E68C",
      "#DDA0DD",
      "#FFF44F",
      "#FF3CAC",
      "#00F5FF",
      "#ADFF2F",
      "#FF6EC7",
    ];

    // Generate 180 pieces per side = 360 total for a massive blast
    const pieces = [];

    ["left", "right"].forEach((side) => {
      for (let i = 0; i < 180; i++) {
        // Shape variety: streamer, circle, square, triangle-ish
        const shapeRoll = Math.random();
        let width, height, borderRadius, isStreamer;

        if (shapeRoll < 0.35) {
          // Long streamers
          width = `${Math.random() * 10 + 6}px`;
          height = `${Math.random() * 5 + 2}px`;
          borderRadius = "1px";
          isStreamer = true;
        } else if (shapeRoll < 0.6) {
          // Circles
          const s = Math.random() * 10 + 5;
          width = `${s}px`;
          height = `${s}px`;
          borderRadius = "50%";
          isStreamer = false;
        } else if (shapeRoll < 0.8) {
          // Squares
          const s = Math.random() * 10 + 5;
          width = `${s}px`;
          height = `${s}px`;
          borderRadius = "2px";
          isStreamer = false;
        } else {
          // Wide flat pieces
          width = `${Math.random() * 14 + 8}px`;
          height = `${Math.random() * 6 + 3}px`;
          borderRadius = "3px";
          isStreamer = false;
        }

        // LEFT cannon: fires up and to the right (0° to 80°)
        // RIGHT cannon: fires up and to the left (100° to 180°)
        let angle;
        if (side === "left") {
          angle = (Math.random() * 85 + 15) * (Math.PI / 180); // 15°–100° from horizontal
        } else {
          angle = (Math.random() * 85 + 95) * (Math.PI / 180); // 95°–180°
        }

        const distance = Math.random() * 320 + 180; // 180–500px — LARGE blast radius

        // tx/ty are the full travel distance
        const tx = Math.cos(angle) * distance;
        const ty = -Math.abs(Math.sin(angle) * distance); // always upward

        pieces.push({
          id: `${side}-${i}`,
          side,
          width,
          height,
          borderRadius,
          isStreamer,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: `${Math.random() * 1.4 + 1.1}s`, // 1.1–2.5s
          delay: `${Math.random() * 0.35}s`, // slight stagger
          tx,
          ty,
          finalRotation: Math.random() * 900 + 360, // 360–1260° spin
          opacity: Math.random() * 0.3 + 0.7,
        });
      }
    });

    setConfetti(pieces);

    const timer = setTimeout(() => setConfetti([]), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 9999,
      }}>
      <style>{`
        @keyframes cwBlast {
          0% {
            transform: scale(0) rotate(0deg) translate(0px, 0px);
            opacity: 1;
          }
          15% {
            opacity: 1;
          }
          30% {
            transform: scale(1.2) rotate(calc(var(--rot) * 0.3deg))
              translate(calc(var(--tx) * 0.4px), calc(var(--ty) * 0.4px));
            opacity: 1;
          }
          55% {
            transform: scale(1.0) rotate(calc(var(--rot) * 0.6deg))
              translate(calc(var(--tx) * 0.75px), calc(var(--ty) * 0.75px));
            opacity: 0.85;
          }
          75% {
            transform: scale(0.85) rotate(calc(var(--rot) * 0.82deg))
              translate(calc(var(--tx) * 0.9px), calc(var(--ty) * 0.9px));
            opacity: 0.55;
          }
          90% {
            opacity: 0.25;
          }
          100% {
            transform: scale(0.2) rotate(calc(var(--rot) * 1deg))
              translate(calc(var(--tx) * 1px), calc(var(--ty) * 1px));
            opacity: 0;
          }
        }

        @keyframes cwBlastStreamer {
          0% {
            transform: scale(0) rotate(0deg) translate(0px, 0px);
            opacity: 1;
          }
          25% {
            transform: scale(1.3) rotate(calc(var(--rot) * 0.25deg))
              translate(calc(var(--tx) * 0.35px), calc(var(--ty) * 0.35px));
            opacity: 1;
          }
          60% {
            transform: scaleX(1.8) scaleY(0.6) rotate(calc(var(--rot) * 0.65deg))
              translate(calc(var(--tx) * 0.78px), calc(var(--ty) * 0.78px));
            opacity: 0.8;
          }
          85% {
            opacity: 0.4;
          }
          100% {
            transform: scaleX(0.3) scaleY(0.3) rotate(calc(var(--rot) * 1deg))
              translate(calc(var(--tx) * 1px), calc(var(--ty) * 1px));
            opacity: 0;
          }
        }
      `}</style>

      {confetti.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            // Pin to the bottom corners
            bottom: "0px",
            left: p.side === "left" ? "0px" : undefined,
            right: p.side === "right" ? "0px" : undefined,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            opacity: p.opacity,
            boxShadow: `0 0 6px ${p.color}88`,
            animation: `${p.isStreamer ? "cwBlastStreamer" : "cwBlast"} ${p.duration} cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay} forwards`,
            // CSS custom properties for the keyframe math
            "--tx": p.tx,
            "--ty": p.ty,
            "--rot": p.finalRotation,
            willChange: "transform, opacity",
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
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Effect to handle looping back to submit after completion (only for workflow, not popup)
  useEffect(() => {
    if (workflowStatus === "COMPLETED" && !loading) {
      const timer = setTimeout(() => {
        setWorkflowStatus(null);
        setFormSubmitted(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [workflowStatus, loading]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Please enter your full name";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Please enter your company name";
    }

    if (!businessType.trim()) {
      newErrors.businessType = "Please select a business type";
    }

    if (!usecase.trim()) {
      newErrors.usecase = "Please describe your use case";
    } else if (usecase.trim().length < 10) {
      newErrors.usecase = "Please describe your use case in detail";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setWorkflowStatus("IN_PROGRESS");
    setFormSubmitted(true);

    try {
      const res = await submitSupportRequest({
        customerName,
        email,
        companyName,
        businessType,
        usecase,
      });

      const submittedData = {
        name: customerName,
        email,
        companyName,
        businessType,
        usecase,
      };

      setCustomerName("");
      setEmail("");
      setUsecase("");
      setCompanyName("");
      setBusinessType("");
      setErrors({});

      setWorkflowStatus("COMPLETED");

      setResult({
        ...submittedData,
        status: "COMPLETED",
        agentResult: res.agentResult,
        message:
          "Thank you for your submission. The AI analysis has been sent to your email. Our team will review it and contact you soon.",
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
        message: "Something went wrong. Please try again.",
      });

      setShowPopup(true);
    }

    setLoading(false);
  };

  // Handle manual popup close
  const handleClosePopup = () => {
    setShowPopup(false);
    setWorkflowStatus(null);
    setFormSubmitted(false);
    setResult(null);
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Logos Section */}
          <div className="flex justify-between items-center mb-6 p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg p-1 shadow-xs">
                <img
                  src={gwcLogo}
                  alt="GWC"
                  className="w-[150px] md:w-[200px] object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg p-1 shadow-xs">
                <img
                  src={domoLogo}
                  alt="DomoPalooza"
                  className="w-[150px] md:w-[200px] object-contain"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                      Full Name <span className="text-[#FBBF24]">*</span>
                    </label>
                    <input
                      placeholder="Enter your full name"
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
                      placeholder="Enter your email"
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

                {/* Company Name + Business Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                      Company Name <span className="text-[#FBBF24]">*</span>
                    </label>
                    <input
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.companyName
                          ? "border-red-300 bg-red-50 focus:ring-red-200"
                          : "border-gray-200 hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A1E3C] mb-1.5">
                      Business Type <span className="text-[#FBBF24]">*</span>
                    </label>
                    <input
                      placeholder="Enter your business type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.businessType
                          ? "border-red-300 bg-red-50 focus:ring-red-200"
                          : "border-gray-200 hover:border-[#1E3A8A] focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20"
                      }`}
                    />
                    {errors.businessType && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.businessType}
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
          {/* Popup container with overflow-hidden to contain confetti */}
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-2xl transform animate-slideUp border border-gray-100 max-h-[90vh] overflow-hidden relative">
            {/* Scrollable content area */}
            <div className="overflow-y-auto max-h-[90vh] relative z-10">
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-2xl z-10">
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
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          👤
                        </span>
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
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          📧
                        </span>
                        <span>Email:</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-3 py-1.5 border border-gray-100 text-gray-900 text-sm break-all">
                          {result.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-20 flex items-center text-gray-500 font-medium text-sm">
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          🏢
                        </span>
                        <span>Company:</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-3 py-1.5 border border-gray-100 text-gray-900 text-sm">
                          {result.companyName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-20 flex items-center text-gray-500 font-medium text-sm">
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          💼
                        </span>
                        <span>Business:</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-3 py-1.5 border border-gray-100 text-gray-900 text-sm">
                          {result.businessType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-20 flex items-center text-gray-500 font-medium text-sm pt-1">
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          📋
                        </span>
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
                        <span className="text-[#1E3A8A] mr-1.5 text-sm">
                          ⚡
                        </span>
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
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              result.status === "COMPLETED"
                                ? "bg-green-500 animate-pulse"
                                : "bg-[#FBBF24]"
                            }`}></span>
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

            {/* Confetti Party Popper - Now contained by overflow-hidden on parent */}
            {result.status === "COMPLETED" && <ConfettiPartyPopper />}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
