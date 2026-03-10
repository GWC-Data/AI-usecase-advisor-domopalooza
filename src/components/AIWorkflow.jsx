import React from "react";
import robotIcon from "../assert/Group-icon.png";
import tick from "../assert/tick.png";
import analysis from "../assert/ai-analysis.png";
import email from "../assert/email-icon.png";

const AIWorkflow = () => {
  return (
    <section className="bg-white overflow-hidden px-3 sm:px-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 rounded-2xl sm:rounded-3xl border border-gray-100">
        {/* Header Box - Responsive */}
        <div className="bg-[#F9F3FB] rounded-lg p-4 sm:p-5 md:p-6 mb-10 sm:mb-12 md:mb-16 lg:mb-20 flex items-center justify-center gap-2 sm:gap-3 md:gap-5 border border-[#F5EDFF] mt-2 text-center leading-relaxed ">
          <img 
            src={robotIcon} 
            alt="AI" 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain" 
          />
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7030B1]">
              AI Analysis Workflow
            </h3>
            {/* <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium">
              Real-time status indicator
            </p> */}
          </div>
        </div>

        {/* Workflow Steps Container - Mobile-first grid */}
        <div className="relative px-2 sm:px-4 pb-4 sm:pb-6">
          {/* Dashed Connecting Line - Hidden on mobile/tablet, visible on desktop */}
          <div className="hidden lg:block absolute top-8 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#D8B4FE]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#7030B1] to-[#B56DD3] flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(112,48,177,0.3)] sm:shadow-[0_20px_40px_-12px_rgba(112,48,177,0.3)] mb-4 sm:mb-6 md:mb-8 transition-transform hover:scale-105 duration-300">
                <img
                  src={tick}
                  alt="Usecase"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                Submit use case Request
              </h4>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed px-2">
                  Describe your AI agent idea and share your business
                  requirements
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#7030B1] to-[#B56DD3] flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(112,48,177,0.3)] sm:shadow-[0_20px_40px_-12px_rgba(112,48,177,0.3)] mb-4 sm:mb-6 md:mb-8 transition-transform hover:scale-105 duration-300">
                <img
                  src={analysis}
                  alt="AI-Analysis"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                AI Analysis
              </h4>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed px-2">
                  Our AI instantly analyzes your use case and generates insights
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#7030B1] to-[#B56DD3] flex items-center justify-center shadow-[0_10px_20px_-6px_rgba(112,48,177,0.3)] sm:shadow-[0_20px_40px_-12px_rgba(112,48,177,0.3)] mb-4 sm:mb-6 md:mb-8 transition-transform hover:scale-105 duration-300">
                <img
                  src={email}
                  alt="Mail"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                Email Sent
              </h4>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed px-2">
                  Receive tailored recommendations directly in your inbox
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIWorkflow;