import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export interface MedicalSlide {
  title: string;
  desc: string;
  type: string;
}

export async function exportMedicalPDF(
  presentationTitle: string,
  presenterName: string,
  institution: string,
  audience: string,
  specialty: string,
  slides: MedicalSlide[],
): Promise<boolean> {
  try {
    const slideRows = slides.map((slide, i) => `
      <tr style="background:${i % 2 === 0 ? '#0a0a1a' : '#111127'}">
        <td style="padding:12px 16px; color:#FFD700; font-weight:700; white-space:nowrap;">${i + 1}. ${slide.title}</td>
        <td style="padding:12px 16px; color:#aaaacc; font-size:13px;">${slide.desc}</td>
        <td style="padding:12px 16px; text-align:center;">
          <span style="background:#FFD70033; color:#FFD700; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;">${slide.type.toUpperCase()}</span>
        </td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #050510; color: #ffffff; }
    .header { background: linear-gradient(135deg, #0a0a1a, #1a1a3a); padding: 40px; border-bottom: 2px solid #FFD700; }
    .brand { font-size: 11px; color: #FFD700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .title { font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 12px; line-height: 1.3; }
    .meta-row { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 16px; }
    .meta-item { display: flex; flex-direction: column; gap: 2px; }
    .meta-label { font-size: 10px; color: #FFD70099; text-transform: uppercase; letter-spacing: 1px; }
    .meta-value { font-size: 14px; color: #ffffff; font-weight: 600; }
    .badge { background: #FFD700; color: #000; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; display: inline-block; margin-top: 8px; }
    .section { padding: 32px 40px; }
    .section-title { font-size: 13px; color: #FFD700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; font-weight: 700; }
    .stats-row { display: flex; gap: 16px; margin-bottom: 32px; }
    .stat-card { flex: 1; background: #0a0a1a; border: 1px solid #FFD70033; border-radius: 12px; padding: 20px; text-align: center; }
    .stat-val { font-size: 32px; font-weight: 900; color: #FFD700; }
    .stat-lbl { font-size: 11px; color: #aaaacc; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; }
    th { background: #FFD700; color: #000; padding: 12px 16px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
    .footer { background: #0a0a1a; padding: 24px 40px; border-top: 1px solid #FFD70033; display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { font-size: 12px; color: #FFD700; font-weight: 700; }
    .footer-date { font-size: 11px; color: #aaaacc; }
    .disclaimer { margin: 24px 40px; background: #FF174422; border: 1px solid #FF174444; border-radius: 8px; padding: 14px; font-size: 12px; color: #FF8888; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">E-S Marketing Hub · Medical Presentation Builder</div>
    <div class="title">${presentationTitle}</div>
    <div class="meta-row">
      ${presenterName ? `<div class="meta-item"><div class="meta-label">Presenter</div><div class="meta-value">${presenterName}</div></div>` : ''}
      ${institution ? `<div class="meta-item"><div class="meta-label">Institution</div><div class="meta-value">${institution}</div></div>` : ''}
      <div class="meta-item"><div class="meta-label">Specialty</div><div class="meta-value">${specialty}</div></div>
      <div class="meta-item"><div class="meta-label">Audience</div><div class="meta-value">${audience.charAt(0).toUpperCase() + audience.slice(1)}</div></div>
    </div>
    <div class="badge">${slides.length} SLIDES</div>
  </div>

  <div class="section">
    <div class="section-title">Presentation Overview</div>
    <div class="stats-row">
      <div class="stat-card"><div class="stat-val">${slides.length}</div><div class="stat-lbl">Total Slides</div></div>
      <div class="stat-card"><div class="stat-val">${slides.filter(s => s.type === 'data').length}</div><div class="stat-lbl">Data Slides</div></div>
      <div class="stat-card"><div class="stat-val">${slides.filter(s => s.type === 'visual').length}</div><div class="stat-lbl">Visual Slides</div></div>
      <div class="stat-card"><div class="stat-val">${Math.ceil(slides.length * 3)} min</div><div class="stat-lbl">Est. Duration</div></div>
    </div>

    <div class="section-title">Slide Outline</div>
    <table>
      <thead>
        <tr>
          <th>Slide Title</th>
          <th>Content Description</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${slideRows}
      </tbody>
    </table>
  </div>

  <div class="disclaimer">
    ⚕️ Medical Disclaimer: This presentation outline is for educational and informational purposes only. All medical content must be reviewed and verified by qualified healthcare professionals. Always cite primary sources and comply with applicable regulations.
  </div>

  <div class="footer">
    <div class="footer-brand">E-S Marketing Hub · Medical Presentation Builder</div>
    <div class="footer-date">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  </div>
</body>
</html>`;

    const { uri } = await Print.printToFileAsync({ html, base64: false });

    if (Platform.OS === 'web') {
      await Print.printAsync({ html });
      return true;
    }

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Export: ${presentationTitle}`,
        UTI: 'com.adobe.pdf',
      });
    }
    return true;
  } catch (err) {
    console.error('PDF Export error:', err);
    return false;
  }
}

export async function exportGenericPDF(title: string, html: string): Promise<boolean> {
  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `Export: ${title}` });
    }
    return true;
  } catch {
    return false;
  }
}
