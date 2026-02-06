
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Curriculum } from '../types';

export const exportToPDF = (curriculum: Curriculum) => {
  const doc = new jsPDF();
  renderCurriculum(doc, curriculum);
  doc.save(`${curriculum.title.replace(/\s+/g, '_')}_Curriculum.pdf`);
};

export const exportAllCurriculaToPDF = (history: Curriculum[]) => {
  if (history.length === 0) return;
  const doc = new jsPDF();
  
  // Title Page
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('CurricuForge: Learning Portfolio', 14, 60);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 75);
  doc.text(`Total Curricula Forge: ${history.length}`, 14, 82);
  
  doc.setFontSize(12);
  doc.text('This document contains all curriculum pathways and assessments generated in your session.', 14, 100);

  history.forEach((curriculum, index) => {
    doc.addPage();
    renderCurriculum(doc, curriculum, index + 1);
  });

  doc.save(`CurricuForge_Complete_Portfolio_${Date.now()}.pdf`);
};

const renderCurriculum = (doc: jsPDF, curriculum: Curriculum, index?: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(index ? 16 : 22);
  doc.setTextColor(15, 23, 42);
  const headerText = index ? `[${index}] ${curriculum.title}` : curriculum.title;
  doc.text(headerText, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Duration: ${curriculum.durationValue} ${curriculum.durationType}`, 14, 28);
  
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  const splitDesc = doc.splitTextToSize(curriculum.description, pageWidth - 28);
  doc.text(splitDesc, 14, 38);

  let currentY = 38 + (splitDesc.length * 6) + 10;

  // Periods & Courses
  curriculum.periods.forEach((period) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.text(period.periodLabel, 14, currentY);
    currentY += 8;

    period.courses.forEach((course) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${course.courseName} (${course.courseCode})`, 14, currentY);
      currentY += 6;

      course.topics.forEach((topic, tIdx) => {
        if (currentY > 260) { doc.addPage(); currentY = 20; }
        
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const topicLine = `${tIdx + 1}. ${topic.title}: ${topic.description}`;
        const splitTopic = doc.splitTextToSize(topicLine, pageWidth - 32);
        doc.text(splitTopic, 18, currentY);
        currentY += (splitTopic.length * 5) + 3;

        // Render Quiz if available
        if (topic.quiz) {
          currentY += 2;
          doc.setFontSize(10);
          doc.setTextColor(16, 185, 129); // emerald-500
          doc.text(`> Assessment Questions Available:`, 22, currentY);
          currentY += 5;
          
          topic.quiz.questions.forEach((q, qIdx) => {
            if (currentY > 250) { doc.addPage(); currentY = 20; }
            
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);
            const qText = `Q${qIdx + 1}: ${q.question}`;
            const splitQ = doc.splitTextToSize(qText, pageWidth - 45);
            doc.text(splitQ, 25, currentY);
            currentY += (splitQ.length * 4.5);

            q.options.forEach((opt, oIdx) => {
              if (currentY > 270) { doc.addPage(); currentY = 20; }
              const isCorrect = oIdx === q.correctAnswer;
              doc.setTextColor(isCorrect ? 16 : 100, isCorrect ? 185 : 116, isCorrect ? 129 : 139);
              doc.text(`${String.fromCharCode(65 + oIdx)}) ${opt}${isCorrect ? ' [CORRECT]' : ''}`, 30, currentY);
              currentY += 4.5;
            });

            if (currentY > 270) { doc.addPage(); currentY = 20; }
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`Explanation: ${q.explanation}`, 30, currentY, { maxWidth: pageWidth - 60 });
            currentY += 10;
          });
          currentY += 5;
        }
      });
      currentY += 5;
    });

    currentY += 5;
  });

  // OBE & Roles
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Outcome Based Education (OBE) Goals', 14, currentY);
  currentY += 8;
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  curriculum.obe_outcomes.forEach(outcome => {
    if (currentY > 280) { doc.addPage(); currentY = 20; }
    doc.text(`• ${outcome}`, 18, currentY);
    currentY += 6;
  });

  currentY += 10;
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Industry Readiness: Job Roles', 14, currentY);
  currentY += 8;
  doc.setFontSize(10);
  curriculum.job_roles.forEach(role => {
    if (currentY > 280) { doc.addPage(); currentY = 20; }
    doc.text(`• ${role}`, 18, currentY);
    currentY += 6;
  });
};
