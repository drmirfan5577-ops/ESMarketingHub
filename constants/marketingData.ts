export interface MarketingTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  tips: string[];
  usage: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  type: string;
  color: string;
  icon: string;
  tags: string[];
  slides?: number;
}

export interface AdAnimation {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const TOOL_CATEGORIES = [
  'All', 'SEO', 'Social Media', 'Email', 'Content', 'Video',
  'Design', 'Analytics', 'Apps', 'Local', 'Medical', 'E-Commerce',
];

export const TEMPLATE_CATEGORIES = [
  'All', 'Business', 'Medical', 'Social Ads', 'Email', 'Presentation',
  'Product', 'App Store', 'Game Ads', 'Local', 'Video Script', 'Website',
];

export const MARKETING_TOOLS: MarketingTool[] = [
  {
    id: '1', name: 'SEO Keyword Planner', category: 'SEO',
    description: 'Research and plan high-impact keywords for any niche or product.',
    icon: 'search', color: '#00D4FF',
    usage: 'Enter your product/niche → Get keyword suggestions + search volume',
    tips: ['Target long-tail keywords', 'Check competitor keywords', 'Use LSI keywords'],
  },
  {
    id: '2', name: 'Meta Tag Generator', category: 'SEO',
    description: 'Create perfect title and meta description tags for any webpage.',
    icon: 'code', color: '#00D4FF',
    usage: 'Input page details → Generate optimized meta tags',
    tips: ['Keep title under 60 chars', 'Description 150-160 chars', 'Include primary keyword'],
  },
  {
    id: '3', name: 'Backlink Analyzer', category: 'SEO',
    description: 'Analyze and track backlinks for any website or competitor.',
    icon: 'link', color: '#00D4FF',
    usage: 'Enter URL → Analyze backlink profile + domain authority',
    tips: ['Focus on high-DA links', 'Disavow toxic links', 'Guest posting strategy'],
  },
  {
    id: '4', name: 'Social Post Scheduler', category: 'Social Media',
    description: 'Plan and schedule posts across all major social platforms.',
    icon: 'schedule', color: '#7B2FBE',
    usage: 'Create posts → Select platforms → Set schedule → Auto-publish',
    tips: ['Post at peak hours', 'Use platform-specific formats', 'Maintain content calendar'],
  },
  {
    id: '5', name: 'Hashtag Generator', category: 'Social Media',
    description: 'Generate trending and relevant hashtags for maximum reach.',
    icon: 'tag', color: '#7B2FBE',
    usage: 'Enter topic/image → Get 30 optimized hashtags by tier',
    tips: ['Mix popular + niche tags', 'Use 10-15 per post', 'Rotate hashtag sets'],
  },
  {
    id: '6', name: 'Instagram Ad Creator', category: 'Social Media',
    description: 'Design stunning Instagram ads with templates and visual tools.',
    icon: 'photo-camera', color: '#7B2FBE',
    usage: 'Choose template → Customize → Export in all IG sizes',
    tips: ['Use Stories format for mobile', 'Bold text over images', 'Clear CTA button'],
  },
  {
    id: '7', name: 'Facebook Ad Manager', category: 'Social Media',
    description: 'Create and optimize Facebook ad campaigns with audience targeting.',
    icon: 'people', color: '#7B2FBE',
    usage: 'Define audience → Choose objective → Create ad → Set budget',
    tips: ['Use lookalike audiences', 'A/B test creatives', 'Retarget website visitors'],
  },
  {
    id: '8', name: 'Email Campaign Builder', category: 'Email',
    description: 'Build professional email campaigns with drag-and-drop editor.',
    icon: 'email', color: '#FF6B35',
    usage: 'Pick template → Customize content → Set automation → Send',
    tips: ['Personalize subject lines', 'Mobile-first design', 'A/B test subject lines'],
  },
  {
    id: '9', name: 'Email List Manager', category: 'Email',
    description: 'Organize, segment, and clean your email subscriber lists.',
    icon: 'list', color: '#FF6B35',
    usage: 'Import list → Segment by criteria → Clean invalid emails',
    tips: ['Segment by behavior', 'Remove inactive subscribers', 'Double opt-in'],
  },
  {
    id: '10', name: 'Drip Campaign Creator', category: 'Email',
    description: 'Set up automated drip email sequences for lead nurturing.',
    icon: 'water-drop', color: '#FF6B35',
    usage: 'Define trigger → Create email sequence → Set delays → Activate',
    tips: ['Start with welcome series', '5-7 email sequence ideal', 'Monitor open rates'],
  },
  {
    id: '11', name: 'Blog Content Generator', category: 'Content',
    description: 'Generate SEO-optimized blog posts, articles, and web copy.',
    icon: 'article', color: '#00C853',
    usage: 'Enter topic + keywords → Generate outline → Expand to full article',
    tips: ['Use pillar content strategy', 'Add internal links', 'Update old posts'],
  },
  {
    id: '12', name: 'Ad Copy Writer', category: 'Content',
    description: 'Write compelling ad copy using proven copywriting formulas.',
    icon: 'edit', color: '#00C853',
    usage: 'Input product details → Select formula → Generate copy variants',
    tips: ['AIDA formula works best', 'Focus on benefits not features', 'Use power words'],
  },
  {
    id: '13', name: 'Product Description Writer', category: 'Content',
    description: 'Create persuasive product descriptions for e-commerce and ads.',
    icon: 'shopping-bag', color: '#00C853',
    usage: 'Enter product specs → Generate 5 description variants',
    tips: ['Highlight unique benefits', 'Use sensory words', 'Include social proof'],
  },
  {
    id: '14', name: 'Video Script Generator', category: 'Video',
    description: 'Write professional scripts for ads, tutorials, and promotional videos.',
    icon: 'videocam', color: '#FF1744',
    usage: 'Select video type → Input details → Generate script with scene notes',
    tips: ['Hook in first 3 seconds', 'Show product in use', 'End with strong CTA'],
  },
  {
    id: '15', name: 'YouTube Optimizer', category: 'Video',
    description: 'Optimize YouTube videos with titles, descriptions, and tags.',
    icon: 'play-circle-filled', color: '#FF1744',
    usage: 'Enter video topic → Get optimized title + description + tags',
    tips: ['Custom thumbnails get 90% more clicks', 'Add chapters', 'Respond to comments'],
  },
  {
    id: '16', name: 'Video Ad Maker', category: 'Video',
    description: 'Create animated video ads with text overlays and transitions.',
    icon: 'movie', color: '#FF1744',
    usage: 'Choose template → Add content → Select animation → Export',
    tips: ['Keep ads under 30 seconds', 'Add captions for silent viewing', 'Bold visuals'],
  },
  {
    id: '17', name: 'Logo & Brand Kit Creator', category: 'Design',
    description: 'Generate logos, color palettes, and brand identity assets.',
    icon: 'brush', color: '#FFD700',
    usage: 'Enter brand name + industry → Generate logo + color palette + fonts',
    tips: ['Keep logo simple', 'Use max 3 brand colors', 'Test on dark + light backgrounds'],
  },
  {
    id: '18', name: 'Banner Ad Designer', category: 'Design',
    description: 'Create display banner ads in all standard IAB sizes.',
    icon: 'aspect-ratio', color: '#FFD700',
    usage: 'Select size → Choose template → Customize → Export all sizes',
    tips: ['Keep message concise', 'Bright CTA button', 'Test animated vs static'],
  },
  {
    id: '19', name: 'Social Media Kit', category: 'Design',
    description: 'Design consistent visuals for all social media platforms.',
    icon: 'grid-view', color: '#FFD700',
    usage: 'Upload brand assets → Generate all platform-sized graphics',
    tips: ['Consistent color scheme', 'Brand watermark all images', 'Template library'],
  },
  {
    id: '20', name: 'Analytics Dashboard', category: 'Analytics',
    description: 'Track and visualize marketing KPIs across all campaigns.',
    icon: 'bar-chart', color: '#00D4FF',
    usage: 'Connect accounts → View unified dashboard → Generate reports',
    tips: ['Track conversion rate', 'Monitor ROAS', 'Weekly performance review'],
  },
  {
    id: '21', name: 'Competitor Spy Tool', category: 'Analytics',
    description: 'Analyze competitor ads, content, and marketing strategies.',
    icon: 'visibility', color: '#00D4FF',
    usage: 'Enter competitor URL → Get ad library, top content, keywords',
    tips: ['Identify content gaps', 'Replicate winning ads', 'Track competitor changes'],
  },
  {
    id: '22', name: 'ROI Calculator', category: 'Analytics',
    description: 'Calculate return on investment for any marketing campaign.',
    icon: 'calculate', color: '#00D4FF',
    usage: 'Input spend + revenue → Calculate ROI + ROAS + CPA metrics',
    tips: ['Include all costs', 'Track LTV not just first sale', 'Set ROI benchmarks'],
  },
  {
    id: '23', name: 'App Store Optimizer', category: 'Apps',
    description: 'Optimize app store listings for maximum downloads and ranking.',
    icon: 'apps', color: '#FF6B35',
    usage: 'Input app details → Generate optimized listing for App Store + Play Store',
    tips: ['A/B test screenshots', 'Keyword-rich description', 'Respond to reviews'],
  },
  {
    id: '24', name: 'Push Notification Designer', category: 'Apps',
    description: 'Create compelling push notification campaigns for mobile apps.',
    icon: 'notifications', color: '#FF6B35',
    usage: 'Write message → Segment audience → Schedule + A/B test',
    tips: ['Personalize messages', 'Send at optimal time', 'Use rich media'],
  },
  {
    id: '25', name: 'In-App Ad Creator', category: 'Apps',
    description: 'Design interstitial, banner, and rewarded ads for mobile apps.',
    icon: 'phone-android', color: '#FF6B35',
    usage: 'Select ad type → Design creative → Generate code + preview',
    tips: ['Rewarded ads highest eCPM', 'Native ads better UX', 'Limit frequency'],
  },
  {
    id: '26', name: 'Local SEO Booster', category: 'Local',
    description: 'Optimize your Google Business Profile and local search rankings.',
    icon: 'location-on', color: '#7B2FBE',
    usage: 'Enter business info → Get local SEO checklist + citation sites',
    tips: ['Complete GMB profile', 'Get local reviews', 'Add local schema markup'],
  },
  {
    id: '27', name: 'Google My Business Manager', category: 'Local',
    description: 'Manage and optimize your Google My Business listing.',
    icon: 'business', color: '#7B2FBE',
    usage: 'Connect GMB → Post updates → Respond to reviews → Track insights',
    tips: ['Post weekly updates', 'Add photos regularly', 'Enable messaging'],
  },
  {
    id: '28', name: 'Local Ad Campaign Builder', category: 'Local',
    description: 'Create geo-targeted ad campaigns for local businesses.',
    icon: 'near-me', color: '#7B2FBE',
    usage: 'Set location radius → Define audience → Create local ads',
    tips: ['Use location extensions', 'Local inventory ads', 'Call-only campaigns'],
  },
  {
    id: '29', name: 'Medical Content Creator', category: 'Medical',
    description: 'Create HIPAA-compliant medical marketing content and presentations.',
    icon: 'local-hospital', color: '#00C853',
    usage: 'Select content type → Input medical info → Generate compliant content',
    tips: ['Always include disclaimers', 'Cite medical sources', 'Use plain language'],
  },
  {
    id: '30', name: 'Healthcare Visual Builder', category: 'Medical',
    description: 'Design medical infographics, anatomy charts, and health visuals.',
    icon: 'health-and-safety', color: '#00C853',
    usage: 'Choose medical category → Customize visual → Export for print/digital',
    tips: ['Use standard medical colors', 'Accurate anatomy labels', 'Patient-friendly language'],
  },
  {
    id: '31', name: 'E-Commerce Product Ads', category: 'E-Commerce',
    description: 'Create Google Shopping and e-commerce product ad campaigns.',
    icon: 'store', color: '#FF6B35',
    usage: 'Upload product feed → Generate shopping ads → Optimize bids',
    tips: ['High-quality product images', 'Accurate pricing', 'Use promotional labels'],
  },
  {
    id: '32', name: 'Landing Page Builder', category: 'Content',
    description: 'Build high-converting landing pages for any product or service.',
    icon: 'web', color: '#00C853',
    usage: 'Select template → Customize → Connect form → Publish',
    tips: ['Remove navigation', 'Single clear CTA', 'Social proof above fold'],
  },
  {
    id: '33', name: 'Lead Magnet Creator', category: 'Content',
    description: 'Create eBooks, checklists, and lead magnets to grow your list.',
    icon: 'download', color: '#00C853',
    usage: 'Choose format → Add content → Design cover → Create download page',
    tips: ['Solve specific problem', 'Immediate value delivery', 'Professional design'],
  },
  {
    id: '34', name: 'Webinar Promotion Kit', category: 'Content',
    description: 'Full marketing kit for promoting webinars and online events.',
    icon: 'live-tv', color: '#FF1744',
    usage: 'Enter webinar details → Generate all promotional materials',
    tips: ['Promote 2 weeks early', 'Send reminder sequence', 'Record for repurposing'],
  },
  {
    id: '35', name: 'Influencer Outreach Tool', category: 'Social Media',
    description: 'Find and connect with relevant influencers for your brand.',
    icon: 'star', color: '#FFD700',
    usage: 'Enter niche → Find influencers → Generate outreach templates',
    tips: ['Micro-influencers better ROI', 'Check engagement rate', 'Long-term partnerships'],
  },
  {
    id: '36', name: 'Review & Reputation Manager', category: 'Local',
    description: 'Monitor and respond to reviews across all platforms.',
    icon: 'rate-review', color: '#7B2FBE',
    usage: 'Connect review platforms → Monitor new reviews → Auto-respond templates',
    tips: ['Respond within 24 hours', 'Thank positive reviewers', 'Address negatives professionally'],
  },
  {
    id: '37', name: 'SMS Marketing Campaign', category: 'Email',
    description: 'Create and send SMS marketing campaigns with high open rates.',
    icon: 'sms', color: '#FF6B35',
    usage: 'Write message → Upload contacts → Schedule send → Track results',
    tips: ['Keep under 160 chars', 'Include opt-out option', '98% open rate advantage'],
  },
  {
    id: '38', name: 'QR Code Generator', category: 'Design',
    description: 'Generate branded QR codes for products, menus, and campaigns.',
    icon: 'qr-code', color: '#FFD700',
    usage: 'Enter URL or content → Customize design → Download QR code',
    tips: ['Add brand colors', 'Test before printing', 'Track scan analytics'],
  },
  {
    id: '39', name: 'Podcast Marketing Kit', category: 'Content',
    description: 'Market your podcast with audiograms, show notes, and promotion.',
    icon: 'mic', color: '#00D4FF',
    usage: 'Upload episode → Generate audiogram + show notes + social posts',
    tips: ['Submit to all directories', 'Transcribe episodes for SEO', 'Guest cross-promotion'],
  },
  {
    id: '40', name: 'Game Ad Creator', category: 'Apps',
    description: 'Create playable ads, video ads, and store assets for games.',
    icon: 'sports-esports', color: '#FF1744',
    usage: 'Select game genre → Choose ad type → Design + animate → Export',
    tips: ['Playable ads 3x conversion', 'Show gameplay in first 3s', 'Clear reward messaging'],
  },
  {
    id: '41', name: 'Press Release Generator', category: 'Content',
    description: 'Write professional press releases for product launches and news.',
    icon: 'newspaper', color: '#00C853',
    usage: 'Enter news details → Generate formatted press release → Distribute',
    tips: ['Newsworthy angle required', 'Quote from leadership', 'Contact info at bottom'],
  },
  {
    id: '42', name: 'Affiliate Program Builder', category: 'E-Commerce',
    description: 'Set up and manage affiliate marketing programs for your products.',
    icon: 'share', color: '#FF6B35',
    usage: 'Define commission → Create affiliate links → Generate promo materials',
    tips: ['20-30% commission competitive', 'Provide ready-made creatives', 'Track conversions accurately'],
  },
  {
    id: '43', name: 'TikTok Ad Creator', category: 'Social Media',
    description: 'Create viral TikTok ad campaigns with trending formats.',
    icon: 'music-video', color: '#7B2FBE',
    usage: 'Choose trend format → Add product → Add audio + effects → Export',
    tips: ['Native-feel content works', 'First 3 seconds critical', 'Use trending sounds'],
  },
  {
    id: '44', name: 'LinkedIn Campaign Manager', category: 'Social Media',
    description: 'Create B2B LinkedIn ad campaigns with professional targeting.',
    icon: 'work', color: '#00D4FF',
    usage: 'Set audience by job title/industry → Create sponsored content',
    tips: ['Sponsored InMail high open rate', 'Lead gen forms convert well', 'Content ads for awareness'],
  },
  {
    id: '45', name: 'Pinterest Ad Designer', category: 'Social Media',
    description: 'Create shoppable Pinterest pins and promoted pin campaigns.',
    icon: 'collections', color: '#FF1744',
    usage: 'Upload product images → Create pins → Enable shopping → Promote',
    tips: ['Vertical 2:3 ratio', 'Lifestyle images perform best', 'Rich pins for products'],
  },
  {
    id: '46', name: 'Chatbot Script Builder', category: 'Apps',
    description: 'Create automated chatbot scripts for customer acquisition.',
    icon: 'chat', color: '#00C853',
    usage: 'Map conversation flow → Write responses → Connect to platform',
    tips: ['Quick reply buttons', 'Handoff to human when needed', 'Collect lead info'],
  },
  {
    id: '47', name: 'Survey & Feedback Tool', category: 'Analytics',
    description: 'Create customer surveys and analyze feedback for marketing insights.',
    icon: 'poll', color: '#FFD700',
    usage: 'Build survey → Distribute → Analyze results → Export report',
    tips: ['Short surveys (5-7 questions)', 'Offer incentive for completion', 'Net Promoter Score'],
  },
  {
    id: '48', name: 'Coupon & Promo Generator', category: 'E-Commerce',
    description: 'Create discount codes, coupons, and promotional campaigns.',
    icon: 'local-offer', color: '#00C853',
    usage: 'Set discount type → Generate codes → Track redemptions',
    tips: ['Urgency drives conversions', 'Limited quantity scarcity', 'FOMO messaging'],
  },
  {
    id: '49', name: 'Website Heat Map Analyzer', category: 'Analytics',
    description: 'Analyze where users click and scroll on your website.',
    icon: 'thermostat', color: '#FF6B35',
    usage: 'Install tracking code → View heat maps → Optimize UX + conversions',
    tips: ['Fix dead zones', 'Optimize CTA placement', 'Reduce friction points'],
  },
  {
    id: '50', name: 'A/B Testing Platform', category: 'Analytics',
    description: 'Run split tests on ads, landing pages, and email campaigns.',
    icon: 'science', color: '#00D4FF',
    usage: 'Create variants → Split traffic → Measure → Declare winner',
    tips: ['Test one variable at a time', 'Need 95% confidence', 'Run for full business cycle'],
  },
  {
    id: '51', name: 'Retargeting Pixel Manager', category: 'E-Commerce',
    description: 'Manage Facebook, Google, and TikTok tracking pixels.',
    icon: 'track-changes', color: '#FFD700',
    usage: 'Generate pixel code → Install → Create custom audiences → Retarget',
    tips: ['Segment by page visited', 'Cart abandonment sequence', 'Cross-device tracking'],
  },
  {
    id: '52', name: 'Content Calendar Planner', category: 'Content',
    description: 'Plan and organize content across all marketing channels.',
    icon: 'calendar-today', color: '#7B2FBE',
    usage: 'Set channels → Plan content themes → Schedule → Track publication',
    tips: ['Plan 30 days ahead', 'Content mix: 80/20 value/promo', 'Seasonal campaigns'],
  },
  {
    id: '53', name: 'Referral Program Builder', category: 'E-Commerce',
    description: 'Create viral referral programs to grow your customer base.',
    icon: 'group-add', color: '#FF6B35',
    usage: 'Define rewards → Create referral links → Track referrals → Pay rewards',
    tips: ['Double-sided rewards work best', 'Easy sharing mechanism', 'Remind customers to share'],
  },
];

export const TEMPLATES: Template[] = [
  { id: 't1', name: 'Product Launch Announcement', category: 'Business', type: 'Presentation', color: '#FFD700', icon: 'rocket-launch', description: 'Professional product launch presentation with slides', tags: ['launch', 'business', 'product'], slides: 12 },
  { id: 't2', name: 'Sales Pitch Deck', category: 'Business', type: 'Presentation', color: '#FF6B35', icon: 'trending-up', description: 'Compelling sales pitch for investors and clients', tags: ['sales', 'pitch', 'investors'], slides: 15 },
  { id: 't3', name: 'Brand Identity Proposal', category: 'Business', type: 'Presentation', color: '#7B2FBE', icon: 'brush', description: 'Complete brand identity presentation package', tags: ['brand', 'design', 'identity'], slides: 10 },
  { id: 't4', name: 'Annual Marketing Report', category: 'Business', type: 'Report', color: '#00D4FF', icon: 'bar-chart', description: 'Comprehensive annual marketing performance report', tags: ['report', 'analytics', 'annual'], slides: 20 },
  { id: 't5', name: 'Instagram Story Ad Pack', category: 'Social Ads', type: 'Social Media', color: '#FF1744', icon: 'photo-camera', description: 'Set of 10 animated Instagram story templates', tags: ['instagram', 'story', 'ads'], slides: 10 },
  { id: 't6', name: 'Facebook Carousel Ad', category: 'Social Ads', type: 'Social Media', color: '#00D4FF', icon: 'view-carousel', description: 'Multi-product carousel ad for Facebook and Instagram', tags: ['facebook', 'carousel', 'ecommerce'], slides: 5 },
  { id: 't7', name: 'TikTok Video Script', category: 'Social Ads', type: 'Video Script', color: '#7B2FBE', icon: 'music-video', description: 'Viral TikTok product promotion script template', tags: ['tiktok', 'viral', 'script'], slides: 1 },
  { id: 't8', name: 'Email Newsletter', category: 'Email', type: 'Email', color: '#FF6B35', icon: 'email', description: 'Professional email newsletter with multiple sections', tags: ['email', 'newsletter', 'weekly'], slides: 1 },
  { id: 't9', name: 'Welcome Email Sequence', category: 'Email', type: 'Email', color: '#00C853', icon: 'mark-email-read', description: '5-part welcome email sequence for new subscribers', tags: ['welcome', 'onboarding', 'sequence'], slides: 5 },
  { id: 't10', name: 'Abandoned Cart Email', category: 'Email', type: 'Email', color: '#FF1744', icon: 'shopping-cart', description: 'Recovery email for abandoned shopping carts', tags: ['ecommerce', 'cart', 'recovery'], slides: 3 },
  { id: 't11', name: 'Medical Conference Slides', category: 'Medical', type: 'Presentation', color: '#00C853', icon: 'local-hospital', description: 'Professional medical conference presentation template', tags: ['medical', 'conference', 'clinical'], slides: 25 },
  { id: 't12', name: 'Patient Education Brochure', category: 'Medical', type: 'Print', color: '#00D4FF', icon: 'health-and-safety', description: 'Clear patient information and education materials', tags: ['patient', 'education', 'health'], slides: 6 },
  { id: 't13', name: 'Pharmaceutical Ad Template', category: 'Medical', type: 'Advertisement', color: '#7B2FBE', icon: 'medication', description: 'Regulatory-compliant pharmaceutical advertisement', tags: ['pharma', 'medical', 'drug'], slides: 1 },
  { id: 't14', name: 'Clinical Study Infographic', category: 'Medical', type: 'Infographic', color: '#FF6B35', icon: 'science', description: 'Visual presentation of clinical study results', tags: ['clinical', 'study', 'data'], slides: 1 },
  { id: 't15', name: 'App Store Screenshots Pack', category: 'App Store', type: 'Mobile', color: '#FF6B35', icon: 'phone-android', description: 'Complete App Store screenshot set for iOS + Android', tags: ['app', 'store', 'screenshots'], slides: 8 },
  { id: 't16', name: 'App Launch Campaign', category: 'App Store', type: 'Multi-Channel', color: '#FF1744', icon: 'rocket-launch', description: 'Complete launch campaign for mobile applications', tags: ['app', 'launch', 'mobile'], slides: 15 },
  { id: 't17', name: 'Game Store Listing Kit', category: 'Game Ads', type: 'Mobile', color: '#7B2FBE', icon: 'sports-esports', description: 'Complete game store listing with screenshots and icon', tags: ['game', 'store', 'listing'], slides: 10 },
  { id: 't18', name: 'Gaming Video Ad Script', category: 'Game Ads', type: 'Video Script', color: '#FF1744', icon: 'movie', description: 'High-converting mobile game video ad script', tags: ['game', 'video', 'ad'], slides: 1 },
  { id: 't19', name: 'Restaurant Promo Pack', category: 'Local', type: 'Local Business', color: '#FF6B35', icon: 'restaurant', description: 'Complete promotional materials for restaurants', tags: ['restaurant', 'food', 'local'], slides: 8 },
  { id: 't20', name: 'Real Estate Listing Ads', category: 'Local', type: 'Local Business', color: '#00D4FF', icon: 'home', description: 'Property listing advertisement templates', tags: ['realestate', 'property', 'listing'], slides: 6 },
  { id: 't21', name: 'Google Display Banner Set', category: 'Business', type: 'Display Ads', color: '#FFD700', icon: 'aspect-ratio', description: 'Complete set of Google Display Network banner sizes', tags: ['google', 'display', 'banner'], slides: 12 },
  { id: 't22', name: 'LinkedIn Sponsored Post', category: 'Social Ads', type: 'Social Media', color: '#00D4FF', icon: 'work', description: 'Professional LinkedIn sponsored content template', tags: ['linkedin', 'b2b', 'sponsored'], slides: 3 },
  { id: 't23', name: 'YouTube Channel Art Pack', category: 'Video', type: 'Video', color: '#FF1744', icon: 'play-circle-filled', description: 'Complete YouTube channel branding package', tags: ['youtube', 'channel', 'branding'], slides: 5 },
  { id: 't24', name: 'Webinar Registration Page', category: 'Business', type: 'Landing Page', color: '#7B2FBE', icon: 'live-tv', description: 'High-converting webinar registration landing page', tags: ['webinar', 'landing', 'registration'], slides: 1 },
  { id: 't25', name: 'E-Commerce Product Page', category: 'Business', type: 'Website', color: '#00C853', icon: 'store', description: 'Conversion-optimized product page template', tags: ['ecommerce', 'product', 'conversion'], slides: 1 },
  { id: 't26', name: 'Black Friday Sale Ad Pack', category: 'Social Ads', type: 'Campaign', color: '#FF1744', icon: 'local-offer', description: 'Complete Black Friday promotional campaign templates', tags: ['blackfriday', 'sale', 'promo'], slides: 15 },
  { id: 't27', name: 'Startup Pitch Deck', category: 'Business', type: 'Presentation', color: '#FFD700', icon: 'lightbulb', description: 'Investor-ready startup pitch deck template', tags: ['startup', 'investors', 'pitch'], slides: 18 },
  { id: 't28', name: 'Fitness Brand Kit', category: 'Business', type: 'Brand', color: '#00C853', icon: 'fitness-center', description: 'Complete fitness and wellness brand identity kit', tags: ['fitness', 'wellness', 'health'], slides: 8 },
  { id: 't29', name: 'Fashion Lookbook Slides', category: 'Product', type: 'Presentation', color: '#FF6B35', icon: 'style', description: 'Fashion brand seasonal lookbook presentation', tags: ['fashion', 'lookbook', 'brand'], slides: 20 },
  { id: 't30', name: 'Tech Product Demo Script', category: 'Product', type: 'Video Script', color: '#00D4FF', icon: 'computer', description: 'Product demonstration video script for tech products', tags: ['tech', 'demo', 'product'], slides: 1 },
];

export const AD_ANIMATIONS: AdAnimation[] = [
  { id: 'a1', name: 'Slide In Left', icon: 'arrow-forward', description: 'Elements slide in from left edge' },
  { id: 'a2', name: 'Zoom Burst', icon: 'zoom-in', description: 'Explosive zoom from center' },
  { id: 'a3', name: 'Fade Sequence', icon: 'blur-on', description: 'Sequential fade in of elements' },
  { id: 'a4', name: 'Bounce Drop', icon: 'keyboard-arrow-down', description: 'Elements drop with bounce effect' },
  { id: 'a5', name: 'Rotate Spin', icon: 'autorenew', description: '360° spin entrance animation' },
  { id: 'a6', name: 'Glitch Effect', icon: 'broken-image', description: 'Digital glitch distortion effect' },
  { id: 'a7', name: 'Parallax Scroll', icon: 'swap-vert', description: 'Multi-layer parallax movement' },
  { id: 'a8', name: 'Typewriter', icon: 'keyboard', description: 'Text appears letter by letter' },
  { id: 'a9', name: 'Particle Burst', icon: 'grain', description: 'Particle explosion animation' },
  { id: 'a10', name: '3D Flip', icon: 'flip', description: '3D card flip reveal effect' },
  { id: 'a11', name: 'Neon Glow', icon: 'wb-incandescent', description: 'Neon light glow effect' },
  { id: 'a12', name: 'Wave Motion', icon: 'waves', description: 'Fluid wave animation' },
];

export const AD_FORMATS = [
  { id: 'f1', name: 'Square (1:1)', size: '1080×1080', platforms: ['Instagram', 'Facebook'] },
  { id: 'f2', name: 'Story (9:16)', size: '1080×1920', platforms: ['Instagram', 'TikTok', 'Snapchat'] },
  { id: 'f3', name: 'Landscape (16:9)', size: '1920×1080', platforms: ['YouTube', 'Facebook', 'Google'] },
  { id: 'f4', name: 'Portrait (4:5)', size: '1080×1350', platforms: ['Instagram', 'Pinterest'] },
  { id: 'f5', name: 'Leaderboard', size: '728×90', platforms: ['Google Display', 'Website'] },
  { id: 'f6', name: 'Medium Rectangle', size: '300×250', platforms: ['Google Display', 'Website'] },
  { id: 'f7', name: 'LinkedIn Banner', size: '1200×628', platforms: ['LinkedIn'] },
  { id: 'f8', name: 'Twitter Card', size: '1200×675', platforms: ['Twitter/X'] },
];

export const LOCAL_TRICKS = [
  { title: 'Google Maps Optimization', tip: 'Add 10+ photos weekly to boost local ranking by 35%', icon: 'map' },
  { title: 'Hyper-Local Targeting', tip: 'Use 1km radius Facebook ads for highest local conversion', icon: 'location-on' },
  { title: 'Neighborhood Facebook Groups', tip: 'Post value content daily - NO direct promotion, build trust first', icon: 'people' },
  { title: 'Local Influencer Partnership', tip: 'Micro-influencers with 1k-10k local followers drive real foot traffic', icon: 'star' },
  { title: 'Review Generation System', tip: 'Text customers immediately post-service for 5× more reviews', icon: 'rate-review' },
  { title: 'Local Event Sponsorship', tip: 'Sponsor local events for brand visibility + backlinks from event sites', icon: 'event' },
  { title: 'Neighborhood Mailer Campaign', tip: 'Direct mail in 1 mile radius gets 4.4% response vs 0.12% email', icon: 'mail' },
  { title: 'Local Podcast Guesting', tip: 'Appear on local business podcasts for targeted authority building', icon: 'mic' },
];
