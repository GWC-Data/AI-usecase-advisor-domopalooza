import React from "react";
import gwcLogo from "../assert/gwc-logo.svg";
import domoLogo from "../assert/domopalooza-logo.svg";
import heroBg from "../assert/hero-bg.jpg";

const HeroBanner = () => {
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* ── Main Banner Container ── */}
      <div
        className="relative w-full rounded-[16px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm"
        style={{
          minHeight: "clamp(180px, 35vw, 330px)",
        }}>
        {/* Background Layer 1: Image Pattern */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30 sm:opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Background Layer 2: Color Gradient */}
        <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#2E94DB]/20 sm:from-[#2E94DB]/30 to-[#7030B1]/20 sm:to-[#7030B1]/30" />

        {/* ── Header Logo Bar ── */}
        <div className="relative z-10 px-3 sm:px-6 md:px-8 lg:px-12 pt-3 sm:pt-5 md:pt-7">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-3 rounded-xl sm:rounded-2xl bg-white/30 sm:bg-white/40 backdrop-blur-xl border border-white/40 sm:border-white/60 shadow-sm gap-2 sm:gap-0">
            {/* GWC Logo - Full width on mobile */}
            <div className="flex items-center justify-center w-full sm:w-auto">
              <img
                src={gwcLogo}
                alt="GWC DATA.AI"
                className="w-[200px] object-contain"
              />
            </div>

            {/* Domo Logo - Full width on mobile with top border for separation */}
            <div className="flex items-center justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/20 sm:border-t-0">
              <img
                src={domoLogo}
                alt="DOMOPALOOZA"
                className="w-[200px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── Headline + Illustration Content ── */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6">
          {/* Headline Text Section - Centered for all devices */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[clamp(24px,5vw,48px)] sm:text-[clamp(28px,5.5vw,52px)] md:text-[clamp(32px,6vw,56px)] lg:text-[clamp(36px,5vw,60px)] text-[#1A1A1A] font-semibold sm:font-bold md:font-extrabold leading-[1.1] tracking-tight mb-1 sm:mb-2">
              Build your First AI Agent
            </h1>
            <h1
              className="inline-block text-[clamp(26px,5.5vw,48px)] sm:text-[clamp(30px,6vw,52px)] md:text-[clamp(34px,6.5vw,56px)] lg:text-[clamp(38px,5.5vw,60px)] font-semibold sm:font-bold md:font-extrabold tracking-normal pb-1 pr-1
        bg-gradient-to-r from-[#2E94DB] to-[#7030B1]
        bg-clip-text text-transparent">
              in 10 Hours
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
