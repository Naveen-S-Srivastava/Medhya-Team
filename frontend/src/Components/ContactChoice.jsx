import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import medhyaLogo from "../assets/medha-logo.jpg";

const choices = [
  {
    id: "consultant",
    title: "Consultant",
    description: "Connect with a mental health professional for guidance.",
    kind: "letter",
    symbol: "C",
  },
  {
    id: "peer",
    title: "Peer",
    description: "Talk to a trained peer supporter who understands you.",
    kind: "letter",
    symbol: "P",
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
    const targetByChoice = {
      consultant: '/appointments',
      peer: '/community',
      mitra: '/ai',
    };
    if (targetByChoice[id]) {
      navigate(targetByChoice[id]);
    }
  };

  const ImageOrLetter = ({ choice }) => {
    const [failed, setFailed] = useState(false);
    const isImage = choice.kind === "image" && !failed;
    return (
      <div className="w-20 h-20 rounded-full flex items-center justify-center ring-1 ring-gray-200 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
        {isImage ? (
          <img
            src={choice.symbol}
            alt="Medhya Mittra"
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-white text-2xl font-bold">{choice.symbol || choice.title[0]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card className="border border-slate-200 shadow-xl bg-white/95">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center gap-3">
              <CardTitle className="text-3xl text-center bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">
                Who would you like to connect with?
              </CardTitle>
              <p className="text-sm text-slate-600 text-center max-w-2xl">
                Choose your preferred support channel. You can change this later from your profile settings.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {choices.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(c.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(c.id); }}
                  className="group rounded-2xl bg-white/90 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-4">
                    <ImageOrLetter choice={c} />
                    <div className="text-center">
                      <div className="font-semibold text-lg text-slate-800 group-hover:text-indigo-700">
                        {c.title}
                      </div>
                      <div className="text-sm text-slate-600 mt-1 max-w-[20ch]">
                        {c.description}
                      </div>
                    </div>
                    <Button className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={(e) => { e.stopPropagation(); handleSelect(c.id); }}>
                      Choose {c.title}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 text-xs text-slate-500">
              Your selection personalizes recommendations across the platform.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


