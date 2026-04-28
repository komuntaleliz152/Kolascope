# Kolaborate AI — AI-Powered Freelance Toolkit

Kolaborate AI helps freelancers save time and win more clients by automating two of the most painful parts of freelancing — writing proposals and scoping projects.

Built for the **Kolaborate Build Challenge · April 2026**.

---

## Features

### Proposal Writer
Paste a job brief, select your tone, and get a tailored client-ready proposal in seconds.
- Three tone options: Professional, Friendly, Bold
- One-click copy
- Regenerate for a different version
- Proposal history saved locally (last 5)

### Scope Estimator
Describe a project in plain English and get a full breakdown instantly.
- Task list with time estimates and complexity ratings
- Suggested hourly rate and total budget range
- Risk flags to watch out for
- Regenerate anytime

---

## Tech Stack

- [Next.js 14](https://nextjs.org) — App Router
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Groq API](https://groq.com) — Llama 3.3 70B (AI inference)
- [Vercel](https://vercel.com) — Deployment

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
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

Deployed on Vercel. Every push to `master` triggers an automatic redeployment.

---

## Author

Built by Elizabeth Komuntaleliz · [GitHub](https://github.com/komuntaleliz152)
