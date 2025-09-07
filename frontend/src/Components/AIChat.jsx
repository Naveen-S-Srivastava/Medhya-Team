import React from "react";

import ProfileCompletionCheck from './ProfileCompletionCheck';
export default function AIChat() {
  return (
    <ProfileCompletionCheck requireComplete={true}>
      <div className="w-full h-screen bg-white">
        <iframe
          src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/29/23/20250829231639-LQZB0FN3.json"
          title="Botpress Chat"
          className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write; microphone"
      ></iframe>
    </div>
    
    </ProfileCompletionCheck>
  );
}