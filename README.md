# Kando Martial Arts Knox

A modern, high-performance website for Kando Martial Arts Knox, built with Astro and deployed to AWS.

## 🌟 Features

- **Lightning Fast**: Static site generation with Astro for optimal performance
- **SEO Optimized**: Comprehensive SEO with structured data, sitemaps, and meta tags
- **Responsive Design**: Mobile-first design with Tailwind CSS and Flowbite
- **Interactive Components**: React components for dynamic navigation and filters
- **Image Optimization**: Automatic WebP/AVIF conversion with Sharp
- **View Transitions**: Smooth page transitions with Astro ViewTransitions
- **Dark Mode**: Built-in theme switching
- **Accessibility**: WCAG compliant with semantic HTML

## 🚀 Tech Stack

- **[Astro](https://astro.build)** v5 - Static site generator
- **[React](https://react.dev)** v18 - Interactive UI components
- **[Tailwind CSS](https://tailwindcss.com)** v4 - Utility-first CSS framework
- **[Flowbite](https://flowbite.com)** - UI component library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **Sharp** - Image processing and optimization

## 📁 Project Structure

```
kando-knox/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── cloudfront-functions/       # CloudFront edge functions
├── docs/                       # Documentation
│   ├── aws-setup-guide.md      # AWS deployment guide
│   ├── aws-setup-checklist.md  # Setup checklist
│   └── deployment-summary.md   # Quick reference
├── public/                     # Static assets
│   ├── icons/                  # Favicons and app icons
│   └── img/                    # Public images
├── src/
│   ├── assets/                 # Image assets (optimized)
│   ├── components/             # Reusable components
│   │   ├── home/               # Homepage components
│   │   ├── locations/          # Location page components
│   │   ├── program/            # Program page components
│   │   └── shared/             # Shared components
│   ├── content/                # Content collections
│   │   ├── blog/               # Blog posts
│   │   ├── locations/          # Location data
│   │   └── program/            # Program data
│   ├── layouts/                # Page layouts
│   ├── pages/                  # Routes and pages
│   ├── styles/                 # Global styles
│   └── utils/                  # Utility functions
├── astro.config.mjs            # Astro configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

## 🛠️ Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

This generates a production-ready site in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📜 Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build production site            |
| `npm run preview` | Preview production build locally |
| `npm run astro`   | Run Astro CLI commands           |

## 🌐 Deployment

This project is configured for automatic deployment to AWS S3 + CloudFront via GitHub Actions.

### Automatic Deployment

1. Push to `main` branch
2. GitHub Actions automatically:
   - Builds the site
   - Uploads to S3 with optimized cache headers
   - Invalidates CloudFront cache
   - Deploys to production

### Manual Deployment

See [AWS Setup Guide](./docs/aws-setup-guide.md) for detailed instructions.

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

- `AWS_ACCESS_KEY_ID` - IAM user access key
- `AWS_SECRET_ACCESS_KEY` - IAM user secret key
- `S3_BUCKET_NAME` - S3 bucket name (e.g., `knoxmartialarts.com.au`)
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

## 🎨 Key Features

### Programs

- **Karate Programs**: Pre-school, Junior, Teen & Adult
- **Brazilian Jiu-Jitsu**: Junior and Teen & Adult programs
- **Women's Self-Defence**: Specialized self-defence training

### Location Pages

SEO-optimized location pages for:

- Bayswater
- Boronia
- Croydon
- Ferntree Gully
- Knoxfield
- Rowville
- Scoresby
- Wantirna

Each location has unique content for both Karate and BJJ programs.

### Blog

Martial arts blog covering:

- Benefits for kids
- Adult health benefits
- Self-defence topics
- Training tips

### SEO Features

- **Structured Data**: Organization, LocalBusiness, Service, Review schemas
- **Sitemap**: Auto-generated XML sitemap
- **Meta Tags**: Optimized titles, descriptions, Open Graph, Twitter Cards
- **Image Optimization**: WebP/AVIF with proper alt text
- **Performance**: Optimized caching and code splitting

## 🔧 Configuration

### Site Configuration

Edit `src/config.ts` to update:

- Site title and description
- Contact information
- Social media links
- Google Analytics ID

### Styling

- **Tailwind Config**: `tailwind.config.cjs`
- **Global Styles**: `src/styles/global.css`
- **Components**: Flowbite components in `src/components/`

### Content

Content is managed through Astro Content Collections:

- **Blog Posts**: `src/content/blog/*.md`
- **Locations**: `src/content/locations/*.json`
- **Programs**: `src/content/program/*.json`

## 📚 Documentation

- **[AWS Setup Guide](./docs/aws-setup-guide.md)** - Complete AWS deployment guide
- **[AWS Setup Checklist](./docs/aws-setup-checklist.md)** - Step-by-step checklist
- **[Deployment Summary](./docs/deployment-summary.md)** - Quick reference
- **[SEO Review](./docs/SEO-REVIEW.md)** - SEO analysis and recommendations

## 🐛 Troubleshooting

### Build Errors

- Ensure Node.js 20+ is installed
- Run `npm install` to update dependencies
- Check `astro.config.mjs` for configuration issues

### Deployment Issues

- Verify GitHub secrets are set correctly
- Check AWS IAM permissions
- Review GitHub Actions logs for errors

### ViewTransitions Errors

The project includes compatibility fixes for React 18 and Astro ViewTransitions. If you encounter `unstable_now` errors:

1. Ensure Header component uses `client:idle`
2. Check that polyfills are loaded before ClientRouter
3. See `src/layouts/Layout.astro` for implementation details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Build and preview with `npm run build && npm run preview`
5. Submit a pull request

## 📄 License

Copyright © 2025 Kando Martial Arts Knox. All rights reserved.

## 🔗 Links

- **Live Site**: https://knoxmartialarts.com.au
- **GitHub Repository**: https://github.com/comjdev/kando-knox
- **Facebook**: https://www.facebook.com/kandoknox
- **Instagram**: https://www.instagram.com/kandoknox

## 👥 Team

- **Sensei Andy** - Head Instructor & Owner
- **Sempai Irene** - 3rd Dan Black Belt
- **Sempai Sonya** - Junior Program Instructor
- **Sempai Jade** - Kando Brown Belt
- **Sempai Ty** - Kando Black Belt

---

Built with ❤️ for Kando Martial Arts Knox
