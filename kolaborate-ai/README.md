# Kolaborate AI — AI-Powered Freelance Toolkit

A full-stack web application that helps freelancers save time and win more clients using AI. Built for the **Kolaborate Build Challenge · April 2026**.

🔗 **Live:** [kolaai.vercel.app](https://kolaai.vercel.app)

---

## Features

### Tools
| Tool | Description |
|------|-------------|
| **Scope Estimator** | Describe a project and get a full task breakdown, time estimates, budget range, and risk flags |
| **Proposal Writer** | Paste a job brief and get a tailored, client-ready proposal with tone control (Professional / Friendly / Bold) |
| **Brief Analyzer** | Paste a vague client brief and get clarity scores, red flags, missing info, and questions to ask |
| **Rate Calculator** | Enter your expenses and income goals to find your minimum, recommended, and premium hourly rates |

### User Features
- Sign up / Sign in with email and password (show/hide password toggle)
- Welcome email on signup
- Profile page — save your bio and it auto-fills in the Proposal Writer
- History page — view, search, expand, copy, and delete saved proposals and estimates
- PDF export for proposals

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Full-stack framework — App Router |
| [React 19](https://react.dev) | UI |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [Lucide React](https://lucide.dev) | Icons |
| [Plus Jakarta Sans + Inter](https://fonts.google.com) | Typography |
| [Groq API](https://groq.com) (Llama 3.3 70B) | AI inference |
| [Supabase](https://supabase.com) | Auth + Postgres database |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF export |
| [Vitest](https://vitest.dev) | Unit testing |
| [Vercel](https://vercel.com) | Deployment |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/komuntaleliz152/Kolascope.git
cd Kolascope/kolaborate-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the `kolaborate-ai` root:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

- Groq API key: [console.groq.com](https://console.groq.com)
- Supabase keys: [supabase.com](https://supabase.com) → your project → Settings → API Keys

### 4. Set up the database

Run this SQL in your Supabase SQL Editor:

```sql
create table proposals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  job_brief text not null,
  freelancer_bio text,
  tone text default 'Professional',
  proposal text not null,
  created_at timestamp with time zone default now()
);

create table scope_estimates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  project_desc text not null,
  hourly_rate text,
  result jsonb not null,
  created_at timestamp with time zone default now()
);

create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  bio text,
  hourly_rate text,
  skills text,
  updated_at timestamp with time zone default now()
);

alter table proposals enable row level security;
alter table scope_estimates enable row level security;
alter table profiles enable row level security;

create policy "Users can manage their own proposals" on proposals for all using (auth.uid() = user_id);
create policy "Users can manage their own scope estimates" on scope_estimates for all using (auth.uid() = user_id);
create policy "Users can manage their own profile" on profiles for all using (auth.uid() = id);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing

```bash
npm test          # run all tests
npm run lint      # check for lint errors
npx tsc --noEmit  # check for type errors
npm run build     # verify production build
```

---

## Deployment

Deployed on Vercel using the Vercel CLI:

```bash
npx vercel --prod
```

---

## Author

Built by Elizabeth Komuntaleliz · [GitHub](https://github.com/komuntaleliz152)
