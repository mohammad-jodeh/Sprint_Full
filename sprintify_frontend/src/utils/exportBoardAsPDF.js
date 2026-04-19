import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Get user name from ID using members list
 */
const getUserName = (userId, members = []) => {
  if (!userId) return 'Unassigned';
  const member = members.find(m => m.id === userId);
  return member?.name || userId;
};

/**
 * Get priority color
 */
const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH': return { r: 239, g: 68, b: 68 }; // Red
    case 'MEDIUM': return { r: 245, g: 158, b: 11 }; // Amber
    case 'LOW': return { r: 34, g: 197, b: 94 }; // Green
    default: return { r: 107, g: 114, b: 128 }; // Gray
  }
};

/**
 * Get issue type badge
 */
const getIssueTypeBadge = (type) => {
  const typeMap = {
    TASK: '📋',
    BUG: '🐛',
    STORY: '📖',
    EPIC: '🏛️',
    SUBTASK: '└─'
  };
  return typeMap[type?.toUpperCase()] || '◆';
};

/**
 * Export the board view as a PDF with professional layout
 */
export const exportBoardAsPDF = async (projectName, columns = [], issues = [], members = [], fileName = null) => {
  try {
    // Validate input data
    if (!Array.isArray(columns) || columns.length === 0) {
      console.error('No columns available for export');
      return;
    }

    if (!Array.isArray(issues)) {
      console.error('Issues must be an array');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    let yPosition = margin + 5;

    // ===== PAGE 1: PROFESSIONAL TITLE PAGE =====
    // Header background
    pdf.setFillColor(79, 70, 229);
    pdf.rect(0, 0, pageWidth, 50, 'F');

    // Title
    pdf.setFontSize(32);
    pdf.setTextColor(255, 255, 255);
    pdf.text('BOARD EXPORT', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(200, 199, 255);
    pdf.text(projectName, pageWidth / 2, 38, { align: 'center' });

    // Stats box
    yPosition = 70;
    pdf.setFillColor(240, 245, 255);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 45, 'F');
    pdf.setDrawColor(79, 70, 229);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 45);

    pdf.setFontSize(11);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont(undefined, 'bold');
    pdf.text('REPORT SUMMARY', margin + 5, yPosition + 8);

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    
    const statsData = [
      { label: 'Generated', value: new Date().toLocaleString() },
      { label: 'Total Columns', value: columns.length },
      { label: 'Total Issues', value: issues.length },
      { label: 'Team Members', value: members.length },
    ];

    let statY = yPosition + 15;
    const colWidth = (pageWidth - 2 * margin - 10) / 2;
    statsData.forEach((stat, idx) => {
      const xOffset = margin + 5 + (idx % 2) * (colWidth + 5);
      if (idx > 0 && idx % 2 === 0) statY += 8;
      
      pdf.setFont(undefined, 'bold');
      pdf.text(`${stat.label}:`, xOffset, statY);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${stat.value}`, xOffset + 35, statY);
    });

    // Column overview
    yPosition += 55;
    pdf.setFontSize(11);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont(undefined, 'bold');
    pdf.text('COLUMN OVERVIEW', margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');

    columns.forEach((column, idx) => {
      if (!column || !Array.isArray(column.statuses)) {
        return;
      }
      
      const columnIssues = issues.filter(issue => 
        issue && issue.statusId && 
        column.statuses.some(s => s && s.id === issue.statusId)
      );
      const storyPoints = columnIssues.reduce((sum, issue) => sum + (issue?.storyPoint || 0), 0);
      
      const colNum = `${idx + 1}.`;
      const colName = column.name || 'Untitled Column';
      const stats = `${columnIssues.length} issues • ${storyPoints}pts`;
      
      pdf.text(colNum, margin, yPosition);
      pdf.text(colName, margin + 8, yPosition);
      pdf.setTextColor(100, 100, 100);
      pdf.text(stats, margin + 60, yPosition);
      pdf.setTextColor(0, 0, 0);
      
      yPosition += 6;
    });

    // ===== PAGE 2+: DETAILED BOARD VIEW =====
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(14);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont(undefined, 'bold');
    pdf.text('BOARD DETAILS', margin, yPosition);
    yPosition += 8;

    // Process columns with better layout
    columns.forEach((column) => {
      // Validate column has statuses array
      if (!column || !Array.isArray(column.statuses)) {
        return;
      }
      
      const columnIssues = issues.filter(issue => 
        issue && issue.statusId && 
        column.statuses.some(s => s && s.id === issue.statusId)
      );

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Column header with background
      const headerHeight = 10;
      pdf.setFillColor(79, 70, 229);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, headerHeight, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      pdf.text(column.name, margin + 4, yPosition + 6.5);

      const storyPoints = columnIssues.reduce((sum, issue) => 
        sum + (issue?.storyPoint || 0), 0
      );
      pdf.setFontSize(9);
      pdf.text(`${columnIssues.length} issues • ${storyPoints}pts`, pageWidth - margin - 40, yPosition + 6.5);

      yPosition += headerHeight + 3;

      // Issues in this column
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      
      columnIssues.slice(0, 20).forEach((issue, issueIdx) => {
        if (!issue || yPosition > pageHeight - 20) {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          if (!issue) return;
        }

        // Issue background
        if (issueIdx % 2 === 0) {
          pdf.setFillColor(245, 245, 250);
          pdf.rect(margin + 1, yPosition - 2, pageWidth - 2 * margin - 2, 10, 'F');
        }

        // Issue type and priority indicator
        const typeIcon = getIssueTypeBadge(issue?.issueType);
        const priorityColor = getPriorityColor(issue?.issuePriority);
        
        // Priority bar
        pdf.setFillColor(priorityColor.r, priorityColor.g, priorityColor.b);
        pdf.rect(margin + 2, yPosition - 1.5, 2, 8, 'F');

        // Issue content
        pdf.setFont(undefined, 'bold');
        const title = `${typeIcon} ${issue?.title || 'Untitled'}`.substring(0, 60);
        pdf.text(title, margin + 6, yPosition + 2);

        // Details row
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);

        const assigneeName = getUserName(issue?.assignee, members);
        const priority = issue?.issuePriority ? `${issue.issuePriority}` : 'Normal';
        const points = issue?.storyPoint ? `${issue.storyPoint}pts` : '';

        let detailText = `👤 ${assigneeName}`;
        if (points) detailText += ` | 📊 ${points}`;
        detailText += ` | 🎯 ${priority}`;

        pdf.text(detailText, margin + 6, yPosition + 6);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        yPosition += 11;
      });

      if (columnIssues.length > 20) {
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text(`... and ${columnIssues.length - 20} more issues`, margin + 6, yPosition);
        yPosition += 5;
      }

      yPosition += 5;
    });

    // ===== PAGE 3+: DETAILED ISSUE LIST =====
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(14);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont(undefined, 'bold');
    pdf.text('COMPLETE ISSUE LIST', margin, yPosition);
    
    yPosition += 10;

    // Create table headers
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.setFillColor(240, 245, 255);
    pdf.rect(margin, yPosition - 4, pageWidth - 2 * margin, 8, 'F');
    
    pdf.setTextColor(79, 70, 229);
    pdf.text('#', margin + 2, yPosition + 1);
    pdf.text('Title', margin + 8, yPosition + 1);
    pdf.text('Type', margin + 85, yPosition + 1);
    pdf.text('Priority', margin + 110, yPosition + 1);
    pdf.text('Assignee', margin + 140, yPosition + 1);
    pdf.text('Points', margin + 200, yPosition + 1);

    yPosition += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');

    // Issue rows
    issues.forEach((issue, idx) => {
      if (!issue) return;
      
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }

      // Alternate row background
      if (idx % 2 === 0) {
        pdf.setFillColor(250, 250, 252);
        pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 7, 'F');
      }

      pdf.setFontSize(8.5);
      
      // Issue number
      pdf.text(`${idx + 1}`, margin + 2, yPosition + 1);
      
      // Title (truncated)
      const title = issue?.title?.substring(0, 50) || '-';
      pdf.text(title, margin + 8, yPosition + 1);
      
      // Type
      const type = issue?.issueType || '-';
      pdf.text(type, margin + 85, yPosition + 1);
      
      // Priority with color
      const priority = issue?.issuePriority || '-';
      const color = getPriorityColor(issue?.issuePriority);
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.setFont(undefined, 'bold');
      pdf.text(priority, margin + 110, yPosition + 1);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      
      // Assignee name
      const assignee = getUserName(issue?.assignee, members);
      pdf.text(assignee, margin + 140, yPosition + 1);
      
      // Story points
      const points = issue?.storyPoint ? `${issue.storyPoint}` : '-';
      pdf.text(points, margin + 200, yPosition + 1);

      yPosition += 8;
    });

    // Footer on last page
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated by Sprintify - ${new Date().toLocaleDateString()}`, margin, pageHeight - 5);

    // Generate file name
    const timestamp = new Date().toISOString().slice(0, 10);
    const exportFileName = fileName || `${projectName.replace(/\s+/g, '_')}_Board_${timestamp}.pdf`;

    // Download PDF
    pdf.save(exportFileName);
  } catch (error) {
    console.error('Error exporting board as PDF:', error);
    throw error;
  }
};
