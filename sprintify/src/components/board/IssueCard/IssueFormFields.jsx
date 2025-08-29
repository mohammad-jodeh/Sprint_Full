import React from 'react';

// Component for issue form fields following SRP
const IssueFormFields = ({ 
  title, 
  description, 
  storyPoint, 
  onTitleChange, 
  onDescriptionChange, 
  onStoryPointChange 
}) => (
  <div className="space-y-4">
    <TitleInput 
      value={title}
      onChange={onTitleChange}
    />
    
    <DescriptionInput 
      value={description}
      onChange={onDescriptionChange}
    />
    
    <StoryPointSelector 
      value={storyPoint}
      onChange={onStoryPointChange}
    />
  </div>
);

// Title input component
const TitleInput = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Enter issue title..."
    className="w-full p-3 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm transition-all"
    autoFocus
  />
);

// Description input component
const DescriptionInput = ({ value, onChange }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Enter description (optional)..."
    rows={3}
    className="w-full p-3 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none backdrop-blur-sm transition-all"
  />
);

// Story point selector component
const StoryPointSelector = ({ value, onChange }) => (
  <div className="flex items-center space-x-3">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Story Points:</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg px-3 py-2 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm transition-all"
    >
      {[1, 2, 3, 5, 8, 13].map(point => (
        <option key={point} value={point}>{point}</option>
      ))}
    </select>
  </div>
);

export default IssueFormFields;
