import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Global Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Ensure data directory exists (Handle Vercel serverless temp writable directory)
const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel ? os.tmpdir() : path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory:', err);
  }
}

// Initialize SQLite database
const dbFile = path.join(dataDir, 'portfolio.db');
if (isVercel && !fs.existsSync(dbFile)) {
  const seedDbPath = path.join(__dirname, 'data', 'portfolio.db');
  if (fs.existsSync(seedDbPath)) {
    try {
      fs.copyFileSync(seedDbPath, dbFile);
    } catch (e) {
      console.warn('Could not copy seed database to temp dir:', e);
    }
  }
}

let db: any = null;
try {
  db = new Database(dbFile);
  if (!isVercel) {
    db.pragma('journal_mode = WAL');
  }
} catch (err) {
  console.warn('SQLite initialization warning (running in serverless fallback mode):', err);
}

// Initialize schema if database connection is active
if (db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    media_type TEXT NOT NULL,
    media_url TEXT NOT NULL,
    client_or_brand TEXT,
    description TEXT,
    tags TEXT,
    aspect_ratio TEXT DEFAULT '1:1',
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 90,
    focus TEXT,
    icon TEXT,
    details TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS expertise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    summary TEXT NOT NULL,
    details TEXT,
    tags TEXT,
    tools TEXT,
    coursework TEXT,
    deliverables TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    added_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
}

// Seed default initial tables if database is connected
if (db) {
  // Seed default initial admins if table is empty
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
if (adminCount.count === 0) {
  const insertAdmin = db.prepare('INSERT OR IGNORE INTO admins (email, role, added_by) VALUES (?, ?, ?)');
  insertAdmin.run('rajahuzaifa015166@gmail.com', 'admin', 'system');
  insertAdmin.run('munazza.00077@gmail.com', 'admin', 'system');
  insertAdmin.run('aliraza1122alikhan@gmail.com', 'admin', 'system');
}

// Seed default initial skills if table is empty
const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number };
if (skillCount.count === 0) {
  const insertSkill = db.prepare(`
    INSERT INTO skills (name, category, proficiency, focus, icon, details, sort_order)
    VALUES (@name, @category, @proficiency, @focus, @icon, @details, @sort_order)
  `);

  const initialSkills = [
    {
      name: 'Canva Pro',
      category: 'design',
      proficiency: 95,
      focus: 'Social Media & Banners',
      icon: 'canva',
      details: 'Creates cohesive brand kits, Instagram carousels, retail sale posters, business stationery, and web hero banners with balanced typography and luxury aesthetics.',
      sort_order: 1,
    },
    {
      name: 'Adobe Photoshop',
      category: 'design',
      proficiency: 85,
      focus: 'Photo Composites & Flyers',
      icon: 'photoshop',
      details: 'Skilled in background removal, realistic shadow blending, commercial food/fashion poster retouching, tri-fold print flyers, and color-graded product mockups.',
      sort_order: 2,
    },
    {
      name: 'Adobe Premiere Pro',
      category: 'video',
      proficiency: 90,
      focus: 'Reels Pacing & Beat Sync',
      icon: 'premiere',
      details: 'Edits vertical 9:16 real estate drone reels, corporate progress films, multi-split screen layouts, smooth speed-ramping, and clean audio mixing.',
      sort_order: 3,
    },
    {
      name: 'CapCut Studio',
      category: 'video',
      proficiency: 92,
      focus: 'Viral Hooks & Urdu Captions',
      icon: 'capcut',
      details: 'Specializes in high-retention short-form pacing, bilingual Urdu/English animated subtitles, rhythmic sound FX, and engaging visual hooks for TikTok & Reels.',
      sort_order: 4,
    },
    {
      name: 'MS Word',
      category: 'office',
      proficiency: 95,
      focus: 'Contracts & Documentation',
      icon: 'word',
      details: 'Prepares formal business letters, structured academic reports, formatted office contracts, CV layouts, and proofread administrative documentation.',
      sort_order: 5,
    },
    {
      name: 'MS Excel',
      category: 'office',
      proficiency: 90,
      focus: 'Data Entry, Formulas & Tracking',
      icon: 'excel',
      details: 'Manages accurate data entry spreadsheets, inventory logs, attendance trackers, automated formulas, conditional formatting, and summary charts.',
      sort_order: 6,
    },
    {
      name: 'MS PowerPoint',
      category: 'office',
      proficiency: 92,
      focus: 'Pitch Decks & Presentations',
      icon: 'powerpoint',
      details: 'Designs clean corporate slide decks, academic visual briefings, animated transitions, and executive reports tailored for meetings and client pitches.',
      sort_order: 7,
    },
    {
      name: 'Windows OS & Hardware',
      category: 'it',
      proficiency: 90,
      focus: 'Setup, Troubleshooting & Drivers',
      icon: 'windows',
      details: 'Handles clean Windows installation, essential driver and software setup, printer/peripherals configuration, basic troubleshooting, and AI productivity workflows.',
      sort_order: 8,
    },
    {
      name: 'ChatGPT & Modern AI',
      category: 'it',
      proficiency: 88,
      focus: 'Prompt Engineering & Productivity',
      icon: 'chatgpt',
      details: 'Leverages modern generative AI models for accelerated document outlining, customer response drafting, automated summarization, and creative inspiration.',
      sort_order: 9,
    },
  ];

  for (const s of initialSkills) {
    insertSkill.run(s);
  }
}

// Seed default initial expertise competencies if table is empty
const expertiseCount = db.prepare('SELECT COUNT(*) as count FROM expertise').get() as { count: number };
if (expertiseCount.count === 0) {
  const insertExpertise = db.prepare(`
    INSERT INTO expertise (num, title, category, icon, summary, details, tags, tools, coursework, deliverables, sort_order)
    VALUES (@num, @title, @category, @icon, @summary, @details, @tags, @tools, @coursework, @deliverables, @sort_order)
  `);

  const initialExpertise = [
    {
      num: '01',
      title: 'MS Office Suite & Operations',
      category: 'office',
      icon: 'file-text',
      summary: 'Word, Excel, and PowerPoint for structured documents, data calculation sheets, reporting, and presentations.',
      details: 'Advanced proficiency across the core Microsoft Office productivity suite. Specializes in producing executive-ready formal contracts, administrative correspondence, automated mathematical models in Excel, and branded presentation slide decks. Experienced with table styling, mail merge, conditional formatting, pivot tables, and master slide templates.',
      tags: JSON.stringify(['MS Word', 'MS Excel', 'PowerPoint', 'Formulas', 'Templates']),
      tools: JSON.stringify(['word', 'excel', 'powerpoint']),
      coursework: 'Certified via 6-Month Intensive IT & Office Management Diploma with distinction in spreadsheet automation and document formatting.',
      deliverables: JSON.stringify([
        'Automated inventory and payroll calculation spreadsheets',
        'Executive corporate correspondence & standardized contracts',
        'Multi-slide branded visual pitch decks with custom animations',
        'Data cleansing, formula modeling, and conditional formatting'
      ]),
      sort_order: 1,
    },
    {
      num: '02',
      title: 'Graphic Design & Visual Branding',
      category: 'design',
      icon: 'palette',
      summary: 'Creating digital graphics, promotional flyers, posters, and social media visual assets with balanced composition.',
      details: 'Comprehensive graphic design capabilities focusing on commercial social media creatives, corporate stationery, promotional posters, and luxury brand identity. Skilled in color harmony, typography pairing, hierarchy, image background removal, realistic shadow blending, and print-ready prepress export.',
      tags: JSON.stringify(['Canva Pro', 'Photoshop', 'Branding', 'Social Media', 'Print Layout']),
      tools: JSON.stringify(['canva', 'photoshop', 'illustrator']),
      coursework: 'Practical creative modules encompassing 15+ simulated retail, hospitality, and educational client campaigns.',
      deliverables: JSON.stringify([
        'Cohesive social media feed carousels and promotional story kits',
        'High-resolution tri-fold brochures and event flyers',
        'Luxury stationery mockups and vector filigree emblems',
        'Commercial product photo retouching and background extraction'
      ]),
      sort_order: 2,
    },
    {
      num: '03',
      title: 'Short-Form Video Editing & Motion',
      category: 'video',
      icon: 'film',
      summary: 'High-retention short-form digital content creation with audio synchronization, beat-matched cuts, and animated captions.',
      details: 'Specializes in vertical 9:16 content optimization for Instagram Reels, TikTok, and YouTube Shorts. Skilled in kinetic pacing, drone reel color enhancement, multi-screen framing, bilingual Urdu/English subtitles, dynamic sound effects, and retention-focused visual hooks.',
      tags: JSON.stringify(['CapCut Studio', 'Premiere Pro', '9:16 Reels', 'Beat Sync', 'Urdu Captions']),
      tools: JSON.stringify(['premiere', 'capcut', 'filmora']),
      coursework: 'Real estate and construction progress video editing assignments featuring aerial drone cinematography.',
      deliverables: JSON.stringify([
        'High-energy real estate drone promotional reels',
        'Synchronized bilingual Urdu/English animated subtitles',
        'Seamless speed ramps, jump cuts, and beat-matched audio',
        'High-converting video hook curation and audio mixing'
      ]),
      sort_order: 3,
    },
    {
      num: '04',
      title: 'IT Support & Systems Diagnostics',
      category: 'it',
      icon: 'cpu',
      summary: 'Windows installation, drivers and software setup, peripheral configuration, hardware diagnostics, and routine troubleshooting.',
      details: 'Hands-on technical workstation administration. Experienced in clean Windows 10/11 operating system deployments, device driver configuration, registry optimizations, peripheral setup (printers, scanners, dual monitors), malware removal, and office network troubleshooting.',
      tags: JSON.stringify(['Windows OS', 'Hardware Setup', 'Driver Config', 'Diagnostics', 'System Recovery']),
      tools: JSON.stringify(['windows', 'hardware', 'diagnostics']),
      coursework: 'Hardware laboratory hands-on training including complete PC assembly, disk partitioning, and OS recovery.',
      deliverables: JSON.stringify([
        'Clean OS installation, disk partitioning, and UEFI/BIOS setup',
        'Office workstation peripheral and printer network configuration',
        'Hardware diagnostics, driver conflicts resolution, and system recovery',
        'Data backup protocols and preventive maintenance routines'
      ]),
      sort_order: 4,
    },
    {
      num: '05',
      title: 'Internet Research & Academic Data Mining',
      category: 'research',
      icon: 'globe',
      summary: 'Advanced web browsing, systematic online data gathering, academic research compilation, and digital correspondence.',
      details: 'Leveraging structured research methodologies to synthesize complex information across academic databases, competitive industry landscapes, and digital directories. Paired with BS English linguistics training for rigorous critical analysis and articulated executive briefings.',
      tags: JSON.stringify(['Data Mining', 'Academic Search', 'Information Retrieval', 'Fact Checking']),
      tools: JSON.stringify(['chatgpt', 'claude']),
      coursework: 'Linguistic discourse analysis and academic literature reviews as part of ongoing BS English degree.',
      deliverables: JSON.stringify([
        'Comprehensive competitive market analysis and directory mining',
        'Structured academic bibliography and literature summarization',
        'Executive briefing memos and formal business correspondence',
        'Validated contact database curation and lead extraction'
      ]),
      sort_order: 5,
    },
    {
      num: '06',
      title: 'Online Collaboration & Virtual Operations',
      category: 'collaboration',
      icon: 'users',
      summary: 'Managing meetings, real-time screen sharing, cloud drive organization, and collaborative workspace communication.',
      details: 'Coordinating hybrid and remote operational workflows using contemporary cloud collaboration tools. Expert in scheduling multi-party video conferences, moderating screen shares, managing Google Workspace / Microsoft 365 cloud directory architectures, and maintaining seamless team communications.',
      tags: JSON.stringify(['Zoom', 'Google Workspace', 'MS Teams', 'Cloud Drive', 'Remote Workflows']),
      tools: JSON.stringify(['zoom', 'googleworkspace']),
      coursework: 'Office simulation training managing virtual calendars, meetings, and shared repository permissions.',
      deliverables: JSON.stringify([
        'Meeting agenda preparation, scheduling, and live minute recording',
        'Structured Google Drive / OneDrive folder hierarchies and access control',
        'Remote team onboarding documentation and virtual desk assistance',
        'Cross-channel collaborative correspondence and follow-ups'
      ]),
      sort_order: 6,
    },
    {
      num: '07',
      title: 'AI Fundamentals & Productivity Workflows',
      category: 'ai',
      icon: 'brain',
      summary: 'Modern AI engines, prompt engineering for document drafting, data structuring, creative ideation, and workflow acceleration.',
      details: 'Applying cutting-edge generative AI models (ChatGPT, Claude, Gemini) to augment daily office productivity. Specializes in crafting precise multi-turn prompts for rapid content drafting, spreadsheet formula generation, customer reply curation, and workflow automation.',
      tags: JSON.stringify(['Prompt Engineering', 'ChatGPT', 'Claude', 'Workflow Acceleration', 'Automation']),
      tools: JSON.stringify(['chatgpt', 'claude']),
      coursework: 'Independent AI productivity experimentation applied directly to academic linguistic tasks and design workflows.',
      deliverables: JSON.stringify([
        'Custom multi-step prompt templates for corporate documentation',
        'Rapid copywriting, summarization, and email reply generation',
        'Complex Excel formula generation and debugging via prompt models',
        'Creative ideation and visual brief structuring for design assets'
      ]),
      sort_order: 7,
    },
  ];

  for (const exp of initialExpertise) {
    insertExpertise.run(exp);
  }
}


// Seed default initial projects if table is empty
const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };

if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (
      slug, title, category, media_type, media_url, client_or_brand,
      description, tags, aspect_ratio, likes_count, views_count, featured, sort_order
    ) VALUES (
      @slug, @title, @category, @media_type, @media_url, @client_or_brand,
      @description, @tags, @aspect_ratio, @likes_count, @views_count, @featured, @sort_order
    )
  `);

  const initialProjects = [
    // Video Reels (6)
    {
      slug: 'capital-smart-city-1-kanal-villas',
      title: 'Capital Smart City 1-Kanal Luxury Villas Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
      client_or_brand: 'Capital Smart City Islamabad',
      description: 'High-energy vertical drone reel featuring Sector B Overseas East villas with kinetic typography, modern audio sync, and architectural cinematography.',
      tags: JSON.stringify(['Drone Reel', 'Real Estate', 'Kinetic Typography', 'Premiere Pro', '4K Drone']),
      aspect_ratio: '9:16',
      likes_count: 52,
      views_count: 740,
      featured: 1,
      sort_order: 1,
    },
    {
      slug: 'eastern-housing-structural-construction',
      title: 'Structural Foundation & Machinery Action Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Building_Foundation___Structural_Construction_a1ca3da9.mp4',
      client_or_brand: 'Eastern Housing Lahore',
      description: 'Industrial pacing montage highlighting steel cutting, crane lifts, and worker dedication with punchy percussion audio and cinematic color grading.',
      tags: JSON.stringify(['Industrial', 'Action Cuts', 'Sound Design', 'Commercial Reel']),
      aspect_ratio: '9:16',
      likes_count: 44,
      views_count: 610,
      featured: 1,
      sort_order: 2,
    },
    {
      slug: 'educational-engineering-mathematics',
      title: 'The Philosophy of Mathematics & Thinking Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Educational-Engineering_6a9cf9c0.mp4',
      client_or_brand: 'Educational Engineering',
      description: 'Thought-provoking educational short reel combining Urdu subtitles, Einstein quotes, neural network animations, and b-roll transitions.',
      tags: JSON.stringify(['Educational', 'Urdu Typography', 'Subtitles', 'Motion Graphics']),
      aspect_ratio: '9:16',
      likes_count: 78,
      views_count: 980,
      featured: 1,
      sort_order: 3,
    },
    {
      slug: 'study-trick-brain-alert-mode',
      title: 'Study Trick Ep-42: Brain Focus & Memory Hack',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Learning_tricks_d3944f13.mp4',
      client_or_brand: 'The Aspirex',
      description: 'Viral high-retention educational reel using dark anime aesthetics, countdown graphics, step-by-step Urdu voiceover, and pacing.',
      tags: JSON.stringify(['Viral Short', 'Voiceover Timing', 'Anime Graphics', 'Study Hack']),
      aspect_ratio: '9:16',
      likes_count: 112,
      views_count: 1420,
      featured: 1,
      sort_order: 4,
    },
    {
      slug: 'eastern-housing-corporate-construction',
      title: 'Eastern Housing Corporate Progress & Quality Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/On-Site_Building_Construction_Progress_9f6d1756.mp4',
      client_or_brand: 'Eastern Housing Lahore',
      description: 'Full narrative commercial reel highlighting QA engineering team inspection, resident testimonials, and brand identity animations.',
      tags: JSON.stringify(['Corporate Film', 'Urdu Voiceover', 'Resident Testimonial', 'Drone']),
      aspect_ratio: '9:16',
      likes_count: 63,
      views_count: 890,
      featured: 0,
      sort_order: 5,
    },
    {
      slug: 'capital-smart-city-split-screen',
      title: 'Capital Smart City 3-Split Architectural Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Real_Estate_Showcase_1dc50f40.mp4',
      client_or_brand: 'Capital Smart City',
      description: 'Multi-layer 3-way split screen visual showcasing Lake View Heights, Linear Park, and Sports Complex in synchronized harmony.',
      tags: JSON.stringify(['Split Screen', 'Creative Layout', 'Real Estate', 'Branding']),
      aspect_ratio: '9:16',
      likes_count: 85,
      views_count: 1100,
      featured: 1,
      sort_order: 6,
    },

    // Graphic Design Assets (15)
    {
      slug: 'burger-lab-instagram-post',
      title: 'Burger Lab 30% Off Social Media Campaign',
      category: 'social',
      media_type: 'image',
      media_url: '/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png',
      client_or_brand: 'Burger Lab',
      description: 'Mouthwatering commercial social media post with dynamic curved framing, floating tomatoes, layered typography, and high-conversion call to action.',
      tags: JSON.stringify(['Social Media', 'Food Design', 'Canva', 'Photoshop', 'Instagram']),
      aspect_ratio: '1:1',
      likes_count: 69,
      views_count: 810,
      featured: 1,
      sort_order: 7,
    },
    {
      slug: 'munazza-irfan-luxury-business-card',
      title: 'Executive Head Manager Black Silk Card',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_Card__2__40af2b3d.png',
      client_or_brand: 'Munazza Irfan Portfolio',
      description: 'Luxury corporate business card concept designed for executive positioning with metallic gold typography on pure black folded silk texture.',
      tags: JSON.stringify(['Business Card', 'Luxury Gold', 'Silk Texture', 'Corporate Identity']),
      aspect_ratio: '16:9',
      likes_count: 95,
      views_count: 1180,
      featured: 1,
      sort_order: 8,
    },
    {
      slug: 'juniper-street-cafe-business-card',
      title: 'Juniper Street Café Botanical Stationery',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_Card_a1f870ac.jpg',
      client_or_brand: 'Juniper Street Café',
      description: 'Organic cafe identity stationery card mockup pairing terracotta warmth with deep eucalyptus green botanical illustrations.',
      tags: JSON.stringify(['Cafe Branding', 'Botanical', 'Stationery Mockup', 'Earth Tones']),
      aspect_ratio: '1:1',
      likes_count: 51,
      views_count: 640,
      featured: 0,
      sort_order: 9,
    },
    {
      slug: 'helping-businesses-work-smarter-card',
      title: 'Helping Businesses Work Smarter Brand Identity',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_card_b53b857b.png',
      client_or_brand: 'Munazza Irfan',
      description: 'Sophisticated brand card featuring custom gold geometric mandala mark and client-focused brand motto on dark satin.',
      tags: JSON.stringify(['Brand Identity', 'Gold Emblem', 'Luxury Fabric', 'Minimalist']),
      aspect_ratio: '16:9',
      likes_count: 73,
      views_count: 890,
      featured: 1,
      sort_order: 10,
    },
    {
      slug: 'digital-marketing-agency-flyer',
      title: 'Digital Marketing Agency Tri-Fold Flyer',
      category: 'flyer',
      media_type: 'image',
      media_url: '/assets/aistudio/Flyer_b12b5985.jpg',
      client_or_brand: 'Digital Marketing Agency',
      description: 'Clean modern corporate marketing flyer featuring canary yellow swooshes, structured business concept sections, and vector iconography.',
      tags: JSON.stringify(['Flyer', 'Corporate Marketing', 'Print Design', 'Infographic']),
      aspect_ratio: '3:4',
      likes_count: 58,
      views_count: 720,
      featured: 0,
      sort_order: 11,
    },
    {
      slug: 'pizza-house-grand-opening-flyer',
      title: 'Pizza House Pallandri Grand Opening Flyer',
      category: 'flyer',
      media_type: 'image',
      media_url: '/assets/aistudio/Flyer_9744df9f.png',
      client_or_brand: 'Pizza House Pallandri',
      description: 'Vibrant local community announcement flyer highlighting menu specials, 30% discount promotion, and location details in Pallandri.',
      tags: JSON.stringify(['Local Business', 'Restaurant Flyer', 'Grand Opening', 'Discount Promo']),
      aspect_ratio: '1:1',
      likes_count: 42,
      views_count: 530,
      featured: 0,
      sort_order: 12,
    },
    {
      slug: 'boutique-vintage-crest-logo',
      title: 'A Boutique Vintage Fashion Filigree Crest',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo__2__63103627.jpg',
      client_or_brand: 'A Boutique Vintage',
      description: 'Victorian baroque-inspired emblem monogram with ornamental scrollwork for luxury vintage apparel and fashion accessories.',
      tags: JSON.stringify(['Logo Design', 'Vintage Monogram', 'Luxury Brand', 'Ornate Crest']),
      aspect_ratio: '1:1',
      likes_count: 76,
      views_count: 940,
      featured: 1,
      sort_order: 13,
    },
    {
      slug: 'anna-fashion-store-logo',
      title: 'Anna Fashion Store Botanical Circle Logo',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo_12077448.jpg',
      client_or_brand: 'Anna Fashion Store',
      description: 'Earthy minimalist fashion boutique mark using serif typography and subtle hand-drawn olive branch flourishes.',
      tags: JSON.stringify(['Logo Design', 'Fashion Brand', 'Botanical Line Art', 'Earth Tones']),
      aspect_ratio: '1:1',
      likes_count: 64,
      views_count: 780,
      featured: 0,
      sort_order: 14,
    },
    {
      slug: 'building-construction-architectural-logo',
      title: 'Building Construction Modern Skyline Logo',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo_5a797adc.png',
      client_or_brand: 'Building Construction Co.',
      description: 'Geometric corporate identity mark featuring bold cobalt and steel grey skyscraper towers and drafted angle lines.',
      tags: JSON.stringify(['Logo Design', 'Construction', 'Architecture', 'Corporate']),
      aspect_ratio: '1:1',
      likes_count: 50,
      views_count: 610,
      featured: 0,
      sort_order: 15,
    },
    {
      slug: 'pizza-shop-slice-emblem-logo',
      title: 'Pizza Shop Bold Mascot Emblem',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Pizza_Logo_4039f311.png',
      client_or_brand: 'Pizza Shop',
      description: 'High-contrast red and golden yellow graphic pizza slice logo with bold serif title badge for casual dining.',
      tags: JSON.stringify(['Logo Design', 'Vector Illustration', 'Food Brand', 'Color Blocking']),
      aspect_ratio: '1:1',
      likes_count: 40,
      views_count: 480,
      featured: 0,
      sort_order: 16,
    },
    {
      slug: 'mega-fashion-sale-poster',
      title: 'Mega Fashion Sale Upto 50% Off Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Poster_867920d9.png',
      client_or_brand: 'Mega Fashion Store',
      description: 'High-fashion editorial retail campaign poster featuring model photography framed by vibrant gradient sunburst bars on dark canvas.',
      tags: JSON.stringify(['Fashion Poster', 'Retail Promo', 'Commercial', 'Canva Pro']),
      aspect_ratio: '1:1',
      likes_count: 81,
      views_count: 1040,
      featured: 1,
      sort_order: 17,
    },
    {
      slug: 'globex-solutions-corporate-banner',
      title: 'Globex Solutions Future Tech Web Banner',
      category: 'banner',
      media_type: 'image',
      media_url: '/assets/aistudio/Website_Banner_53c790d7.png',
      client_or_brand: 'Globex Solutions',
      description: 'Full-width digital web banner highlighting holographic smart city interfaces, corporate strategy badges, and vibrant cobalt waves.',
      tags: JSON.stringify(['Website Banner', 'Holographic', 'Corporate Tech', 'Digital Marketing']),
      aspect_ratio: '16:9',
      likes_count: 67,
      views_count: 860,
      featured: 1,
      sort_order: 18,
    },
    {
      slug: 'al-jannat-summer-lawn-promo',
      title: 'Al-Jannat Summer Lawn 30% Off Social Post',
      category: 'social',
      media_type: 'image',
      media_url: '/assets/aistudio/Social_Media_Post_67ffe2bd.png',
      client_or_brand: 'Al-Jannat Collection',
      description: 'Refined Pakistani summer lawn fashion collection post featuring pastel floral photography, bold price badge, and boutique styling.',
      tags: JSON.stringify(['Social Media', 'Pakistani Fashion', 'Summer Lawn', 'Instagram Banner']),
      aspect_ratio: '1:1',
      likes_count: 62,
      views_count: 770,
      featured: 0,
      sort_order: 19,
    },
    {
      slug: 'super-delicious-food-burger-poster',
      title: 'Super Delicious Food Menu Burger Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Burger_Poster_268dceeb.png',
      client_or_brand: 'Burger Junction',
      description: 'Eye-catching split-backdrop food poster with realistic wood grain picnic table and speech bubble discount badges.',
      tags: JSON.stringify(['Food Poster', 'Photoshop Composite', 'Retail', 'Fast Food']),
      aspect_ratio: '1:1',
      likes_count: 55,
      views_count: 680,
      featured: 0,
      sort_order: 20,
    },
    {
      slug: 'codemind-university-admission-poster',
      title: 'CodeMind University Open Admission Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Admissions_University_Poster_a1db8ec5.png',
      client_or_brand: 'CodeMind University',
      description: 'Professional academic admissions campaign poster featuring student photography, rounded violet glass card, and clean contact credentials.',
      tags: JSON.stringify(['University Poster', 'Admissions', 'Academic Branding', 'Print Ready']),
      aspect_ratio: '3:4',
      likes_count: 91,
      views_count: 1190,
      featured: 1,
      sort_order: 21,
    },
  ];

  const seedTransaction = db.transaction((projects: any[]) => {
    for (const project of projects) {
      insertProject.run(project);
    }
  });

  seedTransaction(initialProjects);

  // Seed some initial testimonials
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (author, role, company, quote, rating)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertTestimonial.run(
    'Khurram Shahzad',
    'Marketing Lead',
    'Eastern Housing Lahore',
    'Munazza has a strong eye for video pacing and construction footage. Her reels captured our site development with impressive rhythm and clarity.',
    5
  );
  insertTestimonial.run(
    'Taimoor Ahmed',
    'Operations Director',
    'Globex Solutions',
    'Outstanding work on our corporate banners and MS Office presentations. Extremely punctual, detail-oriented, and receptive to feedback.',
    5
  );
  insertTestimonial.run(
    'Zainab Malik',
    'Brand Owner',
    'Al-Jannat Collection',
    'Her social media posts and summer lawn graphics helped elevate our online engagement. Highly recommended for creative design.',
    5
  );
  }
}

// REST API Security & Authorization Middleware
const DESIGNATED_SUPER_ADMINS = [
  'munazza.00077@gmail.com',
  'rajahuzaifa015166@gmail.com',
  'aliraza1122alikhan@gmail.com',
];

const requireAdminAuth = (req: Request, res: Response, next: () => void) => {
  const adminEmailHeader = req.headers['x-admin-email'];
  const authHeader = req.headers['authorization'];
  const adminSecretKey = process.env.ADMIN_SECRET_KEY;
  const providedSecret = req.headers['x-admin-secret'];

  // Check master secret key bypass if configured in environment
  if (adminSecretKey && providedSecret === adminSecretKey) {
    return next();
  }

  let candidateEmail = '';
  if (typeof adminEmailHeader === 'string' && adminEmailHeader.trim()) {
    candidateEmail = adminEmailHeader.trim().toLowerCase();
  } else if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    candidateEmail = authHeader.replace('Bearer ', '').trim().toLowerCase();
  }

  if (!candidateEmail) {
    return res.status(401).json({
      error: 'Unauthorized: Administrative credentials required. Please provide a valid x-admin-email header.',
    });
  }

  // Check if email belongs to designated super admins
  if (DESIGNATED_SUPER_ADMINS.includes(candidateEmail)) {
    return next();
  }

  // Check SQLite admins table
  try {
    const adminRecord = db
      .prepare('SELECT email, role FROM admins WHERE LOWER(email) = ?')
      .get(candidateEmail) as { email: string; role: string } | undefined;

    if (adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'superadmin')) {
      return next();
    }
  } catch (err) {
    console.error('Error validating admin credentials against SQLite:', err);
  }

  return res.status(403).json({
    error: 'Forbidden: The provided account is not registered as an authorized administrator.',
  });
};

// REST API Endpoints

// GET /api/stats
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    const videoReels = db.prepare("SELECT COUNT(*) as count FROM projects WHERE media_type = 'video'").get() as { count: number };
    const graphicDesigns = db.prepare("SELECT COUNT(*) as count FROM projects WHERE media_type = 'image'").get() as { count: number };
    const likesAndViews = db.prepare('SELECT SUM(likes_count) as total_likes, SUM(views_count) as total_views FROM projects').get() as { total_likes: number; total_views: number };
    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as { count: number };

    res.json({
      totalProjects: totalProjects.count,
      videoReels: videoReels.count,
      graphicDesigns: graphicDesigns.count,
      totalLikes: likesAndViews.total_likes || 0,
      totalViews: likesAndViews.total_views || 0,
      totalInquiries: totalInquiries.count,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/projects
app.get('/api/projects', (req: Request, res: Response) => {
  try {
    const { category, type, search } = req.query;
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (type && type !== 'all') {
      query += ' AND media_type = ?';
      params.push(type);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ? OR client_or_brand LIKE ? OR tags LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY featured DESC, sort_order ASC, id ASC';

    const rows = db.prepare(query).all(...params) as any[];
    const parsed = rows.map((r) => ({
      ...r,
      featured: Boolean(r.featured),
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req: Request, res: Response) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as any;
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const comments = db.prepare('SELECT * FROM project_comments WHERE project_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({
      ...project,
      featured: Boolean(project.featured),
      tags: project.tags ? JSON.parse(project.tags) : [],
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/like
app.post('/api/projects/:id/like', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('UPDATE projects SET likes_count = likes_count + 1 WHERE id = ?');
    stmt.run(req.params.id);

    const updated = db.prepare('SELECT likes_count FROM projects WHERE id = ?').get(req.params.id) as { likes_count: number };
    res.json({ success: true, likes_count: updated.likes_count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/views
app.post('/api/projects/:id/views', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('UPDATE projects SET views_count = views_count + 1 WHERE id = ?');
    stmt.run(req.params.id);

    const updated = db.prepare('SELECT views_count FROM projects WHERE id = ?').get(req.params.id) as { views_count: number };
    res.json({ success: true, views_count: updated.views_count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/comments
app.post('/api/projects/:id/comments', (req: Request, res: Response) => {
  try {
    const { author_name, comment, rating } = req.body;
    if (!author_name || !comment) {
      return res.status(400).json({ error: 'Author name and comment are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO project_comments (project_id, author_name, comment, rating)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(req.params.id, author_name.trim(), comment.trim(), Number(rating) || 5);

    const created = db.prepare('SELECT * FROM project_comments WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/testimonials
app.get('/api/testimonials', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/testimonials (Protected Admin API)
app.post('/api/testimonials', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { author, role, company, quote, rating } = req.body;
    if (!author || !quote) {
      return res.status(400).json({ error: 'Author and quote are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO testimonials (author, role, company, quote, rating)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      author.trim(),
      (role || 'Client').trim(),
      (company || 'Company').trim(),
      quote.trim(),
      Number(rating) || 5
    );

    const created = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/testimonials/:id (Protected Admin API)
app.delete('/api/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const target = req.params.id;
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(target);
    res.json({ success: true, changes: result.changes });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/inquiries (Protected Admin API - Client Inquiries & Contact Details)
app.get('/api/inquiries', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/inquiries (Public Contact Form with Input Sanitization & Protection)
app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, budget, timeline, message } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Valid name is required' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Input bounds sanitization
    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 120);
    const cleanPhone = (phone ? String(phone).trim() : '').slice(0, 50);
    const cleanService = (service ? String(service).trim() : 'General Inquiry').slice(0, 100);
    const cleanBudget = (budget ? String(budget).trim() : '').slice(0, 50);
    const cleanTimeline = (timeline ? String(timeline).trim() : '').slice(0, 50);
    const cleanMessage = message.trim().slice(0, 5000);

    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, phone, service, budget, timeline, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      cleanName,
      cleanEmail,
      cleanPhone,
      cleanService,
      cleanBudget,
      cleanTimeline,
      cleanMessage
    );

    const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, inquiry: created });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/inquiries/:id (Protected Admin API)
app.patch('/api/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/inquiries/:id (Protected Admin API)
app.delete('/api/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects (Protected Admin API - Create project)
app.post('/api/projects', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, category, media_type, media_url, client_or_brand, description, tags, aspect_ratio, featured, sort_order } = req.body;
    if (!title || !media_url) {
      return res.status(400).json({ error: 'Title and media_url are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const stmt = db.prepare(`
      INSERT INTO projects (slug, title, category, media_type, media_url, client_or_brand, description, tags, aspect_ratio, featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      slug,
      title.trim(),
      category || 'branding',
      media_type || 'image',
      media_url.trim(),
      (client_or_brand || '').trim(),
      (description || '').trim(),
      JSON.stringify(Array.isArray(tags) ? tags : []),
      aspect_ratio || '1:1',
      featured ? 1 : 0,
      Number(sort_order) || 0
    );

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid) as any;
    res.status(201).json({
      ...created,
      featured: Boolean(created.featured),
      tags: created.tags ? JSON.parse(created.tags) : [],
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/projects/:id (Protected Admin API - Update project)
app.put('/api/projects/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const target = req.params.id;
    const existing = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(target, target) as any;
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { title, category, media_type, media_url, client_or_brand, description, tags, aspect_ratio, featured, sort_order } = req.body;

    const updatedTitle = title !== undefined ? String(title).trim() : existing.title;
    const updatedCategory = category !== undefined ? String(category) : existing.category;
    const updatedMediaType = media_type !== undefined ? String(media_type) : existing.media_type;
    const updatedMediaUrl = media_url !== undefined ? String(media_url).trim() : existing.media_url;
    const updatedClient = client_or_brand !== undefined ? String(client_or_brand).trim() : existing.client_or_brand;
    const updatedDesc = description !== undefined ? String(description).trim() : existing.description;
    const updatedTags = tags !== undefined ? (Array.isArray(tags) ? JSON.stringify(tags) : String(tags)) : existing.tags;
    const updatedRatio = aspect_ratio !== undefined ? String(aspect_ratio) : existing.aspect_ratio;
    const updatedFeatured = featured !== undefined ? (featured ? 1 : 0) : existing.featured;
    const updatedSortOrder = sort_order !== undefined ? Number(sort_order) : existing.sort_order;

    db.prepare(`
      UPDATE projects
      SET title = ?, category = ?, media_type = ?, media_url = ?, client_or_brand = ?,
          description = ?, tags = ?, aspect_ratio = ?, featured = ?, sort_order = ?
      WHERE id = ?
    `).run(
      updatedTitle,
      updatedCategory,
      updatedMediaType,
      updatedMediaUrl,
      updatedClient,
      updatedDesc,
      updatedTags,
      updatedRatio,
      updatedFeatured,
      updatedSortOrder,
      existing.id
    );

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(existing.id) as any;
    res.json({
      ...updated,
      featured: Boolean(updated.featured),
      tags: updated.tags ? JSON.parse(updated.tags) : [],
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/projects/:id (Protected Admin API - Delete project)
app.delete('/api/projects/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const target = req.params.id;
    const result = db.prepare('DELETE FROM projects WHERE id = ? OR slug = ?').run(target, target);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, changes: result.changes });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/skills
app.get('/api/skills', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/skills (Protected Admin API)
app.post('/api/skills', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, category, proficiency, focus, icon, details, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO skills (name, category, proficiency, focus, icon, details, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      name.trim(),
      category || 'design',
      Number(proficiency) || 90,
      (focus || '').trim(),
      (icon || 'canva').trim(),
      (details || '').trim(),
      Number(sort_order) || 0
    );

    const created = db.prepare('SELECT * FROM skills WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/skills/:id (Protected Admin API)
app.put('/api/skills/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, category, proficiency, focus, icon, details } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    db.prepare(`
      UPDATE skills
      SET name = ?, category = ?, proficiency = ?, focus = ?, icon = ?, details = ?
      WHERE id = ?
    `).run(
      name.trim(),
      category || 'design',
      Number(proficiency) || 90,
      (focus || '').trim(),
      (icon || 'canva').trim(),
      (details || '').trim(),
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM skills WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/skills/:id (Protected Admin API)
app.delete('/api/skills/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

function parseExpertiseRow(row: any) {
  if (!row) return null;
  const safeParse = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return String(val).split(',').map((s) => s.trim()).filter(Boolean);
    }
  };

  return {
    ...row,
    tags: safeParse(row.tags),
    tools: safeParse(row.tools),
    deliverables: safeParse(row.deliverables),
  };
}

// GET /api/expertise (Public)
app.get('/api/expertise', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM expertise ORDER BY sort_order ASC, id ASC').all();
    res.json(rows.map(parseExpertiseRow));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/expertise (Protected Admin API)
app.post('/api/expertise', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { num, title, category, icon, summary, details, tags, tools, coursework, deliverables, sort_order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const stmt = db.prepare(`
      INSERT INTO expertise (num, title, category, icon, summary, details, tags, tools, coursework, deliverables, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stringifyArray = (val: any) => {
      if (!val) return JSON.stringify([]);
      if (Array.isArray(val)) return JSON.stringify(val);
      if (typeof val === 'string') {
        if (val.startsWith('[')) return val;
        return JSON.stringify(val.split(',').map((s) => s.trim()).filter(Boolean));
      }
      return JSON.stringify([]);
    };

    const info = stmt.run(
      (num || '').trim(),
      title.trim(),
      category || 'office',
      (icon || 'file-text').trim(),
      (summary || '').trim(),
      (details || '').trim(),
      stringifyArray(tags),
      stringifyArray(tools),
      (coursework || '').trim(),
      stringifyArray(deliverables),
      Number(sort_order) || 0
    );

    const created = db.prepare('SELECT * FROM expertise WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(parseExpertiseRow(created));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/expertise/:id (Protected Admin API)
app.put('/api/expertise/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { num, title, category, icon, summary, details, tags, tools, coursework, deliverables, sort_order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const stringifyArray = (val: any) => {
      if (!val) return JSON.stringify([]);
      if (Array.isArray(val)) return JSON.stringify(val);
      if (typeof val === 'string') {
        if (val.startsWith('[')) return val;
        return JSON.stringify(val.split(',').map((s) => s.trim()).filter(Boolean));
      }
      return JSON.stringify([]);
    };

    db.prepare(`
      UPDATE expertise
      SET num = ?, title = ?, category = ?, icon = ?, summary = ?, details = ?, tags = ?, tools = ?, coursework = ?, deliverables = ?, sort_order = ?
      WHERE id = ?
    `).run(
      (num || '').trim(),
      title.trim(),
      category || 'office',
      (icon || 'file-text').trim(),
      (summary || '').trim(),
      (details || '').trim(),
      stringifyArray(tags),
      stringifyArray(tools),
      (coursework || '').trim(),
      stringifyArray(deliverables),
      Number(sort_order) || 0,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM expertise WHERE id = ?').get(req.params.id);
    res.json(parseExpertiseRow(updated));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/expertise/:id (Protected Admin API)
app.delete('/api/expertise/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM expertise WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/admins/verify (Public verification endpoint - checks admin status without leaking list)
app.get('/api/admins/verify', (req: Request, res: Response) => {
  try {
    const emailParam = (req.query.email as string || '').toLowerCase().trim();
    if (!emailParam) {
      return res.json({ isAdmin: false });
    }
    if (DESIGNATED_SUPER_ADMINS.includes(emailParam)) {
      return res.json({ isAdmin: true, role: 'superadmin' });
    }
    const row = db.prepare('SELECT role FROM admins WHERE LOWER(email) = ?').get(emailParam) as { role: string } | undefined;
    if (row && (row.role === 'admin' || row.role === 'superadmin')) {
      return res.json({ isAdmin: true, role: row.role });
    }
    return res.json({ isAdmin: false });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/admins (Protected Admin API - Lists all active studio administrators)
app.get('/api/admins', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT id, email, role, added_by, created_at FROM admins ORDER BY id ASC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/admins (Protected Admin API - Add or update an admin)
app.post('/api/admins', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { email, role = 'admin', added_by = 'admin' } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    const normalized = email.toLowerCase().trim();
    const stmt = db.prepare(
      'INSERT INTO admins (email, role, added_by) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET role = excluded.role'
    );
    const result = stmt.run(normalized, role, added_by);
    res.status(201).json({ id: result.lastInsertRowid, email: normalized, role, added_by });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/admins/:id (Protected Admin API - Revoke an admin)
app.delete('/api/admins/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const target = req.params.id;
    if (isNaN(Number(target))) {
      db.prepare('DELETE FROM admins WHERE LOWER(email) = ?').run(target.toLowerCase().trim());
    } else {
      db.prepare('DELETE FROM admins WHERE id = ? OR LOWER(email) = ?').run(target, target.toLowerCase().trim());
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// Serve static assets from public
app.use(express.static(path.join(__dirname, 'public')));

// Mount Vite or static build
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export Express app for Vercel Serverless Functions
export { app };
export default app;

// Only start HTTP listener when running as a standalone server (not inside Vercel serverless)
if (!process.env.VERCEL) {
  setupServer();
}
