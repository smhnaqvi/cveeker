# CVilo Landing Page

A modern, responsive landing page for CVilo - the ultimate resume-building platform. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Beautiful gradient-based design with professional aesthetics
- **Responsive**: Fully responsive design that works on all devices
- **Fast Performance**: Built with Next.js 15 for optimal performance
- **TypeScript**: Full TypeScript support for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible UI components

## 📄 Pages

- **Home** (`/`) - Hero section, features, how it works, and call-to-action
- **About** (`/about`) - Company mission, target audience, and core benefits
- **Pricing** (`/pricing`) - Pricing plans, feature comparison, and FAQ
- **FAQ** (`/faq`) - Comprehensive frequently asked questions
- **Contact** (`/contact`) - Contact form and support information

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Emoji-based icons for better cross-platform compatibility
- **Fonts**: Geist Sans & Geist Mono

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cvilo-landing-nextjs
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/page.tsx     # About Us page
│   ├── contact/page.tsx   # Contact page
│   ├── faq/page.tsx       # FAQ page
│   ├── pricing/page.tsx   # Pricing page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── grid.tsx
│   ├── navigation.tsx    # Navigation component
│   └── footer.tsx        # Footer component
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#1976d2 to #9c27b0)
- **Secondary**: Purple (#9c27b0)
- **Background**: Gradient from blue-50 via white to purple-50
- **Text**: Gray scale for optimal readability

### Typography
- **Headings**: Bold, gradient text for impact
- **Body**: Clean, readable gray text
- **Buttons**: Consistent sizing and styling

## 🚀 Deployment

### Build for Production

```bash
yarn build
# or
npm run build
```

### Start Production Server

```bash
yarn start
# or
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## 📝 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`.

### shadcn/ui
UI components are configured in `components.json` and can be added using:
```bash
npx shadcn@latest add [component-name]
```

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 CVilo Features Highlighted

- Multiple resume management
- Lightning-fast builder
- Professional templates
- AI-powered suggestions
- Resume analytics
- Cover letter builder

## 📞 Support

For questions about the landing page or CVilo platform:
- Email: support@cvilo.com
- Location: Lahore, Pakistan
- Phone: +92 300 0000000

## 📄 License

This project is private and proprietary to CVilo.

---

Built with ❤️ for CVilo - Empowering professionals to build stunning resumes with ease. 