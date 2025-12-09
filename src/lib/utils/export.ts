/**
 * Export utilities for admin panel
 * Supports PDF, Excel (XLSX), and CSV exports
 */

// CSV Export
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[]
): void {
  if (data.length === 0) {
    alert('Dışa aktarılacak veri bulunamadı.');
    return;
  }

  // Create header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Handle arrays
      if (Array.isArray(value)) {
        value = value.join(', ');
      }
      
      // Handle objects
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  
  // Add BOM for UTF-8 support in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  downloadBlob(blob, `${filename}.csv`);
}

// Excel Export (Simple HTML table approach - works without external libraries)
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[],
  sheetName: string = 'Sheet1'
): void {
  if (data.length === 0) {
    alert('Dışa aktarılacak veri bulunamadı.');
    return;
  }

  // Create HTML table
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${sheetName}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th { background-color: #5FC8DA; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach(item => {
    html += '<tr>';
    columns.forEach(col => {
      let value = item[col.key];
      
      if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      } else if (value === null || value === undefined) {
        value = '';
      }
      
      html += `<td>${escapeHtml(String(value))}</td>`;
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, `${filename}.xls`);
}

// PDF Export (Using browser's print functionality with styled content)
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[],
  title: string
): void {
  if (data.length === 0) {
    alert('Dışa aktarılacak veri bulunamadı.');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up engelleyici aktif olabilir. Lütfen pop-up\'lara izin verin.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let tableRows = '';
  data.forEach((item, index) => {
    tableRows += `<tr class="${index % 2 === 0 ? 'even' : 'odd'}">`;
    columns.forEach(col => {
      let value = item[col.key];
      
      if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      } else if (value === null || value === undefined) {
        value = '-';
      }
      
      tableRows += `<td>${escapeHtml(String(value))}</td>`;
    });
    tableRows += '</tr>';
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
          font-size: 12px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #5FC8DA;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #5FC8DA;
        }
        .date {
          color: #666;
          font-size: 11px;
        }
        h1 {
          font-size: 20px;
          margin-bottom: 20px;
          color: #1a1a1a;
        }
        .stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .stat-box {
          background: #f5f5f5;
          padding: 10px 20px;
          border-radius: 8px;
        }
        .stat-box strong {
          display: block;
          font-size: 18px;
          color: #5FC8DA;
        }
        .stat-box span {
          font-size: 11px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #5FC8DA;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #eee;
          font-size: 11px;
        }
        tr.even {
          background-color: #fafafa;
        }
        tr.odd {
          background-color: white;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #999;
          font-size: 10px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">UNILANCER</div>
        <div class="date">Oluşturulma Tarihi: ${currentDate}</div>
      </div>
      
      <h1>${title}</h1>
      
      <div class="stats">
        <div class="stat-box">
          <strong>${data.length}</strong>
          <span>Toplam Kayıt</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      
      <div class="footer">
        Bu rapor Unilancer Admin Panel tarafından otomatik olarak oluşturulmuştur.
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Single record PDF export (for detail pages)
export function exportDetailToPDF<T extends Record<string, any>>(
  data: T,
  filename: string,
  sections: {
    title: string;
    fields: { key: keyof T; label: string; format?: (value: any) => string }[];
  }[],
  mainTitle: string
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up engelleyici aktif olabilir. Lütfen pop-up\'lara izin verin.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let sectionsHtml = '';
  sections.forEach(section => {
    sectionsHtml += `
      <div class="section">
        <h2>${section.title}</h2>
        <div class="fields">
    `;
    section.fields.forEach(field => {
      let value = data[field.key];
      if (field.format) {
        value = field.format(value);
      } else if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      } else if (value === null || value === undefined) {
        value = '-';
      }
      
      sectionsHtml += `
        <div class="field">
          <label>${field.label}</label>
          <span>${escapeHtml(String(value))}</span>
        </div>
      `;
    });
    sectionsHtml += `
        </div>
      </div>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${mainTitle}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
          font-size: 13px;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #5FC8DA;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #5FC8DA;
        }
        .date {
          color: #666;
          font-size: 11px;
        }
        h1 {
          font-size: 22px;
          margin-bottom: 30px;
          color: #1a1a1a;
        }
        .section {
          margin-bottom: 30px;
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
          border: 1px solid #eee;
        }
        .section h2 {
          font-size: 14px;
          color: #5FC8DA;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .fields {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .field label {
          font-size: 11px;
          color: #888;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field span {
          color: #333;
          font-size: 13px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #999;
          font-size: 10px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">UNILANCER</div>
        <div class="date">Oluşturulma Tarihi: ${currentDate}</div>
      </div>
      
      <h1>${mainTitle}</h1>
      
      ${sectionsHtml}
      
      <div class="footer">
        Bu rapor Unilancer Admin Panel tarafından otomatik olarak oluşturulmuştur.
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Helper function to download blob
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format date for export
export function formatDateForExport(dateString: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format status for export
export function formatStatusForExport(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Bekliyor',
    reviewing: 'İnceleniyor',
    interview: 'Mülakat',
    accepted: 'Kabul Edildi',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    'in-progress': 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi',
  };
  return statusMap[status] || status;
}

// Export Digital Analysis Report to PDF
export function exportAnalysisReportToPDF(
  companyName: string,
  websiteUrl: string,
  digitalScore: number | undefined,
  analysisResult: any
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up engelleyici aktif olabilir. Lütfen pop-up\'lara izin verin.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Build scores section
  let scoresHtml = '';
  if (analysisResult.scores) {
    scoresHtml = '<div class="scores-grid">';
    Object.entries(analysisResult.scores).forEach(([key, value]) => {
      if (key !== 'overall' && typeof value === 'number') {
        const scoreClass = value >= 80 ? 'score-high' : value >= 60 ? 'score-medium' : 'score-low';
        scoresHtml += `
          <div class="score-card ${scoreClass}">
            <div class="score-value">${value}</div>
            <div class="score-label">${key.replace(/_/g, ' ')}</div>
          </div>
        `;
      }
    });
    scoresHtml += '</div>';
  }

  // Build recommendations section
  let recommendationsHtml = '';
  if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
    recommendationsHtml = '<div class="recommendations">';
    analysisResult.recommendations.forEach((rec: any, index: number) => {
      const priorityClass = rec.priority === 'high' ? 'priority-high' : rec.priority === 'medium' ? 'priority-medium' : 'priority-low';
      recommendationsHtml += `
        <div class="recommendation-item">
          <div class="recommendation-header">
            <h4>${index + 1}. ${escapeHtml(rec.title)}</h4>
            <span class="priority-badge ${priorityClass}">${rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}</span>
          </div>
          <p>${escapeHtml(rec.description)}</p>
          ${rec.impact || rec.effort ? `
            <div class="recommendation-meta">
              ${rec.impact ? `<span><strong>Etki:</strong> ${escapeHtml(rec.impact)}</span>` : ''}
              ${rec.effort ? `<span><strong>Efor:</strong> ${escapeHtml(rec.effort)}</span>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    });
    recommendationsHtml += '</div>';
  }

  // Build insights section
  let insightsHtml = '';
  if (analysisResult.insights && analysisResult.insights.length > 0) {
    insightsHtml = '<div class="insights">';
    analysisResult.insights.forEach((insight: any) => {
      const typeClass = insight.type === 'positive' ? 'insight-positive' : insight.type === 'negative' ? 'insight-negative' : 'insight-neutral';
      insightsHtml += `
        <div class="insight-item ${typeClass}">
          <h4>${escapeHtml(insight.title)}</h4>
          <p>${escapeHtml(insight.description)}</p>
        </div>
      `;
    });
    insightsHtml += '</div>';
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Dijital Analiz Raporu - ${escapeHtml(companyName)}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
          font-size: 13px;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #5FC8DA;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #5FC8DA;
        }
        .date {
          color: #666;
          font-size: 11px;
        }
        .title-section {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #5FC8DA 0%, #4AB3C5 100%);
          color: white;
          border-radius: 12px;
        }
        .title-section h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .title-section .company {
          font-size: 18px;
          opacity: 0.95;
          margin-bottom: 5px;
        }
        .title-section .url {
          font-size: 12px;
          opacity: 0.8;
        }
        .overall-score {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px solid #e0e0e0;
        }
        .overall-score .label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .overall-score .value {
          font-size: 72px;
          font-weight: bold;
          color: #5FC8DA;
          line-height: 1;
        }
        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          color: #1a1a1a;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #5FC8DA;
          font-weight: 600;
        }
        .executive-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #5FC8DA;
          margin-bottom: 30px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .score-card {
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
        }
        .score-card.score-high {
          background: #e8f5e9;
          border-color: #4caf50;
        }
        .score-card.score-medium {
          background: #fff8e1;
          border-color: #ffc107;
        }
        .score-card.score-low {
          background: #ffebee;
          border-color: #f44336;
        }
        .score-value {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .score-card.score-high .score-value {
          color: #4caf50;
        }
        .score-card.score-medium .score-value {
          color: #ffc107;
        }
        .score-card.score-low .score-value {
          color: #f44336;
        }
        .score-label {
          font-size: 11px;
          text-transform: capitalize;
          color: #666;
        }
        .recommendations {
          margin: 20px 0;
        }
        .recommendation-item {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .recommendation-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }
        .recommendation-header h4 {
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 600;
        }
        .priority-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .priority-high {
          background: #ffebee;
          color: #c62828;
        }
        .priority-medium {
          background: #fff8e1;
          color: #f57c00;
        }
        .priority-low {
          background: #e3f2fd;
          color: #1976d2;
        }
        .recommendation-item p {
          color: #555;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .recommendation-meta {
          display: flex;
          gap: 15px;
          font-size: 11px;
          color: #888;
        }
        .insights {
          margin: 20px 0;
        }
        .insight-item {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid;
        }
        .insight-positive {
          background: #e8f5e9;
          border-color: #4caf50;
        }
        .insight-negative {
          background: #ffebee;
          border-color: #f44336;
        }
        .insight-neutral {
          background: #e3f2fd;
          border-color: #2196f3;
        }
        .insight-item h4 {
          font-size: 13px;
          margin-bottom: 5px;
          color: #1a1a1a;
        }
        .insight-item p {
          font-size: 12px;
          color: #555;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          color: #999;
          font-size: 10px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">UNILANCER</div>
        <div class="date">Rapor Tarihi: ${currentDate}</div>
      </div>
      
      <div class="title-section">
        <h1>Dijital Analiz Raporu</h1>
        <div class="company">${escapeHtml(companyName)}</div>
        <div class="url">${escapeHtml(websiteUrl)}</div>
      </div>

      ${digitalScore !== undefined ? `
        <div class="overall-score">
          <div class="label">Genel Dijital Skor</div>
          <div class="value">${digitalScore}</div>
        </div>
      ` : ''}

      ${analysisResult.executive_summary ? `
        <div class="section">
          <h2 class="section-title">Yönetici Özeti</h2>
          <div class="executive-summary">
            ${escapeHtml(analysisResult.executive_summary).replace(/\n/g, '<br>')}
          </div>
        </div>
      ` : ''}

      ${scoresHtml ? `
        <div class="section">
          <h2 class="section-title">Detaylı Skorlar</h2>
          ${scoresHtml}
        </div>
      ` : ''}

      ${recommendationsHtml ? `
        <div class="section">
          <h2 class="section-title">Öneriler</h2>
          ${recommendationsHtml}
        </div>
      ` : ''}

      ${insightsHtml ? `
        <div class="section">
          <h2 class="section-title">İçgörüler</h2>
          ${insightsHtml}
        </div>
      ` : ''}

      <div class="footer">
        Bu rapor Unilancer AI destekli dijital analiz sistemi tarafından otomatik olarak oluşturulmuştur.<br>
        © ${new Date().getFullYear()} Unilancer - Tüm hakları saklıdır.
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
