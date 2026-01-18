# TheGifts - Spiritual Gifts Assessment Platform

A multilingual web application for discovering and understanding spiritual gifts through a comprehensive 90-question assessment. Built with SvelteKit 5, featuring SSR-driven internationalization and optimized SEO.

## Features

- **Comprehensive Assessment**: 90 questions across 18 spiritual gift categories
- **Multilingual Support**: Full support for English (EN) and Indonesian (ID) with SSR-driven i18n
- **SEO Optimized**: Locale-specific URLs, hreflang tags, and separate sitemaps for each language
- **Progress Persistence**: Automatically saves progress to localStorage, resume anytime
- **Responsive Design**: Modern UI with TailwindCSS v4
- **Share Results**: Share assessment results via native share API or clipboard

## Spiritual Gift Categories

The assessment evaluates 18 spiritual gift categories:

- Administration
- Discernment
- Evangelist
- Exhortation
- Faith
- Giving
- Healing
- Helps
- Hospitality
- Intercession
- Knowledge
- Leadership
- Mercy
- Missionary
- Pastor
- Service
- Teacher
- Wisdom

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thegifts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your database in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

5. Create the database table:
```sql
CREATE TABLE assessment_result (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  answer JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
npm run preview
```

## Architecture

### Tech Stack

- **Framework**: SvelteKit 5 with Svelte Runes
- **Styling**: TailwindCSS v4
- **i18n**: svelte-i18n with SSR support
- **Database**: PostgreSQL with raw SQL queries via `pg`
- **Deployment**: Node.js adapter (@sveltejs/adapter-node)

### Project Structure

```
src/
├── hooks.server.ts              # Server hooks for redirects and locale detection
├── lib/
│   ├── components/              # Reusable UI components
│   ├── data/
│   │   ├── questions.json       # All 90 assessment questions (bilingual)
│   │   └── category-question.json  # Question-to-category mapping
│   ├── i18n/
│   │   ├── index.ts            # i18n initialization
│   │   └── locales/
│   │       ├── en.json         # English translations
│   │       └── id.json         # Indonesian translations
│   ├── server/
│   │   └── db.ts               # PostgreSQL connection pool
│   └── utils/
│       └── category.ts         # Score calculation logic
└── routes/
    ├── +layout.svelte          # Root layout (global styles, meta tags)
    ├── [lang]/                 # Locale-aware routes
    │   ├── +layout.server.ts   # Locale validation
    │   ├── +layout.svelte      # i18n initialization, Navbar/Footer
    │   ├── +page.svelte        # Home page
    │   ├── onboarding/         # Name input page
    │   └── questionnaire/      # Assessment flow
    │       ├── +page.svelte    # Question pages (5 per page)
    │       ├── +server.ts      # POST endpoint for submission
    │       └── result/[id]/    # Results display page
    ├── sitemap.xml/            # Sitemap index
    ├── sitemap-en.xml/         # English sitemap
    └── sitemap-id.xml/         # Indonesian sitemap
```

### Internationalization (i18n)

The app uses **SSR URL-based i18n** with the following features:

- **Canonical URLs**: All localized content at `/{lang}/*` (e.g., `/en/onboarding`, `/id/questionnaire`)
- **Automatic Redirects**: Root `/` and old URLs redirect to canonical locale URLs
- **Locale Detection**: Uses cookie preference, falls back to Accept-Language header
- **Cookie Persistence**: User language preference saved in `lang` cookie
- **SEO Tags**: Automatic hreflang tags for all pages
- **Locale-Specific Sitemaps**: Separate sitemaps for EN and ID

### Key Workflows

#### 1. Assessment Flow
```
/[lang] (Home)
  ↓
/[lang]/onboarding (Enter name)
  ↓
/[lang]/questionnaire (Answer 90 questions, 5 per page)
  ↓
POST /questionnaire (Submit answers)
  ↓
/[lang]/questionnaire/result/[id] (View results)
```

#### 2. Language Switching
```
User clicks language dropdown
  ↓
Set cookie: lang={newLang}
  ↓
Navigate to: /{newLang}/current-path
  ↓
Full page reload → Re-initialize i18n with new locale
```

#### 3. Score Calculation

Each category contains 5 questions. Scores are calculated by:
1. Summing the ratings (1-5) for each category's questions
2. Sorting categories by score (descending)
3. Maximum score per category: 25 (5 questions × 5 rating)

## Database Schema

```sql
-- assessment_result table
CREATE TABLE assessment_result (
  id SERIAL PRIMARY KEY,                -- Auto-increment ID
  name TEXT NOT NULL,                   -- User's name
  answer JSONB NOT NULL,                -- Map of questionId -> rating (1-5)
  result JSONB NOT NULL,                -- Array of {category, score} sorted by score
  created_at TIMESTAMP DEFAULT NOW()    -- Timestamp
);
```

Example data:
```json
{
  "name": "John Doe",
  "answer": {
    "1": 5,
    "2": 4,
    // ... 90 questions total
  },
  "result": [
    {"category": "teacher", "score": 23},
    {"category": "leadership", "score": 21},
    // ... 18 categories total, sorted by score
  ]
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Type-check with svelte-check
- `npm run check:watch` - Type-check in watch mode
- `npm run lint` - Run ESLint

## Supported Locales

- `en` - English (default, x-default)
- `id` - Indonesian (Bahasa Indonesia)

## Environment Variables

Create a `.env` file with:

```env
# Database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Optional: Production URL for sitemaps
PUBLIC_SITE_URL=https://thegifts.site
```

## Deployment

The app uses `@sveltejs/adapter-node` and can be deployed to any Node.js hosting:

1. Build the app: `npm run build`
2. The output is in `.svelte-kit/output/`
3. Run: `node build/index.js`

Recommended hosts:
- Vercel (with Node.js adapter)
- Railway
- Render
- DigitalOcean App Platform
- Any VPS with Node.js

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
