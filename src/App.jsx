import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { submitSupportRequest } from "./api/supportApi";
import HeroBanner from "./components/HeroBanner";
import robotIllustration from "./assert/Group-icon.png";
import AIWorkflow from "./components/AIWorkflow";
import { ArrowRight } from "lucide-react";
import robot from "./assert/header-robot.png";
import mainbg from "./assert/main-bg-circle.png";

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
  // const [formSubmitted, setFormSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Effect to handle looping back to submit after completion (only for workflow, not popup)
  useEffect(() => {
    if (workflowStatus === "COMPLETED" && !loading) {
      const timer = setTimeout(() => {
        setWorkflowStatus(null);
        // setFormSubmitted(false);
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
    // setFormSubmitted(true);

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
    // setFormSubmitted(false);
    setResult(null);
  };

  // Determine which dot should blink
  // const getDotStatus = (step) => {
  //   if (!formSubmitted) {
  //     return step === 1 ? "bg-[#FBBF24] animate-pulse" : "bg-gray-300";
  //   }

  //   if (workflowStatus === "IN_PROGRESS") {
  //     if (step === 1) return "bg-green-500";
  //     if (step === 2) return "bg-[#FBBF24] animate-pulse";
  //     if (step === 3) return "bg-gray-300";
  //   }

  //   if (workflowStatus === "COMPLETED") {
  //     if (step === 1) return "bg-green-500";
  //     if (step === 2) return "bg-green-500";
  //     if (step === 3) return "bg-green-500 animate-pulse";
  //   }

  //   return step === 1 ? "bg-[#FBBF24]" : "bg-gray-300";
  // };

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
      <div
        className="bg-cover bg-center bg-no-repeat min-h-screen relative mb-12 mt-4"
        style={{ backgroundImage: `url(${mainbg})` }}>
        <HeroBanner />

        <style>
          {`
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
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

      @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-8px) rotate(1deg); }
      }
      .animate-bounce-subtle {
        animation: bounce-subtle 3s ease-in-out infinite;
      }
    `}
        </style>

        <Toaster position="top-right" />

        {/* Main Content Area - Fully Responsive */}
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
            <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-20">
              {/* Left Column - Content & Branding */}
              <div className="lg:w-[42%] w-full space-y-4 sm:space-y-5">
                {/* Build your First AI Agent Box */}
                <div className="inline-block w-full bg-gradient-to-r from-[#2E94DB]/20 sm:from-[#2E94DB]/30 to-[#7030B1]/30 sm:to-[#7030B1]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm ">
                  <h2 className="text-2xl sm:text-3xl font-light sm:font-semibold leading-[1.2]">
                    Describe Your Use Case,
                  </h2>
                  <h3
                    className="text-2xl sm:text-3xl font-medium md:font-bold mt-1 sm:mt-2 tracking-tight pb-1 pr-1
                bg-gradient-to-r from-[#2E94DB] to-[#7030B1] 
                bg-clip-text text-transparent">
                    Get AI-Powered Guidance
                  </h3>
                </div>

                {/* Description Text */}
                <p className="text-gray-500 text-base leading-relaxed">
                  Share your requirement or use case with us. Our AI agent will
                  analyze your request and generate insights. Our team will
                  review the analysis and send you personalized recommendations
                  directly to your email.
                </p>

                {/* Image below description - Centered on mobile */}
                <div className="flex justify-center lg:justify-start">
                  <img
                    src={robot}
                    alt="AI-Agent"
                    className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm object-contain"
                  />
                </div>
              </div>

              {/* Right Column - The Form Card */}
              <div className="lg:w-[58%] w-full">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_16px_32px_-8px_rgba(0,0,0,0.1)] sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 p-4 sm:p-5 md:p-6 transition-all hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)]">
                  {/* Form Header / Logo Bar */}
                  <div className="bg-[#F9F3FB] rounded-xl sm:rounded-2xl md:rounded-[24px] p-4 sm:p-5 md:p-4 mb-4 flex items-center gap-3 sm:gap-4 md:gap-5 border border-[#F5F0FF]">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-b from-[#7030B1] to-[#B56DD3] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <img
                        src={robotIllustration}
                        alt="AI"
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                      />
                    </div>
                    <div>
                      <h2
                        className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#B56DD3] to-[#B56DD3] 
                    bg-clip-text text-transparent">
                        AI Support Portal
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium">
                        Get expert help for your use case
                      </p>
                    </div>
                  </div>

                  {/* Form Inputs Section */}
                  <div className="space-y-4">
                    {/* Name & Email Row - Stack on mobile, side by side on tablet+ */}
                    <div className= "grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 ml-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Enter your full name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          disabled={loading}
                          className={`w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-white border-2 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.customerName
                              ? "border-red-200 bg-red-50 focus:ring-red-100"
                              : "border-gray-100 hover:border-[#D8B4FE] focus:border-[#A855F7] focus:ring-[#F3E8FF]"
                          }`}
                        />
                        {errors.customerName && (
                          <p className="text-xs text-red-500 font-medium mt-1 ml-1 flex items-center gap-1">
                            <span>⚠️</span> {errors.customerName}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 ml-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className={`w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-white border-2 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.email
                              ? "border-red-200 bg-red-50 focus:ring-red-100"
                              : "border-gray-100 hover:border-[#D8B4FE] focus:border-[#A855F7] focus:ring-[#F3E8FF]"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 font-medium mt-1 ml-1 flex items-center gap-1">
                            <span>⚠️</span> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Company & Business Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 ml-1">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Enter company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          disabled={loading}
                          className={`w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-white border-2 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.companyName
                              ? "border-red-200 bg-red-50 focus:ring-red-100"
                              : "border-gray-100 hover:border-[#D8B4FE] focus:border-[#A855F7] focus:ring-[#F3E8FF]"
                          }`}
                        />
                        {errors.companyName && (
                          <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                            ⚠️ {errors.companyName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 ml-1">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Enter business type"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          disabled={loading}
                          className={`w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 bg-white border-2 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 ${
                            errors.businessType
                              ? "border-red-200 bg-red-50 focus:ring-red-100"
                              : "border-gray-100 hover:border-[#D8B4FE] focus:border-[#A855F7] focus:ring-[#F3E8FF]"
                          }`}
                        />
                        {errors.businessType && (
                          <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                            ⚠️ {errors.businessType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Usecase Field */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="block text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 ml-1">
                        Your Use Case <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Tell us about the AI agent you want to build..."
                        value={usecase}
                        onChange={(e) => setUsecase(e.target.value)}
                        disabled={loading}
                        rows="4"
                        className={`w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-white border-2 rounded-xl sm:rounded-2xl md:rounded-[24px] text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 resize-none ${
                          errors.usecase
                            ? "border-red-200 bg-red-50 focus:ring-red-100"
                            : "border-gray-100 hover:border-[#D8B4FE] focus:border-[#A855F7] focus:ring-[#F3E8FF]"
                        }`}
                      />
                      {errors.usecase && (
                        <p className="text-xs text-red-500 font-medium mt-1 ml-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.usecase}
                        </p>
                      )}
                      <p className="text-xs sm:text-[13px] text-orange-500 font-medium mt-2 sm:mt-3 ml-1">
                        Minimum 10 characters. Be specific about your
                        requirements.
                      </p>
                    </div>

                    {/* Large Stylized Submit Button */}
                    <div>
                      <button
                        onClick={submitRequest}
                        disabled={loading || workflowStatus === "COMPLETED"}
                        className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[20px] bg-gradient-to-b from-[#7030B1] to-[#B56DD3] px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-[0_5px_15px_-5px_rgba(139,92,246,0.5)] sm:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed">
                        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity" />
                        {loading ? (
                          <span className="flex items-center justify-center gap-2 sm:gap-3">
                            <svg
                              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
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
                            <span className="text-sm sm:text-base">
                              Processing Data...
                            </span>
                          </span>
                        ) : workflowStatus === "COMPLETED" ? (
                          "Submission Recorded ✓"
                        ) : (
                          <span className="flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                            Submit Use case Request
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        )}
                      </button>

                      {/* Security Badge */}
                      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 font-medium">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Your information is secure. We'll never share your
                        details.
                      </div>
                    </div>

                    {/* Subtle Workflow Progress Indicator */}
                    {loading && (
                      <div className="pt-2 animate-pulse">
                        <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-3/4 transition-all" />
                        </div>
                        <p className="text-center text-xs text-purple-600 mt-2 font-semibold uppercase tracking-widest">
                          {getStatusMessage()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AIWorkflow />

        {/* Modal/Popup - Responsive */}
        {showPopup && result && (
          <div className="fixed inset-0 bg-black bg-opacity-50 sm:bg-opacity-60 backdrop-blur-[2px] sm:backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full mx-2 sm:mx-auto shadow-2xl transform animate-slideUp border border-gray-100 max-h-[90vh] overflow-hidden relative">
              <div className="overflow-y-auto max-h-[90vh] relative z-10">
                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl z-10">
                  <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#FBBF24] via-[#F97316] to-[#1E3A8A] rounded-t-xl sm:rounded-t-2xl"></div>
                  <div className="p-3 sm:p-4 md:p-5 pb-1 sm:pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden ${
                            result.status === "COMPLETED"
                              ? "bg-gradient-to-br from-green-500 to-green-600"
                              : "bg-gradient-to-br from-[#1E3A8A] to-[#0A1E3C]"
                          }`}>
                          <span className="text-xl sm:text-2xl md:text-3xl relative z-10">
                            {result.status === "COMPLETED" ? "🎉" : "✓"}
                          </span>
                          {result.status === "COMPLETED" && (
                            <>
                              <div className="absolute inset-0 animate-ping bg-white opacity-30 rounded-lg"></div>
                              <div className="absolute -inset-2 bg-yellow-300 opacity-20 blur-xl animate-pulse"></div>
                            </>
                          )}
                        </div> */}
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A1E3C]">
                            {result.status === "COMPLETED"
                              ? "Analysis Completed!"
                              : "Request Received!"}
                          </h2>
                        </div>
                      </div>
                      <button
                        onClick={handleClosePopup}
                        className="text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-sm sm:text-base">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
                  {/* Details Card - Responsive */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 flex items-center">
                      <span className="w-1 h-3 bg-[#FBBF24] rounded-full mr-1.5"></span>
                      Submission Details
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      {/* Name */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                        <div className="w-full sm:w-24 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            👤
                          </span>
                          <span>Name:</span>
                        </div>
                        <div className="flex-1 sm:ml-0">
                          <div className="bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-100 text-gray-900 text-xs sm:text-sm">
                            {result.name}
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                        <div className="w-full sm:w-24 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            📧
                          </span>
                          <span>Email:</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-100 text-gray-900 text-xs sm:text-sm break-all">
                            {result.email}
                          </div>
                        </div>
                      </div>

                      {/* Company */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                        <div className="w-full sm:w-24 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            🏢
                          </span>
                          <span>Company:</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-100 text-gray-900 text-xs sm:text-sm">
                            {result.companyName}
                          </div>
                        </div>
                      </div>

                      {/* Business Type */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                        <div className="w-full sm:w-24 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            💼
                          </span>
                          <span>Business:</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-100 text-gray-900 text-xs sm:text-sm">
                            {result.businessType}
                          </div>
                        </div>
                      </div>

                      {/* Use Case */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                        <div className="w-full sm:w-24 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            📋
                          </span>
                          <span>Use Case:</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-100 text-gray-800 text-xs sm:text-sm max-h-20 sm:max-h-24 overflow-y-auto">
                            <p className="leading-relaxed">{result.usecase}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                        <div className="w-full sm:w-20 flex items-center text-gray-500 font-medium text-xs sm:text-sm">
                          <span className="text-[#1E3A8A] mr-1.5 text-xs sm:text-sm">
                            ⚡
                          </span>
                          <span>Status:</span>
                        </div>
                        <div className="flex-1">
                          <span
                            className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                              result.status === "COMPLETED"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-[#FBBF24]/20 text-[#0A1E3C] border border-[#FBBF24]/30"
                            }`}>
                            <span
                              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1 sm:mr-1.5 ${
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
                    <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0A1E3C]/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-[#FBBF24]">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs sm:text-sm">
                            🤖
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#0A1E3C] text-xs sm:text-sm mb-1 sm:mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
                            AI Agent Analysis
                            <span
                              className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] rounded-full border ${
                                result.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-[#FBBF24]/20 text-[#0A1E3C] border-[#FBBF24]/30"
                              }`}>
                              {result.status === "COMPLETED"
                                ? "COMPLETED"
                                : "PROCESSING"}
                            </span>
                          </h4>
                          <div className="bg-white rounded-lg p-2 sm:p-3 border border-[#FBBF24]/20 shadow-sm">
                            <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                              {Array.isArray(result.agentResult) ? (
                                <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 sm:space-y-1">
                                  {result.agentResult.map((item, i) => (
                                    <li key={i} className="text-xs sm:text-sm">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              ) : typeof result.agentResult === "object" ? (
                                <div className="space-y-1 sm:space-y-2">
                                  {Object.entries(result.agentResult).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="border-b border-gray-100 pb-0.5 sm:pb-1 last:border-0">
                                        <span className="font-medium text-[#1E3A8A] capitalize text-xs sm:text-sm">
                                          {key}:
                                        </span>{" "}
                                        <span className="text-xs sm:text-sm">
                                          {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : value}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap text-xs sm:text-sm">
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
                  <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0A1E3C]/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-[#FBBF24]">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs sm:text-sm">
                          📧
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confetti Party Popper */}
              {result.status === "COMPLETED" && <ConfettiPartyPopper />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
