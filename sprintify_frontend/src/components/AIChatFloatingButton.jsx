import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import useThemeStore from "../store/themeStore";
import AIChatAssistant from "./AIChatAssistant";

const AIChatFloatingButton = () => {
  const { theme } = useThemeStore();
  const { projectId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        {/* Icon with animation */}
        <div className="relative">
          <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
      </button>

      {/* Tooltip */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-20 z-40 hidden group-hover:block animate-fade-in">
          <div
            className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-900 border border-gray-200"
            }`}
          >
            AI Assistant
            <div
              className={`absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 rotate-45 ${
                theme === "dark"
                  ? "bg-gray-800 border-r border-b border-gray-700"
                  : "bg-white border-r border-b border-gray-200"
              }`}
            ></div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant Modal */}
      <AIChatAssistant
        projectId={projectId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default AIChatFloatingButton;
