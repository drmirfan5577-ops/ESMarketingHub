export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  prompt: string;
  variables: string[];
  useCase: string;
}

export const PROMPT_CATEGORIES = [
  'All', 'Social Media', 'Email', 'Product', 'Medical', 'Video Script',
  'SEO', 'App Store', 'Game', 'Local', 'B2B', 'E-Commerce',
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'p1', title: 'Viral Instagram Caption', category: 'Social Media',
    icon: 'photo-camera', color: '#E1306C',
    prompt: 'Write a viral Instagram caption for [PRODUCT/SERVICE] targeting [TARGET_AUDIENCE]. Include an engaging hook, 3 key benefits, emotional storytelling, and a clear call-to-action. Use emojis strategically. End with 5 relevant hashtags.',
    variables: ['PRODUCT/SERVICE', 'TARGET_AUDIENCE'],
    useCase: 'Instagram posts, reels, stories',
  },
  {
    id: 'p2', title: 'Facebook Ad Copy (AIDA)', category: 'Social Media',
    icon: 'people', color: '#1877F2',
    prompt: 'Create a Facebook ad using AIDA formula for [PRODUCT] priced at [PRICE]. Attention: Bold hook about [PAIN_POINT]. Interest: How [PRODUCT] solves it. Desire: 3 powerful benefits + social proof. Action: Urgent CTA with scarcity.',
    variables: ['PRODUCT', 'PRICE', 'PAIN_POINT'],
    useCase: 'Facebook paid advertising',
  },
  {
    id: 'p3', title: 'TikTok Viral Hook Script', category: 'Video Script',
    icon: 'music-video', color: '#FF0050',
    prompt: 'Write a 30-second TikTok script for [PRODUCT] using the "POV" format. Second 0-3: Shocking hook that stops scroll. Second 3-10: Identify relatable problem [PAIN_POINT]. Second 10-25: Demonstrate solution dramatically. Second 25-30: Transformative result + CTA. Include visual direction notes.',
    variables: ['PRODUCT', 'PAIN_POINT'],
    useCase: 'TikTok, Instagram Reels, YouTube Shorts',
  },
  {
    id: 'p4', title: 'Email Subject Line Generator', category: 'Email',
    icon: 'email', color: '#FF6B35',
    prompt: 'Generate 10 high-converting email subject lines for [EMAIL_TOPIC] targeting [AUDIENCE]. Include variations using: curiosity gaps, numbers, personalization [NAME], urgency, controversy, and FOMO. Aim for 40-50 character optimal length. Rate each by open rate potential 1-10.',
    variables: ['EMAIL_TOPIC', 'AUDIENCE', 'NAME'],
    useCase: 'Email campaigns, newsletters',
  },
  {
    id: 'p5', title: 'Product Description Writer', category: 'Product',
    icon: 'shopping-bag', color: '#00C853',
    prompt: 'Write a compelling product description for [PRODUCT_NAME] with features: [FEATURES]. Target customer: [CUSTOMER_PROFILE]. Include: Emotional headline, sensory-rich opening, 5 benefit bullets (not features), social proof statement, and urgency close. Format for both web and mobile.',
    variables: ['PRODUCT_NAME', 'FEATURES', 'CUSTOMER_PROFILE'],
    useCase: 'E-commerce, Amazon, Shopify',
  },
  {
    id: 'p6', title: 'Medical Content (Patient-Friendly)', category: 'Medical',
    icon: 'local-hospital', color: '#00C853',
    prompt: 'Create patient-friendly content about [MEDICAL_TOPIC] for [PATIENT_TYPE] patients. Reading level: 6th grade. Include: Plain language explanation, what to expect, 3 actionable tips, when to call doctor, and reassuring closing. Add required medical disclaimer. Avoid jargon. HIPAA compliant.',
    variables: ['MEDICAL_TOPIC', 'PATIENT_TYPE'],
    useCase: 'Healthcare websites, patient education',
  },
  {
    id: 'p7', title: 'Clinical Study Summary', category: 'Medical',
    icon: 'science', color: '#00D4FF',
    prompt: 'Summarize clinical study on [STUDY_TOPIC] for [AUDIENCE: physicians/patients/general]. Include: Study objective, methodology overview, key findings with statistics, clinical implications, limitations, and conclusion. Use appropriate medical terminology for [AUDIENCE]. Add APA citation format.',
    variables: ['STUDY_TOPIC', 'AUDIENCE'],
    useCase: 'Medical presentations, pharmaceutical marketing',
  },
  {
    id: 'p8', title: 'App Store Description', category: 'App Store',
    icon: 'apps', color: '#FF6B35',
    prompt: 'Write an optimized App Store description for [APP_NAME] - a [APP_CATEGORY] app. Primary keyword: [KEYWORD]. Include: Attention-grabbing opening line, core value proposition, 5 key features as benefits, social proof (if any), and compelling download CTA. Keyword density 2-3%. Under 4000 characters.',
    variables: ['APP_NAME', 'APP_CATEGORY', 'KEYWORD'],
    useCase: 'iOS App Store, Google Play Store',
  },
  {
    id: 'p9', title: 'Google Ads Copy', category: 'SEO',
    icon: 'search', color: '#4285F4',
    prompt: 'Create 3 Google Responsive Search Ad variations for [BUSINESS] offering [SERVICE/PRODUCT]. Each needs: 3 headlines (max 30 chars each), 2 descriptions (max 90 chars each). Include primary keyword [KEYWORD] in at least one headline. Add emotional triggers, unique selling points, and strong CTAs. Label as Headline 1/2/3, Description 1/2.',
    variables: ['BUSINESS', 'SERVICE/PRODUCT', 'KEYWORD'],
    useCase: 'Google Ads, Bing Ads',
  },
  {
    id: 'p10', title: 'YouTube Video Description SEO', category: 'Video Script',
    icon: 'play-circle-filled', color: '#FF0000',
    prompt: 'Write an SEO-optimized YouTube description for "[VIDEO_TITLE]" targeting keyword [KEYWORD]. Structure: Hook paragraph (2-3 sentences), timestamps (provide 5-8 suggested chapters), resources mentioned, about channel section, CTA for subscribe/like, social links placeholders, and 10 relevant tags. Total 2500-5000 characters.',
    variables: ['VIDEO_TITLE', 'KEYWORD'],
    useCase: 'YouTube channel growth',
  },
  {
    id: 'p11', title: 'LinkedIn Thought Leadership Post', category: 'B2B',
    icon: 'work', color: '#0A66C2',
    prompt: 'Write a LinkedIn thought leadership post about [INDUSTRY_TOPIC] from perspective of [ROLE] at [COMPANY_TYPE]. Format: Provocative opening question or statement, personal story/observation, contrarian insight, 5 numbered actionable takeaways, discussion question to drive comments. 800-1200 words. Professional but conversational tone.',
    variables: ['INDUSTRY_TOPIC', 'ROLE', 'COMPANY_TYPE'],
    useCase: 'LinkedIn B2B marketing',
  },
  {
    id: 'p12', title: 'Game Ad Script (Rewarded Video)', category: 'Game',
    icon: 'sports-esports', color: '#7B2FBE',
    prompt: 'Write a 30-second rewarded video ad script for mobile game [GAME_NAME] (genre: [GENRE]). Second 0-5: Show player struggling with hardest level. Second 5-15: Introduce power-up/feature dramatically. Second 15-25: Satisfying victory sequence. Second 25-30: Download CTA with reward offer "[REWARD]". Include visual FX notes and voice-over direction.',
    variables: ['GAME_NAME', 'GENRE', 'REWARD'],
    useCase: 'Mobile game marketing, User acquisition',
  },
  {
    id: 'p13', title: 'Local Business Google Post', category: 'Local',
    icon: 'location-on', color: '#7B2FBE',
    prompt: 'Write a Google My Business post for [BUSINESS_TYPE] in [CITY]. Type: [offer/event/update]. Include: Event/offer details, what makes [BUSINESS_NAME] different from competitors, specific neighborhood reference, local trust signals, and CTA with phone number placeholder. 150-300 words. Include relevant local keywords.',
    variables: ['BUSINESS_TYPE', 'CITY', 'BUSINESS_NAME'],
    useCase: 'Google My Business, local SEO',
  },
  {
    id: 'p14', title: 'E-Commerce Flash Sale Email', category: 'E-Commerce',
    icon: 'local-offer', color: '#FF1744',
    prompt: 'Write a flash sale email for [STORE_NAME] offering [DISCOUNT]% off [PRODUCT_CATEGORY] for [TIME_LIMIT] hours. Include: Urgent subject line (use number + deadline), preview text with emoji, personalized greeting, visual-friendly HTML structure suggestions, 3 featured products with placeholder prices, countdown timer note, scarcity statement, and unsubscribe footer.',
    variables: ['STORE_NAME', 'DISCOUNT', 'PRODUCT_CATEGORY', 'TIME_LIMIT'],
    useCase: 'Shopify, WooCommerce email marketing',
  },
  {
    id: 'p15', title: 'Influencer Outreach DM', category: 'Social Media',
    icon: 'star', color: '#FFD700',
    prompt: 'Write an influencer collaboration DM for [BRAND] reaching out to [INFLUENCER_TYPE] with [FOLLOWER_COUNT] followers. Offer: [COLLABORATION_TYPE]. Personalize by referencing their content style. Include: Genuine compliment, brand intro (2 sentences max), specific collaboration proposal, compensation mention, easy reply CTA. Keep under 200 words. Conversational, not corporate.',
    variables: ['BRAND', 'INFLUENCER_TYPE', 'FOLLOWER_COUNT', 'COLLABORATION_TYPE'],
    useCase: 'Influencer marketing outreach',
  },
  {
    id: 'p16', title: 'Press Release Template', category: 'B2B',
    icon: 'newspaper', color: '#00D4FF',
    prompt: 'Write a press release for [COMPANY] announcing [NEWS_TYPE: product launch/partnership/award/funding]. Include: FOR IMMEDIATE RELEASE header, city/date dateline, attention-grabbing headline, strong lede paragraph answering 5Ws, supporting quote from [SPOKESPERSON_TITLE], background paragraph, boilerplate about [COMPANY], media contact info placeholder. AP Style. 400-600 words.',
    variables: ['COMPANY', 'NEWS_TYPE', 'SPOKESPERSON_TITLE'],
    useCase: 'PR, media outreach, brand awareness',
  },
  {
    id: 'p17', title: 'Webinar Promotion Email Series', category: 'Email',
    icon: 'live-tv', color: '#FF6B35',
    prompt: 'Write a 3-email sequence promoting webinar "[WEBINAR_TITLE]" on [DATE]. Email 1 (2 weeks out): FOMO opener + registration CTA. Email 2 (3 days out): What attendees will learn, speaker credibility, urgency. Email 3 (day of): Last chance + what they will miss. Each email under 200 words. Subject lines included.',
    variables: ['WEBINAR_TITLE', 'DATE'],
    useCase: 'Webinar marketing, lead generation',
  },
  {
    id: 'p18', title: 'Review Request SMS/Email', category: 'Local',
    icon: 'rate-review', color: '#00C853',
    prompt: 'Write a review request message for [BUSINESS_TYPE] to send to [CUSTOMER_NAME] after their [SERVICE/PURCHASE]. SMS version (under 160 chars) and email version (under 100 words). Both versions: Personal tone, specific service reference, direct review link placeholder, no pressure language. Include follow-up version if no response in 3 days.',
    variables: ['BUSINESS_TYPE', 'CUSTOMER_NAME', 'SERVICE/PURCHASE'],
    useCase: 'Local reputation management',
  },
  {
    id: 'p19', title: 'A/B Test Ad Variant', category: 'Social Media',
    icon: 'science', color: '#00D4FF',
    prompt: 'Create 2 A/B test variants for [AD_TYPE] promoting [PRODUCT]. Version A: [ANGLE_A: fear-based/problem-focused]. Version B: [ANGLE_B: aspiration/solution-focused]. Same CTA, different emotional triggers. Include: Primary text, headline, description for each. Predict which will win for [AUDIENCE] and why. Suggest 3 metrics to track.',
    variables: ['AD_TYPE', 'PRODUCT', 'ANGLE_A', 'ANGLE_B', 'AUDIENCE'],
    useCase: 'Split testing, campaign optimization',
  },
  {
    id: 'p20', title: 'Podcast Episode Description', category: 'B2B',
    icon: 'mic', color: '#FFD700',
    prompt: 'Write show notes for podcast episode about [EPISODE_TOPIC] featuring guest [GUEST_NAME] from [GUEST_COMPANY]. Include: Episode hook (2 sentences), guest bio paragraph, 5 timestamped key insights (format: MM:SS - Insight), 3 key takeaways, resources mentioned placeholders, and subscribe/share CTA. 400-600 words. SEO-optimized with keyword [KEYWORD].',
    variables: ['EPISODE_TOPIC', 'GUEST_NAME', 'GUEST_COMPANY', 'KEYWORD'],
    useCase: 'Podcast marketing, SEO',
  },
  {
    id: 'p21', title: 'Chatbot Welcome Flow', category: 'App Store',
    icon: 'chat', color: '#00C853',
    prompt: 'Design a chatbot conversation flow for [BUSINESS_TYPE] website. Goal: [GOAL: lead gen/support/sales]. Write: Welcome message, 3 quick reply options, follow-up for each option (2 levels deep), lead capture question sequence, and handoff message to human. Include emoji for friendliness. Map the decision tree clearly.',
    variables: ['BUSINESS_TYPE', 'GOAL'],
    useCase: 'Website chatbots, customer service automation',
  },
  {
    id: 'p22', title: 'Pharmaceutical Detail Aid', category: 'Medical',
    icon: 'medication', color: '#7B2FBE',
    prompt: 'Create a pharmaceutical detail aid outline for [DRUG_NAME] indicated for [CONDITION]. For HCP audience. Include: MOA summary (2 sentences), efficacy data visualization suggestion, safety profile highlights, patient selection criteria, dosing information placeholder, and ISI reference note. All claims require citation placeholders. Regulatory-compliant language.',
    variables: ['DRUG_NAME', 'CONDITION'],
    useCase: 'Pharmaceutical sales, HCP marketing',
  },
  {
    id: 'p23', title: 'Black Friday Campaign Strategy', category: 'E-Commerce',
    icon: 'shopping-cart', color: '#FF1744',
    prompt: 'Create a complete Black Friday/Cyber Monday campaign plan for [STORE_TYPE] with budget [BUDGET]. Include: 4-week pre-launch teaser strategy, email sequence (5 emails with subject lines), social media posting calendar, ad creative concepts for each platform, recommended discount structure, and expected ROI calculation template. Timeline from Nov 1 to Dec 1.',
    variables: ['STORE_TYPE', 'BUDGET'],
    useCase: 'E-commerce holiday marketing',
  },
  {
    id: 'p24', title: 'Brand Story Narrative', category: 'B2B',
    icon: 'auto-stories', color: '#FF6B35',
    prompt: 'Write a compelling brand story for [COMPANY_NAME] founded in [YEAR] by [FOUNDER]. Industry: [INDUSTRY]. Structure: The problem founder faced, the aha moment, early struggles (authentic), breakthrough, current mission, future vision. Tone: Authentic, humble, inspiring. 500-800 words. Include quotes from founder. Suitable for About page and media kit.',
    variables: ['COMPANY_NAME', 'YEAR', 'FOUNDER', 'INDUSTRY'],
    useCase: 'Brand identity, website About page',
  },
  {
    id: 'p25', title: 'Retargeting Ad Copy', category: 'E-Commerce',
    icon: 'track-changes', color: '#00D4FF',
    prompt: 'Write retargeting ad copy for [BRAND] targeting people who visited [PAGE_TYPE: product page/checkout/blog] but did not convert. Acknowledge their familiarity without being creepy. Include: 3 objection-handling headlines, 2 social proof descriptions, offer or incentive suggestion, urgency element. Platform: [PLATFORM]. Warm, personalized tone.',
    variables: ['BRAND', 'PAGE_TYPE', 'PLATFORM'],
    useCase: 'Facebook/Google retargeting campaigns',
  },
  {
    id: 'p26', title: 'UGC Video Brief', category: 'Social Media',
    icon: 'videocam', color: '#FF1744',
    prompt: 'Create a UGC (User Generated Content) video brief for creators to promote [PRODUCT]. Include: Video style (authentic/lifestyle/testimonial), key messages to hit, prohibited claims, required disclosures, hook suggestions (3 options), product demo requirements, B-roll suggestions, caption guidance, and CTA. Deliverables: [VIDEO_SPECS]. Budget range: [RATE].',
    variables: ['PRODUCT', 'VIDEO_SPECS', 'RATE'],
    useCase: 'UGC creator briefs, influencer marketing',
  },
  {
    id: 'p27', title: 'Affiliate Recruitment Email', category: 'E-Commerce',
    icon: 'share', color: '#00C853',
    prompt: 'Write a recruitment email for [BRAND] affiliate program targeting [AUDIENCE_TYPE: bloggers/YouTubers/influencers]. Commission: [COMMISSION_RATE]. Include: Subject line, why [BRAND] converts well, commission structure details, support offered, exclusive perks for top affiliates, and easy sign-up CTA. Persuasive but not salesy. Under 300 words.',
    variables: ['BRAND', 'AUDIENCE_TYPE', 'COMMISSION_RATE'],
    useCase: 'Affiliate program growth',
  },
  {
    id: 'p28', title: 'Health & Wellness Newsletter', category: 'Medical',
    icon: 'favorite', color: '#FF1744',
    prompt: 'Write a monthly health newsletter for [CLINIC/BRAND] targeting [PATIENT_DEMOGRAPHIC]. Sections: 1) Health tip of the month ([HEALTH_TOPIC]), 2) Seasonal wellness advice, 3) Practice update/news (placeholder), 4) Patient success story format, 5) FAQ answer, 6) Upcoming events. Warm, professional tone. HIPAA-aware language. 600-800 words.',
    variables: ['CLINIC/BRAND', 'PATIENT_DEMOGRAPHIC', 'HEALTH_TOPIC'],
    useCase: 'Healthcare email marketing',
  },
  {
    id: 'p29', title: 'App Update Release Notes', category: 'App Store',
    icon: 'system-update', color: '#FF6B35',
    prompt: 'Write engaging App Store release notes for [APP_NAME] version [VERSION_NUMBER]. New features: [FEATURES_LIST]. Frame updates as benefits to users, not technical changes. Include: Exciting headline, 3-5 bullet points (benefit-focused), bug fix acknowledgment (friendly tone), feedback invitation. Two versions: Short (under 100 words) for App Store, long (200 words) for blog.',
    variables: ['APP_NAME', 'VERSION_NUMBER', 'FEATURES_LIST'],
    useCase: 'App Store updates, user communication',
  },
  {
    id: 'p30', title: 'Competitor Comparison Landing Page', category: 'B2B',
    icon: 'compare', color: '#00D4FF',
    prompt: 'Create copy for a [PRODUCT] vs [COMPETITOR] comparison landing page. Include: SEO-optimized headline with both brand names, honest comparison table (5 key features), why switch section (3 migration benefits), customer quote placeholder, risk-reversal offer, and CTA. Tone: Confident but fair. Target keyword: "[PRODUCT] vs [COMPETITOR]". Avoid false claims.',
    variables: ['PRODUCT', 'COMPETITOR'],
    useCase: 'Competitive marketing, SEO landing pages',
  },
];
