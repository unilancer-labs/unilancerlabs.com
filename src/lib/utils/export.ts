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

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: '#ecfdf5', border: '#10b981', text: '#059669', ring: '#10b981' };
    if (score >= 60) return { bg: '#fffbeb', border: '#f59e0b', text: '#d97706', ring: '#f59e0b' };
    return { bg: '#fef2f2', border: '#ef4444', text: '#dc2626', ring: '#ef4444' };
  };

  // Build Score Cards
  const scoreLabels: { [key: string]: { label: string; icon: string } } = {
    web_presence: { label: 'Web Varlığı', icon: '🌐' },
    social_media: { label: 'Sosyal Medya', icon: '📱' },
    brand_identity: { label: 'Marka Kimliği', icon: '🎨' },
    digital_marketing: { label: 'Dijital Pazarlama', icon: '📈' },
    user_experience: { label: 'Kullanıcı Deneyimi', icon: '👥' }
  };

  let scoreCardsHtml = '';
  if (analysisResult.scores) {
    scoreCardsHtml = '<div class="score-cards-grid">';
    Object.entries(analysisResult.scores).forEach(([key, value]) => {
      if (key !== 'overall' && typeof value === 'number' && scoreLabels[key]) {
        const colors = getScoreColor(value);
        scoreCardsHtml += `
          <div class="score-card" style="background: ${colors.bg}; border-color: ${colors.border};">
            <div class="score-icon">${scoreLabels[key].icon}</div>
            <div class="score-value" style="color: ${colors.text};">${value}</div>
            <div class="score-label">${scoreLabels[key].label}</div>
            <div class="score-bar">
              <div class="score-bar-fill" style="width: ${value}%; background: ${colors.ring};"></div>
            </div>
          </div>
        `;
      }
    });
    scoreCardsHtml += '</div>';
  }

  // Build Technical Status Section
  let technicalHtml = '';
  if (analysisResult.technical_status) {
    const ts = analysisResult.technical_status;
    const sslOk = ts.ssl_status;
    const mobileColors = getScoreColor(ts.mobile_score || 0);
    const desktopColors = getScoreColor(ts.desktop_score || 0);
    const lcpGood = (ts.lcp_mobile || 0) <= 2.5;
    const lcpMedium = (ts.lcp_mobile || 0) <= 4;
    
    technicalHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">⚡</span>
          <h2 class="section-title">Teknik Durum</h2>
        </div>
        <div class="tech-grid">
          <div class="tech-card" style="background: ${sslOk ? '#ecfdf5' : '#fef2f2'}; border-color: ${sslOk ? '#10b981' : '#ef4444'};">
            <div class="tech-icon">${sslOk ? '🔒' : '🔓'}</div>
            <div class="tech-label">SSL Sertifikası</div>
            <div class="tech-value" style="color: ${sslOk ? '#059669' : '#dc2626'};">${sslOk ? 'Aktif ✓' : 'Yok ✗'}</div>
          </div>
          <div class="tech-card" style="background: ${mobileColors.bg}; border-color: ${mobileColors.border};">
            <div class="tech-icon">📱</div>
            <div class="tech-label">Mobil Performans</div>
            <div class="tech-value" style="color: ${mobileColors.text};">${ts.mobile_score || 0}<span class="tech-unit">/100</span></div>
            <div class="tech-bar">
              <div class="tech-bar-fill" style="width: ${ts.mobile_score || 0}%; background: ${mobileColors.ring};"></div>
            </div>
          </div>
          <div class="tech-card" style="background: ${desktopColors.bg}; border-color: ${desktopColors.border};">
            <div class="tech-icon">🖥️</div>
            <div class="tech-label">Masaüstü Performans</div>
            <div class="tech-value" style="color: ${desktopColors.text};">${ts.desktop_score || 0}<span class="tech-unit">/100</span></div>
            <div class="tech-bar">
              <div class="tech-bar-fill" style="width: ${ts.desktop_score || 0}%; background: ${desktopColors.ring};"></div>
            </div>
          </div>
          <div class="tech-card" style="background: ${lcpGood ? '#ecfdf5' : lcpMedium ? '#fffbeb' : '#fef2f2'}; border-color: ${lcpGood ? '#10b981' : lcpMedium ? '#f59e0b' : '#ef4444'};">
            <div class="tech-icon">⏱️</div>
            <div class="tech-label">LCP (Yüklenme)</div>
            <div class="tech-value" style="color: ${lcpGood ? '#059669' : lcpMedium ? '#d97706' : '#dc2626'};">${ts.lcp_mobile || 0}s</div>
            <div class="tech-status">${lcpGood ? '✓ İyi' : lcpMedium ? '⚠ Orta' : '✗ Kritik'}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Build Legal Compliance Section
  let complianceHtml = '';
  if (analysisResult.compliance) {
    const c = analysisResult.compliance;
    const items = [
      { key: 'kvkk', label: 'KVKK Aydınlatma', status: c.kvkk },
      { key: 'cookie_policy', label: 'Çerez Politikası', status: c.cookie_policy },
      { key: 'etbis', label: 'ETBİS Kaydı', status: c.etbis }
    ];
    
    complianceHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🛡️</span>
          <h2 class="section-title">Yasal Uyumluluk Durumu</h2>
        </div>
        <div class="compliance-grid">
          ${items.map(item => `
            <div class="compliance-card" style="background: ${item.status ? '#ecfdf5' : '#fef2f2'}; border-color: ${item.status ? '#10b981' : '#ef4444'};">
              <div class="compliance-icon">${item.status ? '✓' : '✗'}</div>
              <div class="compliance-info">
                <div class="compliance-label">${item.label}</div>
                <div class="compliance-status" style="color: ${item.status ? '#059669' : '#dc2626'};">${item.status ? 'Mevcut' : 'Eksik'}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ${(!c.kvkk || !c.cookie_policy || !c.etbis) ? `
          <div class="compliance-warning">
            <span class="warning-icon">⚠️</span>
            <span><strong>Dikkat:</strong> Eksik yasal uyumluluk belgeleri cezai yaptırımlara neden olabilir. KVKK kapsamında 1.966.862 TL'ye kadar idari para cezası uygulanabilir.</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Build Social Media Section
  let socialMediaHtml = '';
  if (analysisResult.social_media) {
    const sm = analysisResult.social_media;
    socialMediaHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">📲</span>
          <h2 class="section-title">Sosyal Medya Durumu</h2>
        </div>
        <div class="social-grid">
          <div class="social-card">
            <div class="social-icon">🌐</div>
            <div class="social-label">Website</div>
            <div class="social-value">${sm.website || '-'}</div>
          </div>
          <div class="social-card ${sm.linkedin && !sm.linkedin.includes('bulunamadı') ? 'social-active-linkedin' : ''}">
            <div class="social-icon">💼</div>
            <div class="social-label">LinkedIn</div>
            <div class="social-value">${sm.linkedin || 'Bulunamadı'}</div>
          </div>
          <div class="social-card ${sm.instagram && !sm.instagram.includes('Geçersiz') ? 'social-active-instagram' : ''}">
            <div class="social-icon">📸</div>
            <div class="social-label">Instagram</div>
            <div class="social-value">${sm.instagram || 'Bulunamadı'}</div>
          </div>
          <div class="social-card ${sm.facebook && !sm.facebook.includes('bulunamadı') ? 'social-active-facebook' : ''}">
            <div class="social-icon">👍</div>
            <div class="social-label">Facebook</div>
            <div class="social-value">${sm.facebook || 'Bulunamadı'}</div>
          </div>
        </div>
        ${sm.ai_analysis ? `
          <div class="ai-analysis">
            <div class="ai-icon">✨</div>
            <div class="ai-content">
              <div class="ai-title">AI Değerlendirmesi</div>
              <div class="ai-text">${escapeHtml(sm.ai_analysis)}</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Build UI/UX Review Section - Sadeleştirilmiş
  let uiuxHtml = '';
  if (analysisResult.ui_ux_review) {
    const ux = analysisResult.ui_ux_review;
    
    uiuxHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🖼️</span>
          <h2 class="section-title">UI/UX İnceleme</h2>
        </div>
        
        <!-- Two Column Layout -->
        <div class="uiux-layout">
          <!-- Left: Analysis -->
          <div class="uiux-analysis">
            <!-- Overall Assessment -->
            <div class="uiux-overall">
              <div class="uiux-overall-icon">👁️</div>
              <div class="uiux-overall-content">
                <div class="uiux-overall-title">Genel Değerlendirme</div>
                <div class="uiux-overall-text">${escapeHtml(ux.overall_assessment || '')}</div>
              </div>
            </div>
            
            <!-- Highlights -->
            ${ux.highlights && ux.highlights.length > 0 ? `
              <div class="uiux-highlights">
                <div class="uiux-highlights-title">⚠️ Önemli Bulgular</div>
                ${ux.highlights.map((h: string, i: number) => `
                  <div class="uiux-highlight-item">
                    <span class="uiux-highlight-num">${i + 1}</span>
                    <span class="uiux-highlight-text">${escapeHtml(h)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Suggestions -->
            ${ux.suggestions && ux.suggestions.length > 0 ? `
              <div class="uiux-suggestions-inline">
                <div class="uiux-suggestions-title">💡 İyileştirme Önerileri</div>
                ${ux.suggestions.map((s: string, i: number) => `
                  <div class="uiux-suggestion-item-inline">
                    <span class="uiux-suggestion-num">${i + 1}</span>
                    <span class="uiux-suggestion-text">${escapeHtml(s)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <!-- Right: Screenshots -->
          <div class="uiux-screenshots">
            <!-- Desktop -->
            <div class="screenshot-container desktop">
              <div class="screenshot-label">🖥️ Masaüstü Görünüm</div>
              <div class="browser-frame">
                <div class="browser-header">
                  <div class="browser-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <div class="browser-url">${escapeHtml(websiteUrl)}</div>
                </div>
                <div class="browser-content">
                  ${ux.desktop_screenshot_url ? `<img src="${escapeHtml(ux.desktop_screenshot_url)}" alt="Masaüstü Görünüm" onerror="this.style.display='none'" />` : ''}
                  <div class="screenshot-placeholder">
                    <span>🖥️</span>
                    <p>Masaüstü</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile -->
            <div class="screenshot-container mobile">
              <div class="screenshot-label">📱 Mobil Görünüm</div>
              <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-content">
                  ${ux.mobile_screenshot_url ? `<img src="${escapeHtml(ux.mobile_screenshot_url)}" alt="Mobil Görünüm" onerror="this.style.display='none'" />` : ''}
                  <div class="screenshot-placeholder">
                    <span>📱</span>
                    <p>Mobil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Build Pain Points Section
  let painPointsHtml = '';
  if (analysisResult.pain_points && analysisResult.pain_points.length > 0) {
    painPointsHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🎯</span>
          <h2 class="section-title">Tespit Edilen Sorunlar ve Çözümler</h2>
        </div>
        <div class="pain-points">
          ${analysisResult.pain_points.map((point: any, idx: number) => `
            <div class="pain-point-card">
              <div class="pain-problem">
                <div class="pain-icon problem">!</div>
                <div class="pain-content">
                  <div class="pain-label">Sorun #${idx + 1}</div>
                  <div class="pain-text">${escapeHtml(point.issue)}</div>
                </div>
              </div>
              <div class="pain-solution">
                <div class="pain-icon solution">✓</div>
                <div class="pain-content">
                  <div class="pain-label">Önerilen Çözüm</div>
                  <div class="pain-text">${escapeHtml(point.solution)}</div>
                  ${point.service ? `<div class="pain-service">📦 ${escapeHtml(point.service)}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Build Roadmap Section
  let roadmapHtml = '';
  if (analysisResult.roadmap && analysisResult.roadmap.length > 0) {
    const categories = [
      { key: 'immediate', label: 'Acil', color: '#ef4444', bg: '#fef2f2' },
      { key: 'short_term', label: 'Kısa Vade (1-3 ay)', color: '#f59e0b', bg: '#fffbeb' },
      { key: 'medium_term', label: 'Orta Vade (3-6 ay)', color: '#3b82f6', bg: '#eff6ff' },
      { key: 'long_term', label: 'Uzun Vade (6-12 ay)', color: '#10b981', bg: '#ecfdf5' }
    ];
    
    roadmapHtml = `
      <div class="section page-break">
        <div class="section-header">
          <span class="section-icon">📊</span>
          <h2 class="section-title">Dijital Dönüşüm Yol Haritası</h2>
        </div>
        <div class="roadmap-grid">
          ${categories.map(cat => {
            const items = analysisResult.roadmap.filter((r: any) => r.category === cat.key);
            return `
              <div class="roadmap-column">
                <div class="roadmap-header" style="border-color: ${cat.color};">
                  <div class="roadmap-dot" style="background: ${cat.color};"></div>
                  <span style="color: ${cat.color};">${cat.label}</span>
                </div>
                ${items.length > 0 ? items.map((item: any) => `
                  <div class="roadmap-item" style="background: ${cat.bg}; border-color: ${cat.color};">
                    <div class="roadmap-title" style="color: ${cat.color};">${escapeHtml(item.title)}</div>
                    <div class="roadmap-desc">${escapeHtml(item.description)}</div>
                  </div>
                `).join('') : `
                  <div class="roadmap-empty">Aksiyon yok</div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Build Recommendations Section
  let recommendationsHtml = '';
  if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
    recommendationsHtml = `
      <div class="section page-break">
        <div class="section-header">
          <span class="section-icon">💡</span>
          <h2 class="section-title">Öneriler</h2>
        </div>
        <div class="recommendations">
          ${analysisResult.recommendations.map((rec: any, index: number) => {
            const priorityColors = {
              high: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626', label: 'Yüksek' },
              medium: { bg: '#fffbeb', border: '#f59e0b', text: '#d97706', label: 'Orta' },
              low: { bg: '#eff6ff', border: '#3b82f6', text: '#2563eb', label: 'Düşük' }
            };
            const colors = priorityColors[rec.priority as keyof typeof priorityColors] || priorityColors.medium;
            return `
              <div class="recommendation-card">
                <div class="recommendation-header">
                  <span class="recommendation-number">${index + 1}</span>
                  <h4 class="recommendation-title">${escapeHtml(rec.title)}</h4>
                  <span class="priority-badge" style="background: ${colors.bg}; color: ${colors.text}; border-color: ${colors.border};">${colors.label}</span>
                </div>
                <p class="recommendation-desc">${escapeHtml(rec.description)}</p>
                ${rec.impact || rec.effort ? `
                  <div class="recommendation-meta">
                    ${rec.impact ? `<span class="meta-item"><strong>Etki:</strong> ${escapeHtml(rec.impact)}</span>` : ''}
                    ${rec.effort ? `<span class="meta-item"><strong>Efor:</strong> ${escapeHtml(rec.effort)}</span>` : ''}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Build Insights Section
  let insightsHtml = '';
  if (analysisResult.insights && analysisResult.insights.length > 0) {
    insightsHtml = `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🔍</span>
          <h2 class="section-title">İçgörüler</h2>
        </div>
        <div class="insights">
          ${analysisResult.insights.map((insight: any) => {
            const typeColors = {
              positive: { bg: '#ecfdf5', border: '#10b981', icon: '✓' },
              negative: { bg: '#fef2f2', border: '#ef4444', icon: '!' },
              neutral: { bg: '#eff6ff', border: '#3b82f6', icon: 'i' }
            };
            const colors = typeColors[insight.type as keyof typeof typeColors] || typeColors.neutral;
            return `
              <div class="insight-card" style="background: ${colors.bg}; border-left-color: ${colors.border};">
                <h4 class="insight-title">${escapeHtml(insight.title)}</h4>
                <p class="insight-desc">${escapeHtml(insight.description)}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Main score color
  const mainScoreColors = getScoreColor(digitalScore || 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Dijital Analiz Raporu - ${escapeHtml(companyName)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8fafc;
          color: #1e293b;
          font-size: 12px;
          line-height: 1.6;
        }
        
        .page {
          background: white;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
        }
        
        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #5FC8DA 0%, #4AB3C5 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 18px;
        }
        
        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .logo-text span {
          color: #5FC8DA;
        }
        
        .report-meta {
          text-align: right;
        }
        
        .report-date {
          color: #64748b;
          font-size: 11px;
        }
        
        .report-badge {
          display: inline-block;
          background: linear-gradient(135deg, #5FC8DA 0%, #4AB3C5 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          margin-top: 5px;
        }
        
        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }
        
        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(95, 200, 218, 0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .hero-info h1 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }
        
        .hero-company {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        
        .hero-url {
          font-size: 12px;
          color: #64748b;
        }
        
        .hero-score {
          text-align: center;
        }
        
        .score-ring {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: conic-gradient(${mainScoreColors.ring} ${(digitalScore || 0) * 3.6}deg, #334155 0deg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .score-ring-inner {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #1e293b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .score-value {
          font-size: 42px;
          font-weight: 800;
          color: white;
          line-height: 1;
        }
        
        .score-label {
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }
        
        /* Score Cards */
        .score-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }
        
        .score-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          text-align: center;
        }
        
        .score-card .score-icon {
          font-size: 20px;
          margin-bottom: 8px;
        }
        
        .score-card .score-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .score-card .score-label {
          font-size: 10px;
          color: #64748b;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        
        .score-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .score-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s;
        }
        
        /* Sections */
        .section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .section-icon {
          font-size: 18px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }
        
        /* Technical Grid */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .tech-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        
        .tech-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .tech-label {
          font-size: 10px;
          color: #64748b;
          margin-bottom: 6px;
        }
        
        .tech-value {
          font-size: 24px;
          font-weight: 700;
        }
        
        .tech-unit {
          font-size: 12px;
          font-weight: 400;
          color: #94a3b8;
        }
        
        .tech-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-top: 10px;
          overflow: hidden;
        }
        
        .tech-bar-fill {
          height: 100%;
          border-radius: 2px;
        }
        
        .tech-status {
          font-size: 10px;
          margin-top: 6px;
        }
        
        /* Compliance */
        .compliance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        
        .compliance-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .compliance-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
        }
        
        .compliance-label {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .compliance-status {
          font-size: 11px;
          font-weight: 500;
        }
        
        .compliance-warning {
          margin-top: 16px;
          padding: 12px 16px;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 10px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 11px;
          color: #92400e;
        }
        
        .warning-icon {
          font-size: 14px;
        }
        
        /* Social Media */
        .social-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .social-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          background: #f8fafc;
        }
        
        .social-active-linkedin {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        
        .social-active-instagram {
          background: #fdf2f8;
          border-color: #ec4899;
        }
        
        .social-active-facebook {
          background: #eff6ff;
          border-color: #2563eb;
        }
        
        .social-icon {
          font-size: 18px;
          margin-bottom: 6px;
        }
        
        .social-label {
          font-size: 10px;
          color: #64748b;
          margin-bottom: 4px;
        }
        
        .social-value {
          font-size: 10px;
          color: #1e293b;
          word-break: break-all;
        }
        
        .ai-analysis {
          background: linear-gradient(135deg, rgba(95, 200, 218, 0.1) 0%, rgba(95, 200, 218, 0.2) 100%);
          border: 1px solid rgba(95, 200, 218, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
        }
        
        .ai-icon {
          width: 32px;
          height: 32px;
          background: rgba(95, 200, 218, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .ai-title {
          font-size: 11px;
          font-weight: 600;
          color: #0f766e;
          margin-bottom: 4px;
        }
        
        .ai-text {
          font-size: 11px;
          color: #0f766e;
          line-height: 1.5;
        }
        
        /* Pain Points */
        .pain-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .pain-point-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .pain-problem {
          background: #fef2f2;
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          border-bottom: 1px solid #fecaca;
        }
        
        .pain-solution {
          background: #ecfdf5;
          padding: 14px 16px;
          display: flex;
          gap: 12px;
        }
        
        .pain-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .pain-icon.problem {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .pain-icon.solution {
          background: #d1fae5;
          color: #059669;
        }
        
        .pain-label {
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .pain-problem .pain-label {
          color: #dc2626;
        }
        
        .pain-solution .pain-label {
          color: #059669;
        }
        
        .pain-text {
          font-size: 12px;
          color: #1e293b;
        }
        
        .pain-service {
          margin-top: 8px;
          display: inline-block;
          background: rgba(95, 200, 218, 0.15);
          color: #0f766e;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
        }
        
        /* Roadmap */
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .roadmap-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .roadmap-header {
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .roadmap-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .roadmap-item {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
        }
        
        .roadmap-title {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .roadmap-desc {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
        }
        
        .roadmap-empty {
          padding: 12px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          text-align: center;
          font-size: 10px;
          color: #94a3b8;
        }
        
        /* Recommendations */
        .recommendations {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .recommendation-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }
        
        .recommendation-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .recommendation-number {
          width: 24px;
          height: 24px;
          background: #5FC8DA;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .recommendation-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .priority-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          border: 1px solid;
          flex-shrink: 0;
        }
        
        .recommendation-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        
        .recommendation-meta {
          display: flex;
          gap: 20px;
        }
        
        .meta-item {
          font-size: 11px;
          color: #94a3b8;
        }
        
        .meta-item strong {
          color: #64748b;
        }
        
        /* Insights */
        .insights {
          display: grid;
          gap: 12px;
        }
        
        .insight-card {
          padding: 16px;
          border-radius: 10px;
          border-left: 4px solid;
        }
        
        .insight-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 6px;
        }
        
        .insight-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        
        /* Summary */
        .summary-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #5FC8DA;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .summary-title {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .summary-text {
          font-size: 12px;
          color: #64748b;
          line-height: 1.7;
        }
        
        /* Footer */
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
        }
        
        .footer-text {
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.6;
        }
        
        .footer-brand {
          font-weight: 600;
          color: #5FC8DA;
        }
        
        /* UI/UX Review Styles */
        .uiux-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }
        
        .uiux-analysis {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .uiux-overall {
          background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
          border: 1px solid #c4b5fd;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
        }
        
        .uiux-overall-icon {
          width: 32px;
          height: 32px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .uiux-overall-title {
          font-size: 11px;
          font-weight: 600;
          color: #6b21a8;
          margin-bottom: 4px;
        }
        
        .uiux-overall-text {
          font-size: 11px;
          color: #7c3aed;
          line-height: 1.5;
        }
        
        .uiux-scores {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .uiux-score-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
        }
        
        .uiux-score-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        
        .uiux-score-icon {
          font-size: 14px;
        }
        
        .uiux-score-label {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
        }
        
        .uiux-score-value {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        
        .uiux-score-value span {
          font-size: 12px;
          font-weight: 400;
          color: #94a3b8;
        }
        
        .uiux-score-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        
        .uiux-score-bar-fill {
          height: 100%;
          border-radius: 2px;
        }
        
        .uiux-score-feedback {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
        }
        
        .uiux-screenshot {
          position: relative;
        }
        
        .browser-frame {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .browser-header {
          background: #f1f5f9;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .browser-dots {
          display: flex;
          gap: 4px;
        }
        
        .browser-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .browser-dots .dot.red { background: #f87171; }
        .browser-dots .dot.yellow { background: #fbbf24; }
        .browser-dots .dot.green { background: #4ade80; }
        
        .browser-url {
          flex: 1;
          background: white;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 10px;
          color: #64748b;
          margin-left: 12px;
        }
        
        .browser-content {
          background: #f8fafc;
          min-height: 300px;
          position: relative;
        }
        
        .browser-content img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .screenshot-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }
        
        .screenshot-placeholder span {
          font-size: 48px;
          margin-bottom: 12px;
        }
        
        .screenshot-placeholder p {
          font-size: 14px;
          font-weight: 500;
        }
        
        .uiux-suggestions {
          background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
          border: 1px solid #93c5fd;
          border-radius: 12px;
          padding: 16px;
        }
        
        .uiux-suggestions-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 12px;
        }
        
        .uiux-suggestions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .uiux-suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(255, 255, 255, 0.6);
          padding: 8px 10px;
          border-radius: 8px;
        }
        
        .uiux-suggestion-num {
          width: 20px;
          height: 20px;
          background: rgba(59, 130, 246, 0.2);
          color: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .uiux-suggestion-text {
          font-size: 10px;
          color: #1e40af;
          line-height: 1.4;
        }
        
        /* Print Styles */
        @media print {
          body {
            background: white;
          }
          
          .page {
            padding: 20px;
            max-width: 100%;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .section {
            page-break-inside: avoid;
          }
          
          .uiux-layout {
            grid-template-columns: 1fr 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header -->
        <div class="header">
          <div class="logo-container">
            <div class="logo-icon">U</div>
            <div class="logo-text">Unilancer <span>Labs</span></div>
          </div>
          <div class="report-meta">
            <div class="report-date">${currentDate}</div>
            <div class="report-badge">DİJİTAL ANALİZ RAPORU</div>
          </div>
        </div>
        
        <!-- Hero Section -->
        <div class="hero">
          <div class="hero-content">
            <div class="hero-info">
              <h1>Dijital Analiz Raporu</h1>
              <div class="hero-company">${escapeHtml(companyName)}</div>
              <div class="hero-url">${escapeHtml(websiteUrl)}</div>
            </div>
            ${digitalScore !== undefined ? `
              <div class="hero-score">
                <div class="score-ring">
                  <div class="score-ring-inner">
                    <div class="score-value">${digitalScore}</div>
                    <div class="score-label">Genel Skor</div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Score Cards -->
        ${scoreCardsHtml}
        
        <!-- Summary -->
        ${analysisResult.summary ? `
          <div class="summary-box">
            <div class="summary-title">📄 Özet Değerlendirme</div>
            <div class="summary-text">${escapeHtml(analysisResult.summary)}</div>
          </div>
        ` : ''}
        
        <!-- Technical Status -->
        ${technicalHtml}
        
        <!-- Legal Compliance -->
        ${complianceHtml}
        
        <!-- Social Media -->
        ${socialMediaHtml}
        
        <!-- UI/UX Review -->
        ${uiuxHtml}
        
        <!-- Pain Points -->
        ${painPointsHtml}
        
        <!-- Roadmap -->
        ${roadmapHtml}
        
        <!-- Recommendations -->
        ${recommendationsHtml}
        
        <!-- Insights -->
        ${insightsHtml}
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-text">
            Bu rapor <span class="footer-brand">Unilancer Labs</span> AI destekli dijital analiz sistemi tarafından otomatik olarak oluşturulmuştur.<br>
            © ${new Date().getFullYear()} Unilancer Labs - Tüm hakları saklıdır. | www.unilancerlabs.com
          </div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
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
