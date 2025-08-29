import React from 'react';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const ColumnIcon = ({ index }) => {
  const getIcon = () => {
    switch (index) {
      case 0:
        return <Sparkles className="w-4 h-4 text-white" />;
      case 1:
        return <Zap className="w-4 h-4 text-white" />;
      default:
        return <TrendingUp className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="w-8 h-8 bg-gradient-to-br from-custom-500 to-custom-600 rounded-lg flex items-center justify-center shadow-lg">
      {getIcon()}
    </div>
  );
};

export default ColumnIcon;
