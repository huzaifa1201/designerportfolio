import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import { Project, Inquiry, Testimonial } from '../types';

// Support both committed JSON config and optional Vercel environment variables
const resolvedConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || rawFirebaseConfig.apiKey,
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || rawFirebaseConfig.authDomain,
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || rawFirebaseConfig.projectId,
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || rawFirebaseConfig.storageBucket,
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || rawFirebaseConfig.messagingSenderId,
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || rawFirebaseConfig.appId,
  measurementId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) || rawFirebaseConfig.measurementId,
  firestoreDatabaseId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIRESTORE_DATABASE_ID) || (rawFirebaseConfig as any).firestoreDatabaseId,
};

// Initialize Firebase App
export const app = initializeApp(resolvedConfig);

// Initialize Firestore with custom databaseId if configured
export const db = resolvedConfig.firestoreDatabaseId
  ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Error handling types matching Firebase Skill specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial Connection Test per Skill Requirement
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is warming up.');
    }
    return false;
  }
}

// Initial Seed Dataset for Munazza Irfan Portfolio
export const SEED_PROJECTS: Omit<Project, 'id'>[] = [
  // 6 Video Reels
  {
    slug: 'capital-smart-city-1-kanal-villas',
    title: 'Capital Smart City 1-Kanal Luxury Villas Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
    client_or_brand: 'Capital Smart City Islamabad',
    description:
      'High-energy vertical drone reel featuring Sector B Overseas East villas with kinetic typography, modern audio sync, and architectural cinematography.',
    tags: ['Drone Reel', 'Real Estate', 'Kinetic Typography', 'Premiere Pro', '4K Drone'],
    aspect_ratio: '9:16',
    likes_count: 52,
    views_count: 740,
    featured: true,
    sort_order: 1,
  },
  {
    slug: 'eastern-housing-structural-construction',
    title: 'Structural Foundation & Machinery Action Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Building_Foundation___Structural_Construction_a1ca3da9.mp4',
    client_or_brand: 'Eastern Housing Lahore',
    description:
      'Industrial pacing montage highlighting steel cutting, crane lifts, and worker dedication with punchy percussion audio and cinematic color grading.',
    tags: ['Industrial', 'Action Cuts', 'Sound Design', 'Commercial Reel'],
    aspect_ratio: '9:16',
    likes_count: 44,
    views_count: 610,
    featured: true,
    sort_order: 2,
  },
  {
    slug: 'educational-engineering-mathematics',
    title: 'The Philosophy of Mathematics & Thinking Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Educational-Engineering_6a9cf9c0.mp4',
    client_or_brand: 'Educational Engineering',
    description:
      'Thought-provoking educational short reel combining Urdu subtitles, Einstein quotes, neural network animations, and b-roll transitions.',
    tags: ['Educational', 'Urdu Typography', 'Subtitles', 'Motion Graphics'],
    aspect_ratio: '9:16',
    likes_count: 78,
    views_count: 980,
    featured: true,
    sort_order: 3,
  },
  {
    slug: 'study-trick-brain-alert-mode',
    title: 'Study Trick Ep-42: Brain Focus & Memory Hack',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Learning_tricks_d3944f13.mp4',
    client_or_brand: 'The Aspirex',
    description:
      'Viral high-retention educational reel using dark anime aesthetics, countdown graphics, step-by-step Urdu voiceover, and pacing.',
    tags: ['Viral Short', 'Voiceover Timing', 'Anime Graphics', 'Study Hack'],
    aspect_ratio: '9:16',
    likes_count: 112,
    views_count: 1420,
    featured: true,
    sort_order: 4,
  },
  {
    slug: 'eastern-housing-corporate-construction',
    title: 'Eastern Housing Corporate Progress & Quality Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/On-Site_Building_Construction_Progress_9f6d1756.mp4',
    client_or_brand: 'Eastern Housing Lahore',
    description:
      'Full narrative commercial reel highlighting QA engineering team inspection, resident testimonials, and brand identity animations.',
    tags: ['Corporate Film', 'Urdu Voiceover', 'Resident Testimonial', 'Drone'],
    aspect_ratio: '9:16',
    likes_count: 63,
    views_count: 890,
    featured: false,
    sort_order: 5,
  },
  {
    slug: 'capital-smart-city-split-screen',
    title: 'Capital Smart City 3-Split Architectural Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Real_Estate_Showcase_1dc50f40.mp4',
    client_or_brand: 'Capital Smart City',
    description:
      'Multi-layer 3-way split screen visual showcasing Lake View Heights, Linear Park, and Sports Complex in synchronized harmony.',
    tags: ['Split Screen', 'Creative Layout', 'Real Estate', 'Branding'],
    aspect_ratio: '9:16',
    likes_count: 85,
    views_count: 1100,
    featured: true,
    sort_order: 6,
  },

  // 15 Graphic Design Works
  {
    slug: 'burger-lab-instagram-post',
    title: 'Burger Lab 30% Off Social Media Campaign',
    category: 'social',
    media_type: 'image',
    media_url: '/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png',
    client_or_brand: 'Burger Lab',
    description:
      'Mouthwatering commercial social media post with dynamic curved framing, floating tomatoes, layered typography, and high-conversion call to action.',
    tags: ['Social Media', 'Food Design', 'Canva', 'Photoshop', 'Instagram'],
    aspect_ratio: '1:1',
    likes_count: 69,
    views_count: 810,
    featured: true,
    sort_order: 7,
  },
  {
    slug: 'munazza-irfan-luxury-business-card',
    title: 'Executive Head Manager Black Silk Card',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_Card__2__40af2b3d.png',
    client_or_brand: 'Munazza Irfan Portfolio',
    description:
      'Luxury corporate business card concept designed for executive positioning with metallic gold typography on pure black folded silk texture.',
    tags: ['Business Card', 'Luxury Gold', 'Silk Texture', 'Corporate Identity'],
    aspect_ratio: '16:9',
    likes_count: 95,
    views_count: 1180,
    featured: true,
    sort_order: 8,
  },
  {
    slug: 'juniper-street-cafe-business-card',
    title: 'Juniper Street Café Botanical Stationery',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_Card_a1f870ac.jpg',
    client_or_brand: 'Juniper Street Café',
    description:
      'Organic cafe identity stationery card mockup pairing terracotta warmth with deep eucalyptus green botanical illustrations.',
    tags: ['Cafe Branding', 'Botanical', 'Stationery Mockup', 'Earth Tones'],
    aspect_ratio: '1:1',
    likes_count: 51,
    views_count: 640,
    featured: false,
    sort_order: 9,
  },
  {
    slug: 'helping-businesses-work-smarter-card',
    title: 'Helping Businesses Work Smarter Brand Identity',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_card_b53b857b.png',
    client_or_brand: 'Munazza Irfan',
    description:
      'Sophisticated brand card featuring custom gold geometric mandala mark and client-focused brand motto on dark satin.',
    tags: ['Brand Identity', 'Gold Emblem', 'Luxury Fabric', 'Minimalist'],
    aspect_ratio: '16:9',
    likes_count: 73,
    views_count: 890,
    featured: true,
    sort_order: 10,
  },
  {
    slug: 'digital-marketing-agency-flyer',
    title: 'Digital Marketing Agency Tri-Fold Flyer',
    category: 'flyer',
    media_type: 'image',
    media_url: '/assets/aistudio/Flyer_b12b5985.jpg',
    client_or_brand: 'Digital Marketing Agency',
    description:
      'Clean modern corporate marketing flyer featuring canary yellow swooshes, structured business concept sections, and vector iconography.',
    tags: ['Flyer', 'Corporate Marketing', 'Print Design', 'Infographic'],
    aspect_ratio: '3:4',
    likes_count: 58,
    views_count: 720,
    featured: false,
    sort_order: 11,
  },
  {
    slug: 'pizza-house-grand-opening-flyer',
    title: 'Pizza House Pallandri Grand Opening Flyer',
    category: 'flyer',
    media_type: 'image',
    media_url: '/assets/aistudio/Flyer_9744df9f.png',
    client_or_brand: 'Pizza House Pallandri',
    description:
      'Vibrant local community announcement flyer highlighting menu specials, 30% discount promotion, and location details in Pallandri.',
    tags: ['Local Business', 'Restaurant Flyer', 'Grand Opening', 'Discount Promo'],
    aspect_ratio: '1:1',
    likes_count: 42,
    views_count: 530,
    featured: false,
    sort_order: 12,
  },
  {
    slug: 'boutique-vintage-crest-logo',
    title: 'A Boutique Vintage Fashion Filigree Crest',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo__2__63103627.jpg',
    client_or_brand: 'A Boutique Vintage',
    description:
      'Victorian baroque-inspired emblem monogram with ornamental scrollwork for luxury vintage apparel and fashion accessories.',
    tags: ['Logo Design', 'Vintage Monogram', 'Luxury Brand', 'Ornate Crest'],
    aspect_ratio: '1:1',
    likes_count: 76,
    views_count: 940,
    featured: true,
    sort_order: 13,
  },
  {
    slug: 'anna-fashion-store-logo',
    title: 'Anna Fashion Store Botanical Circle Logo',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo_12077448.jpg',
    client_or_brand: 'Anna Fashion Store',
    description:
      'Earthy minimalist fashion boutique mark using serif typography and subtle hand-drawn olive branch flourishes.',
    tags: ['Logo Design', 'Fashion Brand', 'Botanical Line Art', 'Earth Tones'],
    aspect_ratio: '1:1',
    likes_count: 64,
    views_count: 780,
    featured: false,
    sort_order: 14,
  },
  {
    slug: 'building-construction-architectural-logo',
    title: 'Building Construction Modern Skyline Logo',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo_5a797adc.png',
    client_or_brand: 'Building Construction Co.',
    description:
      'Geometric corporate identity mark featuring bold cobalt and steel grey skyscraper towers and drafted angle lines.',
    tags: ['Logo Design', 'Construction', 'Architecture', 'Corporate'],
    aspect_ratio: '1:1',
    likes_count: 50,
    views_count: 610,
    featured: false,
    sort_order: 15,
  },
  {
    slug: 'pizza-shop-slice-emblem-logo',
    title: 'Pizza Shop Bold Mascot Emblem',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Pizza_Logo_4039f311.png',
    client_or_brand: 'Pizza Shop',
    description:
      'High-contrast red and golden yellow graphic pizza slice logo with bold serif title badge for casual dining.',
    tags: ['Logo Design', 'Vector Illustration', 'Food Brand', 'Color Blocking'],
    aspect_ratio: '1:1',
    likes_count: 40,
    views_count: 480,
    featured: false,
    sort_order: 16,
  },
  {
    slug: 'mega-fashion-sale-poster',
    title: 'Mega Fashion Sale Upto 50% Off Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Poster_867920d9.png',
    client_or_brand: 'Mega Fashion Store',
    description:
      'High-fashion editorial retail campaign poster featuring model photography framed by vibrant gradient sunburst bars on dark canvas.',
    tags: ['Fashion Poster', 'Retail Promo', 'Commercial', 'Canva Pro'],
    aspect_ratio: '1:1',
    likes_count: 81,
    views_count: 1040,
    featured: true,
    sort_order: 17,
  },
  {
    slug: 'globex-solutions-corporate-banner',
    title: 'Globex Solutions Future Tech Web Banner',
    category: 'banner',
    media_type: 'image',
    media_url: '/assets/aistudio/Website_Banner_53c790d7.png',
    client_or_brand: 'Globex Solutions',
    description:
      'Full-width digital web banner highlighting holographic smart city interfaces, corporate strategy badges, and vibrant cobalt waves.',
    tags: ['Website Banner', 'Holographic', 'Corporate Tech', 'Digital Marketing'],
    aspect_ratio: '16:9',
    likes_count: 67,
    views_count: 860,
    featured: true,
    sort_order: 18,
  },
  {
    slug: 'al-jannat-summer-lawn-promo',
    title: 'Al-Jannat Summer Lawn 30% Off Social Post',
    category: 'social',
    media_type: 'image',
    media_url: '/assets/aistudio/Social_Media_Post_67ffe2bd.png',
    client_or_brand: 'Al-Jannat Collection',
    description:
      'Refined Pakistani summer lawn fashion collection post featuring pastel floral photography, bold price badge, and boutique styling.',
    tags: ['Social Media', 'Pakistani Fashion', 'Summer Lawn', 'Instagram Banner'],
    aspect_ratio: '1:1',
    likes_count: 62,
    views_count: 770,
    featured: false,
    sort_order: 19,
  },
  {
    slug: 'super-delicious-food-burger-poster',
    title: 'Super Delicious Food Menu Burger Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Burger_Poster_268dceeb.png',
    client_or_brand: 'Burger Junction',
    description:
      'Eye-catching split-backdrop food poster with realistic wood grain picnic table and speech bubble discount badges.',
    tags: ['Food Poster', 'Photoshop Composite', 'Retail', 'Fast Food'],
    aspect_ratio: '1:1',
    likes_count: 55,
    views_count: 680,
    featured: false,
    sort_order: 20,
  },
  {
    slug: 'codemind-university-admission-poster',
    title: 'CodeMind University Open Admission Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Admissions_University_Poster_a1db8ec5.png',
    client_or_brand: 'CodeMind University',
    description:
      'Professional academic admissions campaign poster featuring student photography, rounded violet glass card, and clean contact credentials.',
    tags: ['University Poster', 'Admissions', 'Academic Branding', 'Print Ready'],
    aspect_ratio: '3:4',
    likes_count: 91,
    views_count: 1190,
    featured: true,
    sort_order: 21,
  },
];

export const SEED_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
  {
    author: 'Khurram Shahzad',
    role: 'Marketing Lead',
    company: 'Eastern Housing Lahore',
    quote:
      'Munazza has a strong eye for video pacing and construction footage. Her reels captured our site development with impressive rhythm and clarity.',
    rating: 5,
  },
  {
    author: 'Taimoor Ahmed',
    role: 'Operations Director',
    company: 'Globex Solutions',
    quote:
      'Outstanding work on our corporate banners and MS Office presentations. Extremely punctual, detail-oriented, and receptive to feedback.',
    rating: 5,
  },
  {
    author: 'Zainab Malik',
    role: 'Brand Owner',
    company: 'Al-Jannat Collection',
    quote:
      'Her social media posts and summer lawn graphics helped elevate our online engagement. Highly recommended for creative design.',
    rating: 5,
  },
];

export const SEED_SKILLS = [
  {
    name: 'Canva Pro',
    category: 'design' as const,
    proficiency: 95,
    focus: 'Social Media & Banners',
    icon: 'canva',
    details:
      'Creates cohesive brand kits, Instagram carousels, retail sale posters, business stationery, and web hero banners with balanced typography and luxury aesthetics.',
    sort_order: 1,
  },
  {
    name: 'Adobe Photoshop',
    category: 'design' as const,
    proficiency: 85,
    focus: 'Photo Composites & Flyers',
    icon: 'photoshop',
    details:
      'Skilled in background removal, realistic shadow blending, commercial food/fashion poster retouching, tri-fold print flyers, and color-graded product mockups.',
    sort_order: 2,
  },
  {
    name: 'Adobe Premiere Pro',
    category: 'video' as const,
    proficiency: 90,
    focus: 'Reels Pacing & Beat Sync',
    icon: 'premiere',
    details:
      'Edits vertical 9:16 real estate drone reels, corporate progress films, multi-split screen layouts, smooth speed-ramping, and clean audio mixing.',
    sort_order: 3,
  },
  {
    name: 'CapCut Studio',
    category: 'video' as const,
    proficiency: 92,
    focus: 'Viral Hooks & Urdu Captions',
    icon: 'capcut',
    details:
      'Specializes in high-retention short-form pacing, bilingual Urdu/English animated subtitles, rhythmic sound FX, and engaging visual hooks for TikTok & Reels.',
    sort_order: 4,
  },
  {
    name: 'MS Word',
    category: 'office' as const,
    proficiency: 95,
    focus: 'Contracts & Documentation',
    icon: 'word',
    details:
      'Prepares formal business letters, structured academic reports, formatted office contracts, CV layouts, and proofread administrative documentation.',
    sort_order: 5,
  },
  {
    name: 'MS Excel',
    category: 'office' as const,
    proficiency: 90,
    focus: 'Data Entry, Formulas & Tracking',
    icon: 'excel',
    details:
      'Manages accurate data entry spreadsheets, inventory logs, attendance trackers, automated formulas, conditional formatting, and summary charts.',
    sort_order: 6,
  },
  {
    name: 'MS PowerPoint',
    category: 'office' as const,
    proficiency: 92,
    focus: 'Pitch Decks & Presentations',
    icon: 'powerpoint',
    details:
      'Designs clean corporate slide decks, academic visual briefings, animated transitions, and executive reports tailored for meetings and client pitches.',
    sort_order: 7,
  },
  {
    name: 'Windows OS & Hardware',
    category: 'it' as const,
    proficiency: 90,
    focus: 'Setup, Troubleshooting & Drivers',
    icon: 'windows',
    details:
      'Handles clean Windows installation, essential driver and software setup, printer/peripherals configuration, basic troubleshooting, and AI productivity workflows.',
    sort_order: 8,
  },
  {
    name: 'ChatGPT & Modern AI',
    category: 'it' as const,
    proficiency: 88,
    focus: 'Prompt Engineering & Productivity',
    icon: 'chatgpt',
    details:
      'Leverages modern generative AI models for accelerated document outlining, customer response drafting, automated summarization, and creative inspiration.',
    sort_order: 9,
  },
];

export const SEED_EXPERTISE = [
  {
    num: '01',
    title: 'MS Office Suite & Operations',
    category: 'office' as const,
    icon: 'file-text',
    summary: 'Word, Excel, and PowerPoint for structured documents, data calculation sheets, reporting, and presentations.',
    details: 'Advanced proficiency across the core Microsoft Office productivity suite. Specializes in producing executive-ready formal contracts, administrative correspondence, automated mathematical models in Excel, and branded presentation slide decks. Experienced with table styling, mail merge, conditional formatting, pivot tables, and master slide templates.',
    tags: ['MS Word', 'MS Excel', 'PowerPoint', 'Formulas', 'Templates'],
    tools: ['word', 'excel', 'powerpoint'],
    coursework: 'Certified via 6-Month Intensive IT & Office Management Diploma with distinction in spreadsheet automation and document formatting.',
    deliverables: [
      'Automated inventory and payroll calculation spreadsheets',
      'Executive corporate correspondence & standardized contracts',
      'Multi-slide branded visual pitch decks with custom animations',
      'Data cleansing, formula modeling, and conditional formatting'
    ],
    sort_order: 1,
  },
  {
    num: '02',
    title: 'Graphic Design & Visual Branding',
    category: 'design' as const,
    icon: 'palette',
    summary: 'Creating digital graphics, promotional flyers, posters, and social media visual assets with balanced composition.',
    details: 'Comprehensive graphic design capabilities focusing on commercial social media creatives, corporate stationery, promotional posters, and luxury brand identity. Skilled in color harmony, typography pairing, hierarchy, image background removal, realistic shadow blending, and print-ready prepress export.',
    tags: ['Canva Pro', 'Photoshop', 'Branding', 'Social Media', 'Print Layout'],
    tools: ['canva', 'photoshop', 'illustrator'],
    coursework: 'Practical creative modules encompassing 15+ simulated retail, hospitality, and educational client campaigns.',
    deliverables: [
      'Cohesive social media feed carousels and promotional story kits',
      'High-resolution tri-fold brochures and event flyers',
      'Luxury stationery mockups and vector filigree emblems',
      'Commercial product photo retouching and background extraction'
    ],
    sort_order: 2,
  },
  {
    num: '03',
    title: 'Short-Form Video Editing & Motion',
    category: 'video' as const,
    icon: 'film',
    summary: 'High-retention short-form digital content creation with audio synchronization, beat-matched cuts, and animated captions.',
    details: 'Specializes in vertical 9:16 content optimization for Instagram Reels, TikTok, and YouTube Shorts. Skilled in kinetic pacing, drone reel color enhancement, multi-screen framing, bilingual Urdu/English subtitles, dynamic sound effects, and retention-focused visual hooks.',
    tags: ['CapCut Studio', 'Premiere Pro', '9:16 Reels', 'Beat Sync', 'Urdu Captions'],
    tools: ['premiere', 'capcut', 'filmora'],
    coursework: 'Real estate and construction progress video editing assignments featuring aerial drone cinematography.',
    deliverables: [
      'High-energy real estate drone promotional reels',
      'Synchronized bilingual Urdu/English animated subtitles',
      'Seamless speed ramps, jump cuts, and beat-matched audio',
      'High-converting video hook curation and audio mixing'
    ],
    sort_order: 3,
  },
  {
    num: '04',
    title: 'IT Support & Systems Diagnostics',
    category: 'it' as const,
    icon: 'cpu',
    summary: 'Windows installation, drivers and software setup, peripheral configuration, hardware diagnostics, and routine troubleshooting.',
    details: 'Hands-on technical workstation administration. Experienced in clean Windows 10/11 operating system deployments, device driver configuration, registry optimizations, peripheral setup (printers, scanners, dual monitors), malware removal, and office network troubleshooting.',
    tags: ['Windows OS', 'Hardware Setup', 'Driver Config', 'Diagnostics', 'System Recovery'],
    tools: ['windows', 'hardware', 'diagnostics'],
    coursework: 'Hardware laboratory hands-on training including complete PC assembly, disk partitioning, and OS recovery.',
    deliverables: [
      'Clean OS installation, disk partitioning, and UEFI/BIOS setup',
      'Office workstation peripheral and printer network configuration',
      'Hardware diagnostics, driver conflicts resolution, and system recovery',
      'Data backup protocols and preventive maintenance routines'
    ],
    sort_order: 4,
  },
  {
    num: '05',
    title: 'Internet Research & Academic Data Mining',
    category: 'research' as const,
    icon: 'globe',
    summary: 'Advanced web browsing, systematic online data gathering, academic research compilation, and digital correspondence.',
    details: 'Leveraging structured research methodologies to synthesize complex information across academic databases, competitive industry landscapes, and digital directories. Paired with BS English linguistics training for rigorous critical analysis and articulated executive briefings.',
    tags: ['Data Mining', 'Academic Search', 'Information Retrieval', 'Fact Checking'],
    tools: ['chatgpt', 'claude'],
    coursework: 'Linguistic discourse analysis and academic literature reviews as part of ongoing BS English degree.',
    deliverables: [
      'Comprehensive competitive market analysis and directory mining',
      'Structured academic bibliography and literature summarization',
      'Executive briefing memos and formal business correspondence',
      'Validated contact database curation and lead extraction'
    ],
    sort_order: 5,
  },
  {
    num: '06',
    title: 'Online Collaboration & Virtual Operations',
    category: 'collaboration' as const,
    icon: 'users',
    summary: 'Managing meetings, real-time screen sharing, cloud drive organization, and collaborative workspace communication.',
    details: 'Coordinating hybrid and remote operational workflows using contemporary cloud collaboration tools. Expert in scheduling multi-party video conferences, moderating screen shares, managing Google Workspace / Microsoft 365 cloud directory architectures, and maintaining seamless team communications.',
    tags: ['Zoom', 'Google Workspace', 'MS Teams', 'Cloud Drive', 'Remote Workflows'],
    tools: ['zoom', 'googleworkspace'],
    coursework: 'Office simulation training managing virtual calendars, meetings, and shared repository permissions.',
    deliverables: [
      'Meeting agenda preparation, scheduling, and live minute recording',
      'Structured Google Drive / OneDrive folder hierarchies and access control',
      'Remote team onboarding documentation and virtual desk assistance',
      'Cross-channel collaborative correspondence and follow-ups'
    ],
    sort_order: 6,
  },
  {
    num: '07',
    title: 'AI Fundamentals & Productivity Workflows',
    category: 'ai' as const,
    icon: 'brain',
    summary: 'Modern AI engines, prompt engineering for document drafting, data structuring, creative ideation, and workflow acceleration.',
    details: 'Applying cutting-edge generative AI models (ChatGPT, Claude, Gemini) to augment daily office productivity. Specializes in crafting precise multi-turn prompts for rapid content drafting, spreadsheet formula generation, customer reply curation, and workflow automation.',
    tags: ['Prompt Engineering', 'ChatGPT', 'Claude', 'Workflow Acceleration', 'Automation'],
    tools: ['chatgpt', 'claude'],
    coursework: 'Independent AI productivity experimentation applied directly to academic linguistic tasks and design workflows.',
    deliverables: [
      'Custom multi-step prompt templates for corporate documentation',
      'Rapid copywriting, summarization, and email reply generation',
      'Complex Excel formula generation and debugging via prompt models',
      'Creative ideation and visual brief structuring for design assets'
    ],
    sort_order: 7,
  },
];


// Helper to verify if an authenticated user has the 'admin' role
export async function checkIsUserAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;
  const normalizedEmail = user.email.toLowerCase().trim();
  const designatedAdmins = [
    'rajahuzaifa015166@gmail.com',
    'munazza.00077@gmail.com',
    'aliraza1122alikhan@gmail.com',
  ];

  if (designatedAdmins.includes(normalizedEmail)) {
    // Silently make sure their UID is recorded in the admins collection
    try {
      await ensureAdminRecord(user.uid, normalizedEmail);
    } catch {
      // Ignore background write errors
    }
    return true;
  }

  // 1. Direct document check by Firebase Auth UID
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      if (data && (data.role === 'admin' || data.role === 'superadmin')) return true;
    }
  } catch (e) {
    console.warn('Could not read admin doc by uid:', e);
  }

  // 2. Document check by slugified email ID (e.g. rajahuzaifa015166-gmail-com)
  try {
    const slugId = normalizedEmail.replace(/[^a-z0-9]+/g, '-');
    const slugDoc = await getDoc(doc(db, 'admins', slugId));
    if (slugDoc.exists()) {
      const data = slugDoc.data();
      if (data && (data.role === 'admin' || data.role === 'superadmin')) return true;
    }
  } catch (e) {
    console.warn('Could not read admin doc by slug:', e);
  }

  // 3. Fallback: query admins collection for any document where email == normalizedEmail
  try {
    const q = query(collection(db, 'admins'), where('email', '==', normalizedEmail));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      for (const d of querySnap.docs) {
        const data = d.data();
        if (data && (data.role === 'admin' || data.role === 'superadmin')) {
          // Link this UID for instant future lookups
          try {
            await ensureAdminRecord(user.uid, normalizedEmail);
          } catch {
            // Ignore
          }
          return true;
        }
      }
    }
  } catch (e) {
    console.warn('Could not query admins collection by email:', e);
  }

  // 4. Check SQLite /api/admins/verify fallback
  try {
    const res = await fetch(`/api/admins/verify?email=${encodeURIComponent(normalizedEmail)}`, {
      headers: { 'x-admin-email': normalizedEmail },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.isAdmin) {
        return true;
      }
    }
  } catch {
    // Offline or server not available
  }

  return false;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  role: string;
  added_by?: string;
  created_at?: string;
  is_super?: boolean;
}

// Fetch all administrators (Firestore + API / SQLite fallback)
export async function fetchAdminList(): Promise<AdminUserRecord[]> {
  const adminMap = new Map<string, AdminUserRecord>();
  const adminEmail = auth.currentUser?.email || '';

  // 1. Fetch from SQLite /api/admins
  try {
    const res = await fetch('/api/admins', {
      headers: { 'x-admin-email': adminEmail },
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        for (const r of rows) {
          if (r.email) {
            const norm = r.email.toLowerCase().trim();
            adminMap.set(norm, {
              id: String(r.id),
              email: norm,
              role: r.role || 'admin',
              added_by: r.added_by || 'admin',
              created_at: r.created_at,
              is_super: norm === 'munazza.00077@gmail.com' || norm === 'rajahuzaifa015166@gmail.com',
            });
          }
        }
      }
    }
  } catch {
    // Offline or server not responding
  }

  // 2. Fetch from Firestore (merge with SQLite)
  try {
    const snap = await getDocs(collection(db, 'admins'));
    for (const d of snap.docs) {
      const data = d.data();
      if (data && data.email) {
        const norm = data.email.toLowerCase().trim();
        const existing = adminMap.get(norm);
        adminMap.set(norm, {
          id: d.id,
          email: norm,
          role: data.role || existing?.role || 'admin',
          added_by: data.added_by || existing?.added_by || 'admin',
          created_at: data.created_at || data.updated_at || existing?.created_at,
          is_super: existing?.is_super || false,
        });
      }
    }
  } catch (err) {
    console.warn('Could not list admins from Firestore:', err);
  }

  // If both storage sources are completely empty, provide fallback
  if (adminMap.size === 0) {
    const defaultList = [
      { email: 'rajahuzaifa015166@gmail.com', role: 'superadmin' },
      { email: 'munazza.00077@gmail.com', role: 'superadmin' },
    ];
    for (const def of defaultList) {
      adminMap.set(def.email, {
        id: def.email.replace(/[^a-z0-9]+/g, '-'),
        email: def.email,
        role: def.role,
        added_by: 'system',
        created_at: new Date().toISOString(),
        is_super: true,
      });
    }
  }

  return Array.from(adminMap.values());
}

// Add or grant role to a new admin
export async function addAdminUser(email: string, addedBy: string = 'admin'): Promise<AdminUserRecord> {
  const norm = email.toLowerCase().trim();
  const slugId = norm.replace(/[^a-z0-9]+/g, '-');
  const now = new Date().toISOString();
  const adminEmail = auth.currentUser?.email || '';

  // Save to Firestore
  try {
    await setDoc(
      doc(db, 'admins', slugId),
      {
        email: norm,
        role: 'admin',
        added_by: addedBy,
        created_at: now,
        updated_at: now,
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Firestore add admin write warning:', e);
  }

  // Sync to SQLite /api/admins
  try {
    await fetch('/api/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify({ email: norm, role: 'admin', added_by: addedBy }),
    });
  } catch {}

  return {
    id: slugId,
    email: norm,
    role: 'admin',
    added_by: addedBy,
    created_at: now,
    is_super: false,
  };
}

// Remove or revoke an admin (Works for ANY admin in the list)
export async function removeAdminUser(idOrEmail: string): Promise<void> {
  const norm = idOrEmail.toLowerCase().trim();
  const slugId = norm.replace(/[^a-z0-9]+/g, '-');
  const adminEmail = auth.currentUser?.email || '';

  // 1. Delete from Firestore by direct idOrEmail (in case it is the UID or document key)
  try {
    await deleteDoc(doc(db, 'admins', idOrEmail));
  } catch (e) {
    // Continue
  }

  // 2. Delete from Firestore by slugId
  try {
    await deleteDoc(doc(db, 'admins', slugId));
  } catch (e) {
    console.warn('Could not delete admin by slugId:', e);
  }

  // 3. Delete from Firestore by query matching email
  try {
    const q = query(collection(db, 'admins'), where('email', '==', norm));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  } catch (e) {
    console.warn('Could not delete admin docs by email query:', e);
  }

  // 4. Delete from SQLite
  try {
    await fetch(`/api/admins/${encodeURIComponent(norm)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-email': adminEmail,
      },
    });
  } catch (e) {
    console.warn('Could not delete admin from SQLite API:', e);
  }
}

// Ensure an authorized admin is recorded in the admins collection
export async function ensureAdminRecord(uid: string, email: string): Promise<void> {
  try {
    await setDoc(
      doc(db, 'admins', uid),
      {
        email,
        role: 'admin',
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Could not write admin record:', e);
  }
}

// Helper to push all seeded dataset to Firestore
export async function seedFirestoreDatabase(): Promise<{
  projectsCount: number;
  testimonialsCount: number;
  skillsCount: number;
  expertiseCount?: number;
}> {

  let projectsCount = 0;
  let testimonialsCount = 0;
  let skillsCount = 0;

  try {
    const projectsColl = collection(db, 'projects');
    const existingProjectsSnap = await getDocs(projectsColl);

    if (existingProjectsSnap.empty) {
      for (const p of SEED_PROJECTS) {
        const docRef = doc(projectsColl, p.slug);
        await setDoc(docRef, {
          ...p,
          created_at: new Date().toISOString(),
        });
        projectsCount++;
      }
    } else {
      projectsCount = existingProjectsSnap.size;
    }

    const testimonialsColl = collection(db, 'testimonials');
    const existingTestimonialsSnap = await getDocs(testimonialsColl);

    if (existingTestimonialsSnap.empty) {
      for (const t of SEED_TESTIMONIALS) {
        await addDoc(testimonialsColl, {
          ...t,
          created_at: new Date().toISOString(),
        });
        testimonialsCount++;
      }
    } else {
      testimonialsCount = existingTestimonialsSnap.size;
    }

    const skillsColl = collection(db, 'skills');
    const existingSkillsSnap = await getDocs(skillsColl);

    if (existingSkillsSnap.empty) {
      for (const s of SEED_SKILLS) {
        const docId = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await setDoc(doc(skillsColl, docId), {
          ...s,
          created_at: new Date().toISOString(),
        });
        skillsCount++;
      }
    } else {
      for (const existingDoc of existingSkillsSnap.docs) {
        const data = existingDoc.data();
        const seedMatch = SEED_SKILLS.find(
          (s) => s.name.toLowerCase() === String(data.name || '').toLowerCase()
        );
        if (seedMatch && (!data.icon || !data.details)) {
          await setDoc(
            doc(skillsColl, existingDoc.id),
            {
              icon: data.icon || seedMatch.icon,
              details: data.details || seedMatch.details,
            },
            { merge: true }
          );
        }
      }
      skillsCount = existingSkillsSnap.size;
    }

    let expertiseCount = 0;
    const expertiseColl = collection(db, 'expertise');
    const existingExpertiseSnap = await getDocs(expertiseColl);

    if (existingExpertiseSnap.empty) {
      for (const e of SEED_EXPERTISE) {
        const docId = `expertise-${e.num || e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        await setDoc(doc(expertiseColl, docId), {
          ...e,
          created_at: new Date().toISOString(),
        });
        expertiseCount++;
      }
    } else {
      expertiseCount = existingExpertiseSnap.size;
    }

    return { projectsCount, testimonialsCount, skillsCount, expertiseCount };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'projects/seed');
  }
}


// Authentication Helpers
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
};
export type { User };
