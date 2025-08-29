import React from "react";
import { getIssueColor } from "./IssueTypeUtils";
import { useIssueCardDragDrop } from '../../../hooks/useIssueCardDragDrop';
import IssueCardHeader from "./IssueCardHeader";
import IssueCardTitle from './IssueCardTitle';
import IssueCardFooter from './IssueCardFooter';

const IssueCard = ({ issue, epics = [], onIssueClick }) => {
  const {
    isDragging,
    dragStartHandler,
    dragEndHandler,
  } = useIssueCardDragDrop(issue);
  
  const handleClick = () => {
    if (onIssueClick) {
      onIssueClick(issue);
    }
  };
  
  return (
    <div
      className={`bg-white dark:bg-gradient-card rounded-xl p-3 border ${getIssueColor(issue)} border-l-4 shadow-sm cursor-grab active:cursor-grabbing  
        ${
          isDragging
            ? "opacity-50 ring-2 ring-primary shadow-lg scale-105 z-50"
            : "hover:shadow-md dark:hover:shadow-gray-900/30"
        }
        transition-all duration-200 mb-3`}
      onClick={handleClick}
      draggable="true"
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
    >
      <div className="flex flex-col space-y-2">
        <IssueCardHeader issue={issue} />
        <IssueCardTitle title={issue.title} />
        <IssueCardFooter issue={issue} epics={epics} />
      </div>
    </div>
  );
};

export default IssueCard;

