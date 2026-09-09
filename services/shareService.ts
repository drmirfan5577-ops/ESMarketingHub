import { Share, Platform } from 'react-native';

export interface ShareContent {
  title: string;
  message: string;
  url?: string;
}

export async function shareContent(content: ShareContent): Promise<boolean> {
  try {
    const result = await Share.share(
      {
        title: content.title,
        message: Platform.OS === 'ios'
          ? content.message
          : `${content.message}${content.url ? '\n' + content.url : ''}`,
        url: Platform.OS === 'ios' ? content.url : undefined,
      },
      { dialogTitle: content.title }
    );
    return result.action === Share.sharedAction;
  } catch {
    return false;
  }
}

export function buildToolShareText(toolName: string, description: string, tips: string[]): string {
  return `🚀 ${toolName}\n\n${description}\n\n💡 Pro Tips:\n${tips.map(t => `• ${t}`).join('\n')}\n\n📲 Powered by E-S Marketing Hub`;
}

export function buildTemplateShareText(name: string, type: string, category: string): string {
  return `🎨 Template: ${name}\nType: ${type} | Category: ${category}\n\nDiscover 100+ marketing templates in E-S Marketing Hub.\n\n#Marketing #Templates #ESMarketingHub`;
}

export function buildCopyShareText(copyText: string, format: string, tone: string): string {
  return `✍️ AI Generated ${format} (${tone} tone):\n\n${copyText}\n\n— E-S Marketing Hub AI Copy Generator`;
}

export function buildAdShareText(productName: string, style: string, duration: number, ratio: string): string {
  return `🎬 Video Ad: "${productName}"\nStyle: ${style} | ${duration}s | ${ratio}\n\nCreated with E-S Marketing Hub Video Ad Maker\n#VideoAd #Marketing #DigitalMarketing`;
}

export function buildPromoText(appName: string): string {
  return `📱 Discover ${appName} — The Ultimate Marketing Tools Hub!\n\n✅ 53+ Marketing Tools\n✅ AI Copy Generator\n✅ Video Ad Maker\n✅ 100+ Templates\n✅ Campaign Analytics\n✅ Medical Presentation Builder\n✅ Game Generator\n✅ Content Calendar\n\n🔥 Everything you need to dominate your marketing!\n\n#MarketingTools #DigitalMarketing #ESMarketingHub`;
}
