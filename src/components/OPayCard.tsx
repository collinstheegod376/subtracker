"use client";
import React, { useState } from 'react';

export default function OPayCard() {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

  const cardNumberRaw = "8136634819";
  const cardHolderName = "OPAY";

  const handleCopyNumber = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cardNumberRaw);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 1200);
    } catch (err) {
      alert('Manual copy: ' + cardNumberRaw);
    }
  };

  const handleCopyName = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cardHolderName);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 1000);
    } catch (err) {
      alert('Copy name: OPAY');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div 
        className="w-full max-w-[480px] rounded-[32px] p-2 transition-transform duration-200 hover:-translate-y-1 group"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(255,255,240,0.15), rgba(0,0,0,0.2))',
          backdropFilter: 'blur(2px)',
          boxShadow: '0 25px 45px -12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255,255,255,0.6)'
        }}
      >
        <div 
          className="relative overflow-hidden rounded-[28px] p-6 lg:padding-[28px 26px 32px 26px] text-[#FCFCF7] transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #0B1E2F 0%, #08212E 45%, #02121D 100%)',
            backdropFilter: 'blur(4px)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,220,0.2), inset 0 0 12px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Glow effect overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
            <div className="absolute top-0 -left-[100%] w-[80%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,200,0.1)] to-transparent -skew-x-[15deg] transition-all duration-500 group-hover:left-[150%]"></div>
          </div>

          {/* top brand section with chip and OPay */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex gap-3.5 items-center">
              <div 
                className="w-12 h-[38px] rounded-[10px] relative"
                style={{
                  background: 'linear-gradient(145deg, #D6B873, #B88B2E)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <div 
                  className="absolute top-2 left-3 w-6 h-[18px] rounded opacity-80"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #e7b551, #e7b551 3px, #c9942e 3px, #c9942e 8px)'
                  }}
                ></div>
              </div>
              <div className="text-[28px] tracking-[2px] font-light" style={{textShadow: '0 1px 0 #222'}}>📶  💳</div>
            </div>
            <div className="bg-[rgba(255,255,245,0.1)] backdrop-blur-[4px] px-3.5 py-2 rounded-full font-extrabold text-[1.7rem] tracking-[1.5px] border border-[rgba(255,215,120,0.5)] shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <span className="font-black bg-clip-text text-transparent bg-gradient-to-br from-[#FFE6A3] to-[#FFB347]">OPAY</span>
            </div>
          </div>

          {/* CARD NUMBER */}
          <div className="mt-7 mb-6 relative z-10">
            <div className="text-[0.7rem] uppercase tracking-[2px] font-medium text-[#B9D0E3] mb-2 opacity-85">CARD NUMBER</div>
            <div 
              onClick={handleCopyNumber}
              title="Click to copy card number"
              className="font-mono text-[1.4rem] lg:text-[1.9rem] font-semibold tracking-[2px] lg:tracking-[3px] break-words bg-[rgba(0,0,0,0.35)] inline-block px-3.5 lg:px-[16px] py-1.5 border border-[rgba(255,255,200,0.3)] rounded-[20px] backdrop-blur-[2px] text-[#F9F3D9] cursor-pointer transition-colors duration-150"
              style={{
                textShadow: '0 1px 1px black',
                backgroundColor: copiedNumber ? 'rgba(46, 125, 100, 0.8)' : undefined
              }}
            >
              {copiedNumber ? '✓ COPIED!' : '8136 6348 19'}
            </div>
            <div className="text-[0.65rem] opacity-60 mt-1.5 tracking-[1px]">🔒 virtual • digital card</div>
          </div>

          {/* cardholder & expiry row */}
          <div className="flex justify-between flex-wrap gap-6 mt-7 mb-5 relative z-10">
            <div className="flex-[2]">
              <div className="text-[0.65rem] tracking-[1.2px] uppercase text-[#AAC2D6] mb-1.5 font-medium">CARDHOLDER NAME</div>
              <div 
                onClick={handleCopyName}
                title="Click to copy cardholder name"
                className="font-bold text-[1rem] lg:text-[1.25rem] tracking-[0.5px] lg:tracking-[1px] bg-[rgba(255,255,245,0.05)] px-2 py-1 rounded-xl inline-block cursor-pointer uppercase break-words transition-colors duration-150"
                style={{
                  fontFamily: "'Inter', monospace",
                  backgroundColor: copiedName ? 'rgba(46, 125, 100, 0.8)' : undefined
                }}
              >
                {copiedName ? '✓ COPIED' : 'OPAY'}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[0.65rem] tracking-[1.2px] uppercase text-[#AAC2D6] mb-1.5 font-medium">EXPIRY</div>
              <div className="font-bold text-[1rem] lg:text-[1.2rem] tracking-[0.5px] bg-[rgba(255,255,245,0.05)] px-2 py-1 rounded-xl inline-block" style={{fontFamily: "'Inter', monospace"}}>12/28</div>
            </div>
          </div>

          {/* payment network & OPay recognition */}
          <div className="flex justify-end mt-2.5 items-center gap-3 border-t border-[rgba(255,215,140,0.25)] pt-[18px] relative z-10">
            <div className="bg-[#F5A62320] border border-[#F5A62380] rounded-[32px] px-4 py-1.5 text-[0.75rem] font-extrabold tracking-[1px] backdrop-blur-[4px] text-[#FFDEA5] font-mono">
              ✦ OPAY PAY ✦
            </div>
            <div className="bg-[rgba(0,0,0,0.4)] rounded-[32px] px-4 py-1.5 text-[0.75rem] font-semibold tracking-[1px] backdrop-blur-[4px] text-[#FFDEA5] font-mono">
              CONTACTLESS
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6 text-[0.75rem] text-[#2c3e2f] dark:text-slate-300 bg-[#eef2f5aa] dark:bg-slate-800/50 backdrop-blur-[4px] px-4 py-2 rounded-full w-fit mx-auto font-medium font-mono border border-[#ffffffaa] dark:border-slate-700/50">
        💳 <span className="font-extrabold bg-[#1a2a32] text-[#ffde9c] px-2 py-0.5 rounded-full mx-1">OPAY CARD</span> • Number: 8136 6348 19 • Name: OPAY
      </div>
    </div>
  );
}
