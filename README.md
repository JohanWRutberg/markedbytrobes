# MarkedByTrobes

A modern book blog and review platform built with Next.js, focused on affiliate marketing and Pinterest optimization.

## Features

- 📚 **Book Reviews & Lists** - Detailed book reviews and curated reading lists
- ✍️ **Rich Content Editor** - Full-featured TipTap editor for creating engaging posts
- 🎨 **Beautiful Design** - Modern, responsive design with light/dark modes
- 🔐 **Authentication** - Email and Google OAuth login with NextAuth
- 💬 **Comments & Ratings** - Engage with readers through comments and star ratings
- 👤 **Admin Dashboard** - Comprehensive admin panel for content management
- 🔗 **Affiliate Ready** - Amazon Associates integration with proper disclosures
- 📱 **Mobile First** - Optimized for mobile devices (80-90% Pinterest traffic)
- ⚡ **Fast Performance** - Built for speed with Next.js 15 and optimized images
- 🔍 **SEO Optimized** - Schema markup, sitemap, and meta tags for better visibility
- 📍 **Pinterest Ready** - Vertical images and Pin It button integration

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Caching:** Redis
- **Deployment:** Docker Ready

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (optional but recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/markedbytrobes.git
cd markedbytrobes
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database and authentication credentials.

4. Start Docker services:

```bash
npm run docker:up
```

5. Run Prisma migrations:

```bash
npm run prisma:push
npm run prisma:generate
```

6. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
markedbytrobes/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── blog/              # Blog pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── blog/             # Blog components
│   ├── layout/           # Layout components
│   ├── post/             # Post components
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Key Features

### Admin Dashboard

- Create and manage blog posts
- Rich text editor with images, videos, tables
- Book list management with Amazon affiliate links
- User management
- Analytics and engagement metrics

### Blog Posts

- Multiple categories (Romance, Thriller, Self Development, etc.)
- Tag system for organization
- Featured images optimized for Pinterest
- Book cards with Amazon affiliate links
- Comments and ratings system
- Breadcrumb navigation
- Related posts

### SEO & Performance

- Automatic sitemap generation
- Schema.org markup (Article, Review, Breadcrumbs)
- Open Graph tags for social sharing
- Image optimization with next/image
- Fast page loads (target <2s)

### Affiliate Marketing

- Amazon Associates integration
- Multiple CTA buttons per post
- Affiliate disclosure on all pages
- Click tracking ready

## Color Scheme

- **Primary:** #f0dfcc (Cream)
- **Secondary:** #0c1c33 (Navy Blue)
- **Font:** Cinzel

## License

This project is private and proprietary.

## Support

For questions or issues, contact hello@markedbytrobes.com
