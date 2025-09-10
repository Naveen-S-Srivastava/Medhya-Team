
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { Heart, Users, Shield, ArrowRight } from "lucide-react";
import medhyaLogo from "../assets/logo1.png";
import peerLogo from "../assets/logo2.jpg";
import communityLogo from "../assets/logo3.jpg";

const choices = [
  {
    id: "consultant",
    title: "Professional Consultant",
    description: "Connect with licensed mental health professionals for expert guidance and therapy.",
    kind: "image",
    symbol: communityLogo,
    icon: Shield,
    color: "sky",
    gradient: "from-sky-400 to-blue-500",
    hoverGradient: "from-sky-500 to-blue-600",
  },
  {
    id: "peer",
    title: "Peer Support",
    description: "Talk to trained peer supporters who understand your experiences and challenges.",
    kind: "image",
    symbol: peerLogo,
    icon: Heart,
    color: "mint",
    gradient: "from-mint-400 to-emerald-500",
    hoverGradient: "from-mint-500 to-emerald-600",
  },
  {
    id: "mitra",
    title: "Medhya Mittra",
    description: "Connect with our dedicated volunteers for immediate support and community care.",
    kind: "image",
    symbol: medhyaLogo,
    icon: Users,
    color: "lavender",
    gradient: "from-lavender-400 to-purple-500",
    hoverGradient: "from-lavender-500 to-purple-600",
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-lavender-50 flex items-center justify-center p-6 font-['Poppins',sans-serif]">
      <div className="w-full max-w-6xl">
        <Card className="border border-slate-200 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-6 p-8">
            <div className="flex flex-col items-center gap-4">
              <CardTitle className="text-4xl sm:text-5xl text-center bg-sky-600  bg-clip-text text-transparent font-bold leading-tight">
                Who would you like to connect with?
              </CardTitle>
              <p className="text-lg text-slate-600 text-center max-w-3xl font-medium leading-relaxed">
                Choose your preferred support channel. You can change this later from your profile settings.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {choices.map((c) => {
                const IconComponent = c.icon;
                return (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(c.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(c.id); }}
                    className="group rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 p-8 text-left focus:outline-none focus:ring-2 focus:ring-sky-200 cursor-pointer relative overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center gap-6 relative z-10">
                      <div className="relative">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${c.gradient} overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                          <img
                            src={c.symbol}
                            alt={c.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        </div>
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="text-center space-y-3">
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      
                      <Button 
                        className={`w-full h-12 bg-gradient-to-r ${c.gradient} hover:${c.hoverGradient} text-white font-semibold shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                      >
                        Choose {c.title.split(' ')[0]}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-600 font-medium">
                Your selection personalizes recommendations across the platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
