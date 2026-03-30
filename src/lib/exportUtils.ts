import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], filename: string, title: string) => {
  if (data.length === 0) return;

  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const body = data.map(row => Object.values(row));

  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 20,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }, // blue-600
  });

  doc.save(`${filename}.pdf`);
};

export const exportAnalysisToPDF = (analysis: any, filename: string, title: string) => {
  if (!analysis) return;

  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(20);
  doc.text(title, 14, y);
  y += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Overview:', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  const overviewLines = doc.splitTextToSize(analysis.overview || '', 180);
  doc.text(overviewLines, 14, y);
  y += overviewLines.length * 7 + 5;

  const sections = [
    { title: 'Key Insights', data: analysis.insights },
    { title: 'Market Issues', data: analysis.issues },
    { title: 'Opportunities', data: analysis.opportunities },
    { title: 'Recommendations', data: analysis.recommendations }
  ];

  sections.forEach(section => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${section.title}:`, 14, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    (section.data || []).forEach((item: string) => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      if (y + lines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * 7;
    });
    y += 5;
  });

  doc.save(`${filename}.pdf`);
};
