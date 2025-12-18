// Report Parser Utility
// Parses the text-based report format into structured data

import type { AnalysisResult, CategoryScores, Recommendation, ReportData, ReportSection } from '../types';

interface ParsedReport {
  companyName: string;
  reportDate: string;
  overallScore: number;
  sections: ParsedSection[];
  recommendations: Recommendation[];
}

interface ParsedSection {
  title: string;
  score: number;
  maxScore: number;
  items: ParsedItem[];
  status: 'good' | 'warning' | 'critical';
}

interface ParsedItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

/**
 * Parses a text-based report into structured data
 */
export function parseReportText(reportText: string): ParsedReport {
  const lines = reportText.split('\n').map(line => line.trim()).filter(Boolean);
  
  const report: ParsedReport = {
    companyName: '',
    reportDate: '',
    overallScore: 0,
    sections: [],
    recommendations: [],
  };

  let currentSection: ParsedSection | null = null;
  let inRecommendations = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Parse company name
    if (line.includes('DİJİTAL VARLIK ANALİZ RAPORU')) {
      // Next line might have company name
      if (i + 1 < lines.length && lines[i + 1].includes('Şirket:')) {
        report.companyName = lines[i + 1].replace('Şirket:', '').trim();
      }
      continue;
    }

    // Parse date
    if (line.startsWith('Tarih:') || line.startsWith('Rapor Tarihi:')) {
      report.reportDate = line.replace(/Tarih:|Rapor Tarihi:/, '').trim();
      continue;
    }

    // Parse overall score
    if (line.includes('GENEL DİJİTAL SKOR') || line.includes('Genel Skor:')) {
      const scoreMatch = line.match(/(\d+)\/100/);
      if (scoreMatch) {
        report.overallScore = parseInt(scoreMatch[1], 10);
      }
      continue;
    }

    // Check for section headers
    const sectionMatch = parseSectionHeader(line);
    if (sectionMatch) {
      if (currentSection) {
        report.sections.push(currentSection);
      }
      currentSection = {
        title: sectionMatch.title,
        score: sectionMatch.score,
        maxScore: sectionMatch.maxScore,
        items: [],
        status: getScoreStatus(sectionMatch.score, sectionMatch.maxScore),
      };
      continue;
    }

    // Check for recommendations section
    if (line.includes('ÖNCELİKLİ ÖNERİLER') || line.includes('ÖNERILER')) {
      if (currentSection) {
        report.sections.push(currentSection);
        currentSection = null;
      }
      inRecommendations = true;
      continue;
    }

    // Parse items within sections
    if (currentSection && !inRecommendations) {
      const itemMatch = parseItemLine(line);
      if (itemMatch) {
        currentSection.items.push(itemMatch);
      }
    }

    // Parse recommendations
    if (inRecommendations) {
      const recMatch = parseRecommendation(line, i);
      if (recMatch) {
        report.recommendations.push(recMatch);
      }
    }
  }

  // Add last section if exists
  if (currentSection) {
    report.sections.push(currentSection);
  }

  return report;
}

/**
 * Parses a section header like "1. WEB SİTESİ ANALİZİ (12/20)"
 */
function parseSectionHeader(line: string): { title: string; score: number; maxScore: number } | null {
  const patterns = [
    /^\d+\.\s*(.+?)\s*\((\d+)\/(\d+)\)/,
    /^[A-Z\sİĞÜŞÖÇ]+\s*\((\d+)\/(\d+)\)/,
    /^#+\s*(.+?)\s*-\s*(\d+)\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        title: match[1]?.trim() || line.split('(')[0].replace(/^\d+\.\s*/, '').trim(),
        score: parseInt(match[2] || match[1], 10),
        maxScore: parseInt(match[3] || match[2], 10),
      };
    }
  }

  return null;
}

/**
 * Parses an item line like "✓ SSL Sertifikası: Aktif"
 */
function parseItemLine(line: string): ParsedItem | null {
  // Skip empty or header-like lines
  if (line.length < 3 || line.startsWith('#') || line.startsWith('---')) {
    return null;
  }

  let status: 'good' | 'warning' | 'critical' = 'good';
  let cleanLine = line;

  // Check for status indicators
  if (line.includes('✓') || line.includes('✅') || line.includes('[+]')) {
    status = 'good';
    cleanLine = line.replace(/[✓✅[+\]]/g, '').trim();
  } else if (line.includes('⚠') || line.includes('⚡') || line.includes('[!]')) {
    status = 'warning';
    cleanLine = line.replace(/[⚠⚡[!\]]/g, '').trim();
  } else if (line.includes('✗') || line.includes('❌') || line.includes('[-]')) {
    status = 'critical';
    cleanLine = line.replace(/[✗❌[-\]]/g, '').trim();
  } else if (line.startsWith('-') || line.startsWith('•')) {
    cleanLine = line.replace(/^[-•]\s*/, '').trim();
  }

  // Parse label:value format
  const colonIndex = cleanLine.indexOf(':');
  if (colonIndex > 0) {
    return {
      label: cleanLine.substring(0, colonIndex).trim(),
      value: cleanLine.substring(colonIndex + 1).trim(),
      status,
    };
  }

  // If no colon, use the whole line as label
  if (cleanLine.length > 3) {
    return {
      label: cleanLine,
      value: '',
      status,
    };
  }

  return null;
}

/**
 * Parses a recommendation line
 */
function parseRecommendation(line: string, index: number): Recommendation | null {
  // Check for numbered recommendations
  const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
  if (numberedMatch) {
    const priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
    return {
      id: `rec-${index}`,
      category: 'general',
      priority,
      title: numberedMatch[2],
      description: '',
      impact: priority === 'high' ? 'Yüksek' : priority === 'medium' ? 'Orta' : 'Düşük',
      effort: 'medium',
    };
  }

  // Check for bullet point recommendations
  if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
    const content = line.replace(/^[-•*]\s*/, '').trim();
    if (content.length > 10) {
      return {
        id: `rec-${index}`,
        category: 'general',
        priority: 'medium',
        title: content,
        description: '',
        impact: 'Orta',
        effort: 'medium',
      };
    }
  }

  return null;
}

/**
 * Determines status based on score percentage
 */
function getScoreStatus(score: number, maxScore: number): 'good' | 'warning' | 'critical' {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 70) return 'good';
  if (percentage >= 40) return 'warning';
  return 'critical';
}

/**
 * Converts parsed report to AnalysisResult format
 */
export function convertToAnalysisResult(parsed: ParsedReport): AnalysisResult {
  const categoryMapping: Record<string, keyof CategoryScores> = {
    'web sitesi': 'website',
    'seo': 'seo',
    'sosyal medya': 'social_media',
    'içerik': 'content',
    'marka': 'branding',
    'analitik': 'analytics',
  };

  const scores: CategoryScores = {
    website: { score: 0, maxScore: 20, label: 'Web Sitesi', description: '' },
    seo: { score: 0, maxScore: 20, label: 'SEO', description: '' },
    social_media: { score: 0, maxScore: 20, label: 'Sosyal Medya', description: '' },
    content: { score: 0, maxScore: 15, label: 'İçerik', description: '' },
    branding: { score: 0, maxScore: 15, label: 'Marka', description: '' },
    analytics: { score: 0, maxScore: 10, label: 'Analitik', description: '' },
  };

  // Map parsed sections to category scores
  for (const section of parsed.sections) {
    const sectionLower = section.title.toLowerCase();
    for (const [keyword, categoryKey] of Object.entries(categoryMapping)) {
      if (sectionLower.includes(keyword)) {
        scores[categoryKey] = {
          score: section.score,
          maxScore: section.maxScore,
          label: section.title,
          description: `${section.items.length} madde analiz edildi`,
          details: section.items.map(item => 
            item.value ? `${item.label}: ${item.value}` : item.label
          ),
        };
        break;
      }
    }
  }

  // Identify strengths and weaknesses from sections
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const section of parsed.sections) {
    for (const item of section.items) {
      if (item.status === 'good' && strengths.length < 5) {
        strengths.push(item.value ? `${item.label}: ${item.value}` : item.label);
      } else if (item.status === 'critical' && weaknesses.length < 5) {
        weaknesses.push(item.value ? `${item.label}: ${item.value}` : item.label);
      }
    }
  }

  return {
    summary: `${parsed.companyName} için hazırlanan dijital analiz raporunda genel skor ${parsed.overallScore}/100 olarak belirlendi.`,
    scores,
    recommendations: parsed.recommendations,
    strengths,
    weaknesses,
    opportunities: [],
  };
}

/**
 * Converts parsed report to ReportData format for storage
 */
export function convertToReportData(parsed: ParsedReport): ReportData {
  const sections: ReportSection[] = parsed.sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.title,
    score: section.score,
    status: section.status,
    content: section.items.map(item => 
      item.value ? `${item.label}: ${item.value}` : item.label
    ).join('\n'),
    items: section.items.map(item => ({
      label: item.label,
      value: item.value,
      status: item.status,
    })),
  }));

  return {
    generatedAt: parsed.reportDate || new Date().toISOString(),
    version: '1.0',
    sections,
  };
}

/**
 * Generates a comprehensive text summary of the report for AI context
 * Bu fonksiyon digiBot'un rapor hakkında akıllı yanıtlar verebilmesi için kritik
 */
export function generateReportContext(report: {
  company_name: string;
  company_website?: string;
  digital_score?: number;
  analysis_result?: AnalysisResult;
  industry?: string;
  created_at?: string;
}): string {
  const parts: string[] = [];

  // Temel Bilgiler
  parts.push(`## RAPOR BİLGİLERİ`);
  parts.push(`Şirket: ${report.company_name}`);
  if (report.company_website) parts.push(`Website: ${report.company_website}`);
  if (report.industry) parts.push(`Sektör: ${report.industry}`);
  if (report.created_at) parts.push(`Rapor Tarihi: ${new Date(report.created_at).toLocaleDateString('tr-TR')}`);
  
  if (report.digital_score !== undefined) {
    const scoreLabel = report.digital_score >= 70 ? '🟢 İyi' : report.digital_score >= 40 ? '🟡 Orta' : '🔴 Düşük';
    parts.push(`Genel Dijital Skor: ${report.digital_score}/100 (${scoreLabel})`);
  }

  if (!report.analysis_result) {
    return parts.join('\n');
  }

  const result = report.analysis_result;

  // ==========================================
  // YENİ FORMAT V2 - Firma Kartı
  // ==========================================
  if (result.firma_karti) {
    parts.push(`\n## FİRMA KARTI`);
    parts.push(`Firma Adı: ${result.firma_karti.firma_adi}`);
    if (result.firma_karti.website) parts.push(`Website: ${result.firma_karti.website}`);
    if (result.firma_karti.sektor) parts.push(`Sektör: ${result.firma_karti.sektor}`);
    if (result.firma_karti.is_modeli) parts.push(`İş Modeli: ${result.firma_karti.is_modeli}`);
    if (result.firma_karti.hedef_kitle) parts.push(`Hedef Kitle: ${result.firma_karti.hedef_kitle}`);
    if (result.firma_karti.firma_tanitimi) {
      parts.push(`\n### Firma Tanıtımı`);
      parts.push(result.firma_karti.firma_tanitimi);
    }
  } else if (result.firma_tanitimi) {
    // Eski format - Firma Tanıtımı
    parts.push(`\n## FİRMA TANITIMI`);
    parts.push(result.firma_tanitimi);
  }

  // Sektör bilgisi (eski format)
  if (!result.firma_karti && result.sektor) {
    parts.push(`\n## SEKTÖR: ${result.sektor}`);
    if (result.musteri_kitlesi) parts.push(`Müşteri Kitlesi: ${result.musteri_kitlesi}`);
    if (result.pazar_boyutu) parts.push(`Pazar Boyutu: ${result.pazar_boyutu}`);
  }

  // ==========================================
  // YENİ FORMAT V2 - Performans Analizi
  // ==========================================
  if (result.performans) {
    parts.push('\n## PERFORMANS ANALİZİ');
    const perf = result.performans;
    if (perf.mobil) {
      const mobilIcon = perf.mobil.durum === 'iyi' ? '✅' : perf.mobil.durum === 'orta' ? '⚠️' : '❌';
      parts.push(`- Mobil: ${perf.mobil.skor}/100 ${mobilIcon} (${perf.mobil.durum})`);
      if (perf.mobil.yorum) parts.push(`  → ${perf.mobil.yorum}`);
    }
    if (perf.desktop) {
      const desktopIcon = perf.desktop.durum === 'iyi' ? '✅' : perf.desktop.durum === 'orta' ? '⚠️' : '❌';
      parts.push(`- Masaüstü: ${perf.desktop.skor}/100 ${desktopIcon} (${perf.desktop.durum})`);
      if (perf.desktop.yorum) parts.push(`  → ${perf.desktop.yorum}`);
    }
    if (perf.lcp_mobil) parts.push(`- LCP Mobil: ${perf.lcp_mobil}`);
    if (perf.lcp_desktop) parts.push(`- LCP Masaüstü: ${perf.lcp_desktop}`);
    if (perf.etki) parts.push(`Etki: ${perf.etki}`);
  }

  // ==========================================
  // YENİ FORMAT V2 - SEO Analizi (Detaylı)
  // ==========================================
  if (result.seo) {
    parts.push('\n## SEO ANALİZİ');
    const seo = result.seo;
    const seoIcon = seo.durum === 'iyi' ? '✅' : seo.durum === 'orta' ? '⚠️' : '❌';
    parts.push(`SEO Puanı: ${seo.puan}/100 ${seoIcon} (${seo.durum})`);
    
    if (typeof seo.baslik === 'object') {
      parts.push(`Başlık: ${seo.baslik.mevcut} (${seo.baslik.durum})`);
    }
    if (typeof seo.meta === 'object') {
      parts.push(`Meta: ${seo.meta.mevcut} (${seo.meta.durum})`);
    }
    
    if (seo.basarilar?.length) {
      parts.push('Başarılar:');
      seo.basarilar.forEach(b => parts.push(`  ✅ ${b}`));
    }
    if (seo.eksikler?.length) {
      parts.push('Eksikler:');
      seo.eksikler.forEach(e => parts.push(`  ❌ ${e}`));
    }
    if (seo.aksiyonlar?.length) {
      parts.push('Önerilen Aksiyonlar:');
      seo.aksiyonlar.forEach(a => parts.push(`  📋 ${a.is} (Etki: ${a.etki}, Süre: ${a.sure})`));
    }
  }

  // ==========================================
  // YENİ FORMAT V2 - UI/UX Analizi
  // ==========================================
  if (result.ui_ux) {
    parts.push('\n## UI/UX ANALİZİ');
    const uiux = result.ui_ux;
    parts.push(`Puan: ${uiux.puan}/100`);
    if (uiux.tasarim) parts.push(`Tasarım: ${uiux.tasarim}`);
    if (uiux.izlenim) parts.push(`İzlenim: ${uiux.izlenim}`);
    if (uiux.oneriler?.length) {
      parts.push('Öneriler:');
      uiux.oneriler.forEach(o => parts.push(`  💡 ${o}`));
    }
  } else if (result.ui_ux_degerlendirmesi) {
    // Eski format
    parts.push('\n## UI/UX DEĞERLENDİRMESİ');
    parts.push(result.ui_ux_degerlendirmesi);
  }

  // ==========================================
  // YENİ FORMAT V2 - Sektör Analizi
  // ==========================================
  if (result.sektor_analiz) {
    parts.push('\n## SEKTÖR ANALİZİ');
    const sa = result.sektor_analiz;
    if (sa.ana) parts.push(`Sektör: ${sa.ana}`);
    if (sa.is_modeli) parts.push(`İş Modeli: ${sa.is_modeli}`);
    if (sa.pazar) parts.push(`Pazar: ${sa.pazar}`);
    if (sa.firsatlar?.length) {
      parts.push('Fırsatlar:');
      sa.firsatlar.forEach(f => parts.push(`  💡 ${f}`));
    }
    if (sa.tehditler?.length) {
      parts.push('Tehditler:');
      sa.tehditler.forEach(t => parts.push(`  ⚠️ ${t}`));
    }
  }

  // Kategori Skorları (detaylı)
  if (result.scores) {
    parts.push('\n## KATEGORİ SKORLARI');
    for (const [key, value] of Object.entries(result.scores)) {
      if (key === 'overall') continue;
      if (typeof value === 'number') {
        const status = value >= 70 ? '✅' : value >= 40 ? '⚠️' : '❌';
        parts.push(`- ${key}: ${value}/100 ${status}`);
      } else if (value && typeof value === 'object') {
        const percentage = Math.round((value.score / value.maxScore) * 100);
        const status = percentage >= 70 ? '✅' : percentage >= 40 ? '⚠️' : '❌';
        parts.push(`- ${value.label}: ${value.score}/${value.maxScore} (${percentage}%) ${status}`);
        if (value.description) {
          parts.push(`  → ${value.description}`);
        }
      }
    }
  }

  // Güçlü Yönler (yeni format v2 - kategori ve istatistik dahil)
  if (result.guclu_yonler && result.guclu_yonler.length > 0) {
    parts.push('\n## GÜÇLÜ YÖNLER');
    result.guclu_yonler.forEach((item, i) => {
      const kategori = item.kategori ? ` [${item.kategori}]` : '';
      parts.push(`${i + 1}. **${item.baslik}**${kategori}`);
      parts.push(`   ${item.aciklama}`);
      if (item.istatistik) parts.push(`   📊 ${item.istatistik}`);
      if (item.oneri) parts.push(`   💡 Öneri: ${item.oneri}`);
    });
  } else if (result.strengths && result.strengths.length > 0) {
    parts.push('\n## GÜÇLÜ YÖNLER');
    result.strengths.forEach(s => parts.push(`- ${s}`));
  }

  // ==========================================
  // YENİ FORMAT V2 - Geliştirilmesi Gereken (Yeni Alan İsimleri)
  // ==========================================
  if (result.gelistirilmesi_gereken && result.gelistirilmesi_gereken.length > 0) {
    parts.push('\n## GELİŞTİRİLMESİ GEREKEN ALANLAR');
    result.gelistirilmesi_gereken.forEach((alan, i) => {
      const oncelikIcon = alan.oncelik === 'kritik' ? '🔴' : alan.oncelik === 'yuksek' ? '🟠' : alan.oncelik === 'orta' ? '🟡' : '🟢';
      parts.push(`${i + 1}. ${oncelikIcon} **${alan.baslik}** [${alan.oncelik?.toUpperCase() || 'ORTA'}]`);
      if (alan.mevcut) parts.push(`   Mevcut: ${alan.mevcut}`);
      if (alan.sorun) parts.push(`   Sorun: ${alan.sorun}`);
      if (alan.cozum) parts.push(`   Çözüm: ${alan.cozum}`);
      if (alan.sure) parts.push(`   Süre: ${alan.sure}`);
      if (alan.maliyet) parts.push(`   Maliyet: ${alan.maliyet}`);
    });
  } else if (result.gelistirilmesi_gereken_alanlar && result.gelistirilmesi_gereken_alanlar.length > 0) {
    // Eski format
    parts.push('\n## GELİŞTİRİLMESİ GEREKEN ALANLAR');
    result.gelistirilmesi_gereken_alanlar.forEach((alan, i) => {
      parts.push(`${i + 1}. **${alan.baslik}** [${alan.oncelik?.toUpperCase() || 'ORTA'}]`);
      parts.push(`   Mevcut Durum: ${alan.mevcut_durum}`);
      if (alan.neden_onemli) parts.push(`   Neden Önemli: ${alan.neden_onemli}`);
      parts.push(`   Çözüm: ${alan.cozum_onerisi}`);
      parts.push(`   Süre: ${alan.tahmini_sure} | Etki: ${alan.beklenen_etki || 'Belirtilmedi'}`);
    });
  } else if (result.weaknesses && result.weaknesses.length > 0) {
    parts.push('\n## GELİŞTİRME ALANLARI');
    result.weaknesses.forEach(w => parts.push(`- ${w}`));
  }

  // ==========================================
  // YENİ FORMAT V2 - Tespitler (baslik alanı)
  // ==========================================
  if (result.tespitler && result.tespitler.length > 0) {
    parts.push('\n## ÖNEMLİ TESPİTLER');
    result.tespitler.forEach(tespit => {
      const icon = tespit.tip === 'pozitif' ? '✅' : tespit.tip === 'uyari' ? '⚠️' : tespit.tip === 'firsat' ? '💡' : '🚨';
      parts.push(`${icon} **${tespit.baslik}**: ${tespit.detay}`);
    });
  } else if (result.onemli_tespitler && result.onemli_tespitler.length > 0) {
    // Eski format (tespit alanı)
    parts.push('\n## ÖNEMLİ TESPİTLER');
    result.onemli_tespitler.forEach(tespit => {
      const icon = tespit.tip === 'pozitif' ? '✅' : tespit.tip === 'uyari' ? '⚠️' : tespit.tip === 'firsat' ? '💡' : '🚨';
      parts.push(`${icon} ${tespit.tespit}: ${tespit.detay}`);
    });
  }

  // ==========================================
  // YENİ FORMAT V2 - Yol Haritası (7 gün, 30 gün, 90 gün, 1 yıl)
  // ==========================================
  if (result.yol_haritasi) {
    parts.push('\n## STRATEJİK YOL HARİTASI');
    const yh = result.yol_haritasi;
    if (yh.vizyon) parts.push(`🎯 Vizyon: ${yh.vizyon}`);
    
    if (yh.acil_7gun?.length) {
      parts.push('\n### 🔴 Acil (7 Gün)');
      yh.acil_7gun.forEach(a => {
        parts.push(`  - ${a.is}`);
        parts.push(`    Neden: ${a.neden}`);
        if (a.sorumlu) parts.push(`    Sorumlu: ${a.sorumlu}`);
      });
    }
    if (yh.kisa_30gun?.length) {
      parts.push('\n### 🟠 Kısa Vadeli (30 Gün)');
      yh.kisa_30gun.forEach(a => {
        parts.push(`  - ${a.is}`);
        parts.push(`    Neden: ${a.neden}`);
        if (a.sorumlu) parts.push(`    Sorumlu: ${a.sorumlu}`);
      });
    }
    if (yh.orta_90gun?.length) {
      parts.push('\n### 🟡 Orta Vadeli (90 Gün)');
      yh.orta_90gun.forEach(a => {
        parts.push(`  - ${a.is}`);
        parts.push(`    Neden: ${a.neden}`);
        if (a.sorumlu) parts.push(`    Sorumlu: ${a.sorumlu}`);
      });
    }
    if (yh.uzun_1yil?.length) {
      parts.push('\n### 🟢 Uzun Vadeli (1 Yıl)');
      yh.uzun_1yil.forEach(a => {
        parts.push(`  - ${a.is}`);
        parts.push(`    Neden: ${a.neden}`);
        if (a.sorumlu) parts.push(`    Sorumlu: ${a.sorumlu}`);
      });
    }
  } else if (result.stratejik_yol_haritasi) {
    // Eski format
    parts.push('\n## STRATEJİK YOL HARİTASI');
    const syh = result.stratejik_yol_haritasi;
    if (syh.vizyon) parts.push(`Vizyon: ${syh.vizyon}`);
    if (syh.ilk_30_gun?.length) {
      parts.push('İlk 30 Gün (Acil):');
      syh.ilk_30_gun.forEach(a => parts.push(`  🔴 ${a.aksiyon} - ${a.neden}`));
    }
    if (syh['30_90_gun']?.length) {
      parts.push('30-90 Gün (Orta Vadeli):');
      syh['30_90_gun'].forEach(a => parts.push(`  🟡 ${a.aksiyon} - ${a.neden}`));
    }
    if (syh['90_365_gun']?.length) {
      parts.push('90-365 Gün (Uzun Vadeli):');
      syh['90_365_gun'].forEach(a => parts.push(`  🟢 ${a.aksiyon} - ${a.neden}`));
    }
  }

  // ==========================================
  // YENİ FORMAT V2 - Sosyal Medya (Genişletilmiş)
  // ==========================================
  if (result.social_media_yeni) {
    parts.push('\n## SOSYAL MEDYA DURUMU');
    const sm = result.social_media_yeni;
    if (sm.facebook) parts.push(`- Facebook: ${sm.facebook}`);
    if (sm.instagram) parts.push(`- Instagram: ${sm.instagram}`);
    if (sm.linkedin) parts.push(`- LinkedIn: ${sm.linkedin}`);
    if (sm.twitter) parts.push(`- Twitter: ${sm.twitter}`);
    if (sm.youtube) parts.push(`- YouTube: ${sm.youtube}`);
    if (sm.tiktok && sm.tiktok !== 'null') parts.push(`- TikTok: ${sm.tiktok}`);
    if (sm.aktif_sayisi) parts.push(`Aktif Platform Sayısı: ${sm.aktif_sayisi}`);
    if (sm.degerlendirme) parts.push(`Değerlendirme: ${sm.degerlendirme}`);
    if (sm.oneriler?.length) {
      parts.push('Öneriler:');
      sm.oneriler.forEach(o => parts.push(`  💡 ${o}`));
    }
  } else if (result.social_media) {
    // Eski format
    parts.push('\n## SOSYAL MEDYA DURUMU');
    const sm = result.social_media;
    if (sm.linkedin?.url) parts.push(`- LinkedIn: ${sm.linkedin.url} (${sm.linkedin.status || 'Aktif'})`);
    if (sm.instagram?.url) parts.push(`- Instagram: ${sm.instagram.url} (${sm.instagram.status || 'Aktif'})`);
    if (sm.facebook?.url) parts.push(`- Facebook: ${sm.facebook.url} (${sm.facebook.status || 'Aktif'})`);
    if (sm.overall_assessment) parts.push(`Genel Değerlendirme: ${sm.overall_assessment}`);
  }

  // ==========================================
  // YENİ FORMAT V2 - Hizmet Önerileri
  // ==========================================
  if (result.hizmet_onerileri && result.hizmet_onerileri.length > 0) {
    parts.push('\n## ÖNERİLEN HİZMET PAKETLERİ');
    result.hizmet_onerileri.forEach((paket, i) => {
      const isFirst = i === 0 ? ' ⭐ ÖNCELİKLİ' : '';
      parts.push(`${i + 1}. **${paket.paket}**${isFirst}`);
      parts.push(`   Kapsam: ${paket.kapsam.join(', ')}`);
      if (paket.sure) parts.push(`   Süre: ${paket.sure}`);
      if (paket.sonuc) parts.push(`   Beklenen Sonuç: ${paket.sonuc}`);
    });
  } else if (result.hizmet_paketleri && result.hizmet_paketleri.length > 0) {
    // Eski format
    parts.push('\n## ÖNERİLEN HİZMET PAKETLERİ');
    result.hizmet_paketleri.forEach((paket, i) => {
      const isFirst = i === 0 ? ' ⭐ ÖNCELİKLİ' : '';
      parts.push(`${i + 1}. **${paket.paket_adi}**${isFirst}`);
      if (paket.aciklama) parts.push(`   ${paket.aciklama}`);
      parts.push(`   Kapsam: ${paket.kapsam.join(', ')}`);
      if (paket.tahmini_sure) parts.push(`   Süre: ${paket.tahmini_sure}`);
      if (paket.beklenen_sonuc) parts.push(`   Beklenen Sonuç: ${paket.beklenen_sonuc}`);
    });
  }

  // ==========================================
  // YENİ FORMAT V2 - Sonuç
  // ==========================================
  if (result.sonuc) {
    parts.push('\n## SONUÇ VE DEĞERLENDİRME');
    const sonuc = result.sonuc;
    if (sonuc.degerlendirme) parts.push(sonuc.degerlendirme);
    if (sonuc.olgunluk) parts.push(`Dijital Olgunluk Seviyesi: ${sonuc.olgunluk}`);
    if (sonuc.oncelikli_3?.length) {
      parts.push('\n### Öncelikli 3 Aksiyon:');
      sonuc.oncelikli_3.forEach(a => parts.push(`  ${a}`));
    }
    if (sonuc.cta) parts.push(`\n🎯 ${sonuc.cta}`);
  } else if (result.sonraki_adim) {
    // Eski format
    parts.push('\n## SONRAKI ADIM');
    if (result.sonraki_adim.cta_mesaji) parts.push(result.sonraki_adim.cta_mesaji);
    if (result.sonraki_adim.iletisim_bilgisi) parts.push(`İletişim: ${result.sonraki_adim.iletisim_bilgisi}`);
  }

  // Teknik Durum (eğer performans objesi yoksa)
  if (!result.performans && result.technical_status) {
    parts.push('\n## TEKNİK DURUM');
    const ts = result.technical_status;
    if (ts.mobile_score) parts.push(`- Mobil Performans: ${ts.mobile_score}/100`);
    if (ts.desktop_score) parts.push(`- Masaüstü Performans: ${ts.desktop_score}/100`);
    if (ts.ssl_grade) parts.push(`- SSL Notu: ${ts.ssl_grade}`);
    if (ts.lcp_mobile) parts.push(`- Mobil LCP: ${ts.lcp_mobile}`);
    if (ts.teknik_ozet) parts.push(`Teknik Özet: ${ts.teknik_ozet}`);
  }

  // Yasal Uyumluluk
  if (result.legal_compliance) {
    parts.push('\n## YASAL UYUMLULUK');
    const lc = result.legal_compliance;
    if (lc.kvkk) parts.push(`- KVKK: ${lc.kvkk.status} - ${lc.kvkk.aciklama}`);
    if (lc.cookie_policy) parts.push(`- Çerez Politikası: ${lc.cookie_policy.status} - ${lc.cookie_policy.aciklama}`);
    if (lc.etbis) parts.push(`- ETBİS: ${lc.etbis.status} - ${lc.etbis.aciklama}`);
  }

  // Rekabet Analizi
  if (result.rekabet_analizi) {
    parts.push('\n## REKABET ANALİZİ');
    const ra = result.rekabet_analizi;
    if (ra.genel_degerlendirme) parts.push(ra.genel_degerlendirme);
    if (ra.avantajlar?.length) {
      parts.push('Avantajlar:');
      ra.avantajlar.forEach(a => parts.push(`  ✅ ${a}`));
    }
    if (ra.dezavantajlar?.length) {
      parts.push('Dezavantajlar:');
      ra.dezavantajlar.forEach(d => parts.push(`  ❌ ${d}`));
    }
    if (ra.firsat_alanlari) parts.push(`Fırsat Alanları: ${ra.firsat_alanlari}`);
  }

  // Sektöre Özel Öneriler
  if (result.sektor_ozel_oneriler && result.sektor_ozel_oneriler.length > 0) {
    parts.push(`\n## SEKTÖRE ÖZEL ÖNERİLER (${result.sektor || 'Genel'})`);
    result.sektor_ozel_oneriler.forEach(oneri => {
      parts.push(`- **${oneri.baslik}**: ${oneri.aciklama}`);
      if (oneri.ornek) parts.push(`  Örnek: ${oneri.ornek}`);
    });
  }

  // Eski format öneriler
  if (result.recommendations && result.recommendations.length > 0 && !result.hizmet_paketleri?.length && !result.hizmet_onerileri?.length) {
    parts.push('\n## ÖNCELİKLİ ÖNERİLER');
    result.recommendations.slice(0, 10).forEach(r => {
      parts.push(`- [${r.priority.toUpperCase()}] ${r.title}: ${r.description || ''}`);
    });
  }

  // Executive Summary (en sonda)
  if (result.executive_summary) {
    parts.push('\n## ÖZET DEĞERLENDİRME');
    parts.push(result.executive_summary);
  }

  return parts.join('\n');
}
