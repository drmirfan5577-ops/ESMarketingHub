export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  platform: string;
  type: 'post' | 'email' | 'ad' | 'campaign' | 'meeting';
  status: 'draft' | 'scheduled' | 'published' | 'paused';
  color: string;
  notes?: string;
}

export const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  Facebook: '#1877F2',
  TikTok: '#FF0050',
  LinkedIn: '#0A66C2',
  YouTube: '#FF0000',
  Twitter: '#1DA1F2',
  Email: '#FF6B35',
  Google: '#4285F4',
  Campaign: '#FFD700',
  Meeting: '#00C853',
};

export const EVENT_TYPES = ['post', 'email', 'ad', 'campaign', 'meeting'] as const;

export const CONTENT_IDEAS = [
  { platform: 'Instagram', idea: 'Behind-the-scenes product creation reel', type: 'post' },
  { platform: 'Facebook', idea: 'Customer testimonial video post', type: 'post' },
  { platform: 'Email', idea: 'Weekly newsletter with tips', type: 'email' },
  { platform: 'TikTok', idea: '3 mistakes people make with [product]', type: 'post' },
  { platform: 'LinkedIn', idea: 'Industry trend analysis thread', type: 'post' },
  { platform: 'Google', idea: 'Search campaign optimization', type: 'ad' },
  { platform: 'YouTube', idea: 'Product tutorial/demo video', type: 'post' },
  { platform: 'Instagram', idea: 'User-generated content repost', type: 'post' },
  { platform: 'Email', idea: 'Flash sale announcement', type: 'email' },
  { platform: 'Facebook', idea: 'Engagement poll about industry topic', type: 'post' },
];
