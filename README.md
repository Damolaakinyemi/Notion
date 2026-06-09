# Notion

Notion
Inventory management, reimagined.
Track items, manage vendors, and streamline operations — all from one powerful dashboard.
What is Notion
Operations teams waste 10+ hours per week wrestling with spreadsheets, email chains, and scattered vendor communications. Notion replaces all of that with a single, powerful dashboard.
Upload a messy spreadsheet → our smart engine auto-detects columns and statuses → track everything in real time → compose and actually send emails to vendors → export reports — all from one screen.
This is not a tutorial project. It's a full-stack production app with authentication, a Postgres database, cloud sync, real email delivery, and a polished landing page — all running from a single HTML file with zero build tools.
Live Demo
👉 [notion-sage-mu.vercel.app](https://notion-sage-mu.vercel.app/)
Create an account, upload a spreadsheet, and start managing inventory in under 2 minutes.
Features
Category	Feature	Description
📊	**Real-Time Dashboard**	Live metrics, vendor progress bars, overdue alerts, stale item detection
🔍	**Smart Search**	Instant search across all fields with yellow highlighting on matches
📧	**Email Composer**	Queue emails, pick templates, preview, and send **real emails** via EmailJS
📧	**Bulk Email**	Group emails by vendor and send in bulk with one click
☁️	**Cloud Sync**	Auto-syncs to Supabase Postgres every 2 seconds
🔐	**Authentication**	Full sign up / sign in / email confirmation / logout via Supabase Auth
🔒	**Row-Level Security**	Each user only sees their own data — enforced at the database level
🌙	**Dark Mode**	Beautiful dark theme with 115+ CSS overrides, preference persisted
📄	**Pagination**	10 / 25 / 50 / 100 items per page with full navigation controls
↩️	**Undo / Redo**	Ctrl+Z / Ctrl+Y with 30-step history and UI buttons with step counter
🧠	**Smart Auto-Detection**	14 keyword lists auto-map columns from any spreadsheet format
📁	**Multi-Format Import**	CSV, XLSX, XLS, JSON, TXT, TSV — drag and drop or file picker
📤	**Export**	CSV data export + formatted HTML summary reports
📇	**Vendor Directory**	Persistent vendor database with auto-scan and auto-fill
💾	**Auto-Save**	Saves to localStorage every 2 seconds — you never lose work
🎓	**Onboarding Tour**	Interactive 7-step tutorial for first-time users
📱	**Responsive Design**	Works on desktop, tablet, and mobile
⚡	**Zero-Build Architecture**	Entire app runs from a single HTML file — no webpack, no npm, no build step

Tech Stack
Layer	Technology	Purpose
**Frontend**	React 18 + JSX	Component-based UI with 40+ state variables
**Styling**	Tailwind CSS (CDN)	Utility-first responsive design
**Transpilation**	Babel (in-browser)	JSX → JavaScript without a build step
**Backend**	Supabase (Postgres)	Cloud database with Row-Level Security
**Auth**	Supabase Auth	Email/password authentication with confirmation
**Email**	EmailJS	Real email delivery from the browser
**Spreadsheets**	SheetJS (XLSX)	Parse Excel/CSV files client-side
**Hosting**	Vercel	Zero-config deployment from GitHub
**Architecture**	Single HTML file	~115KB, zero dependencies, zero build tools

Architecture
This is where it gets interesting.
┌─────────────────────────────────────────────────┐
│                 index.html (~115KB)               │
│                                                   │
│  ┌─── CSS ───┐  ┌──── React App ────┐           │
│  │ Tailwind   │  │ 4 Components      │           │
│  │ Dark Mode  │  │ 40+ useState      │           │
│  │ Pagination │  │ 9 useMemo         │           │
│  │ Auth UI    │  │ 6 useEffect       │           │
│  │ Animations │  │ 6 Tabs/Views      │           │
│  └────────────┘  │ 7 Modals          │           │
│                  │ 14 Auto-Detect     │           │
│                  │    Keyword Lists   │           │
│                  └────────────────────┘           │
│                         │                         │
│           ┌─────────────┼─────────────┐          │
│           ▼             ▼             ▼          │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│     │ Supabase │ │ EmailJS  │ │ SheetJS  │     │
│     │ Auth+DB  │ │ Sending  │ │ Parsing  │     │
│     └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────┘
Why a single file? Most developers would scaffold an entire React project with hundreds of files and a complex build pipeline to achieve what this app does. By running everything from one HTML file, the entire app can be:
•	Opened directly in a browser (no npm install)
•	Deployed to Vercel by dragging one file
•	Understood by reading one file
•	Shared by sending one link
It's a deliberate architectural decision that proves you don't need complexity to build something powerful.
How It Works
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. UPLOAD   │────▶│  2. TRACK    │────▶│  3. SHIP     │
│              │     │              │     │              │
│ Import your  │     │ Monitor      │     │ Send real    │
│ spreadsheet  │     │ items, set   │     │ emails,      │
│ — we auto-   │     │ priorities,  │     │ export       │
│ detect       │     │ manage       │     │ reports,     │
│ everything   │     │ vendors      │     │ keep team    │
│              │     │              │     │ in sync      │
└─────────────┘     └─────────────┘     └─────────────┘
Getting Started
Prerequisites
•	A [Supabase](https://supabase.com) account (free tier)
•	An [EmailJS](https://www.emailjs.com) account (free tier — 200 emails/month)
•	A [Vercel](https://vercel.com) account for deployment (optional)
1. Clone the Repository
git clone https://github.com/yourusername/notion.git
cd notion
2. Set Up Supabase
1.	Create a new project at [supabase.com](https://supabase.com)
2.	Go to SQL Editor → run this query:
-- Items table
CREATE TABLE items (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT,
  item_code TEXT,
  vendor TEXT,
  vendor_email TEXT,
  owner TEXT,
  status TEXT DEFAULT 'Not Finished',
  priority TEXT DEFAULT 'Medium',
  notes TEXT,
  document_name TEXT,
  follow_up TEXT,
  last_contact TEXT,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queue table
CREATE TABLE queue (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_to TEXT,
  vendor TEXT,
  item_code TEXT,
  item_name TEXT,
  tpl TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own items" ON items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own queue" ON queue FOR ALL USING (auth.uid() = user_id);
3.	Go to Settings → API and copy your Project URL and Anon Key
3. Set Up EmailJS
4.	Create an account at [emailjs.com](https://www.emailjs.com)
5.	Add an Email Service (Gmail or Outlook)
6.	Create a Template with variables: {{to_email}}, {{subject}}, {{message}}
7.	Copy your Service ID, Template ID, and Public Key
4. Update Credentials
Open index.html and replace the placeholder values:
const SUPA_URL = "your-supabase-url";
const SUPA_KEY = "your-supabase-anon-key";
emailjs.init("your-emailjs-public-key");
// In the testSend function:
emailjs.send("your-service-id", "your-template-id", { ... })
5. Deploy
Option A: Vercel (Recommended)
# Push to GitHub, then import in Vercel
git add . && git commit -m "Deploy" && git push
Option B: Open Directly
# Just open the file in your browser
open index.html
Project Structure
notion/
├── index.html        ← The entire app (115KB)
├── landing.html      ← Marketing landing page
└── README.md         ← You are here
Yes, that's it. That's the whole project. One file, zero build tools, full-stack production app.
The Story Behind This
"I noticed my team was manually tracking 500+ vendor inventory items across spreadsheets, email chains, and shared documents. Updates were missed, follow-ups were forgotten, and nobody had a clear picture of what was completed and what wasn't."
So I built Notion.
It started as a simple HTML page — a table with some status badges. Then I added features one by one, each solving a real pain point:
•	Spreadsheet uploads replaced manual data entry
•	Smart auto-detection eliminated the "which column is which?" problem
•	Email templates stopped the copy-paste workflow with vendors
•	Cloud sync meant I could check statuses from my phone
•	Real email sending turned "I'll send that later" into "done"
What makes this project different from a typical portfolio piece is that every feature exists because someone needed it. This wasn't built from a tutorial or a course curriculum — it was built from frustration with real tools that didn't work well enough.
The Technical Challenge
Building a full-stack app in a single HTML file forced creative problem-solving:
•	No bundler? Use Babel's in-browser transpiler for JSX
•	No backend server? Use Supabase for auth + database directly from the client
•	No email server? Use EmailJS to send from the browser
•	No state management library? Manage 40+ useState hooks with careful architecture
•	No component files? Build a clean component hierarchy in one script block
The constraint of "one file" wasn't a limitation — it was a design philosophy. It proves that powerful software doesn't require complex tooling.
What I Learned
•	Supabase is a legitimate Firebase alternative — Postgres + Auth + RLS in minutes
•	Row-Level Security is powerful — each user's data is isolated at the database level
•	EmailJS enables real email from static sites — no backend required
•	In-browser Babel has real-world use cases for rapid prototyping
•	Single-file architecture forces you to think about code organization differently
•	Auto-save + undo/redo together create a safety net that makes users confident
•	Dark mode requires 100+ overrides to do properly — it's not just "invert colors"
•	Smart column detection with keyword lists handles messy real-world data better than strict schemas
Roadmap
•	☐ 📊 Data visualization — Charts for completion trends, vendor performance
•	☐ 📱 Mobile optimization — Collapse tables into cards on small screens
•	☐ 👥 Real-time collaboration — See teammates' edits live via Supabase Realtime
•	☐ 📲 PWA support — Install as a native app on phones and desktops
•	☐ ♿ Accessibility audit — Full ARIA labels, keyboard navigation, screen reader support
•	☐ 🧪 Error boundaries — Graceful crash recovery
•	☐ 📊 Advanced analytics — Email open tracking, response time metrics
Contributing
Contributions are welcome! Here's how:
8.	Fork the repository
9.	Create a feature branch (git checkout -b feature/amazing-feature)
10.	Commit your changes (git commit -m 'Add amazing feature')
11.	Push to the branch (git push origin feature/amazing-feature)
12.	Open a Pull Request
License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
Author
Damola Akinyemi
•	🌐 [notion-sage-mu.vercel.app](https://notion-sage-mu.vercel.app/)
•	💼 [LinkedIn](https://linkedin.com/in/damola-akinyemi)
•	🐙 [GitHub](https://github.com/yourusername)
Built with ⚡ by Damola Akinyemi
*If this project helped you or impressed you, give it a ⭐ on GitHub!*

