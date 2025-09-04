import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import medhyaLogo from "../assets/logo1.jpg";
import peerLogo from "../assets/logo2.jpg";
import communityLogo from "../assets/logo3.jpg";

const choices = [
  {
    id: "consultant",
    title: "Consultant",
    description: "Connect with a mental health professional for guidance.",
    kind: "image",
    symbol: communityLogo,
  },
  {
    id: "peer",
    title: "Peer",
    description: "Talk to a trained peer supporter who understands you.",
    kind: "image",
    symbol: peerLogo,
  },
  {
    id: "mitra",
    title: "Medhya Mittra",
    description: "Reach volunteers from Medhya Mittra for quick help.",
    kind: "image",
    symbol: medhyaLogo,
  },
];

export default function ContactChoice() {
  const navigate = useNavigate();
  const { userRole } = useContext(UserContext) || { userRole: 'guest' };

  const handleSelect = (id) => {
    console.log('🔍 User selected:', id, '- redirecting to student dashboard');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center gap-3">
              <CardTitle className="text-4xl text-center bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 bg-clip-text text-transparent font-extrabold drop-shadow-md">
                Who would you like to connect with?
              </CardTitle>
              <p className="text-base text-slate-700 text-center max-w-2xl font-medium">
                Choose your preferred support channel. You can change this later from your profile settings.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {choices.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(c.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(c.id); }}
                  className="group rounded-3xl bg-white/80 border-2 border-transparent hover:border-pink-400 hover:shadow-2xl transition-all p-8 text-left focus:outline-none focus:ring-4 focus:ring-pink-300 cursor-pointer relative overflow-hidden"
                  style={{
                    boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)",
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 pointer-events-none" />
                  <div className="flex flex-col items-center gap-5 relative z-10">

                    <div className="w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-indigo-300 shadow-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 overflow-hidden transition-all duration-300 group-hover:scale-105">
                      <img
                        src={c.symbol}
                        alt={c.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        onError={() => setFailed(true)}
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-xl text-indigo-800 group-hover:text-pink-600 transition-colors">
                        {c.title}
                      </div>
                      <div className="text-base text-slate-600 mt-2 max-w-[22ch] font-medium">
                        {c.description}
                      </div>
                    </div>
                    <Button className="mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold shadow-lg px-6 py-2 rounded-full transition-all">
                      Choose {c.title}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 text-sm text-slate-500 font-medium">
              Your selection personalizes recommendations across the platform.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
