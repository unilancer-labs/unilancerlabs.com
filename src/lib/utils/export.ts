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
