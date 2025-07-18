# CVilo Landing Page

A modern, responsive landing page for CVilo - the ultimate resume-building platform. Built with Next.js 15, TypeScript, Tailwind CSS, and modern web technologies.

## ✨ Features

- **Modern Design**: Beautiful gradient backgrounds, smooth animations, and professional typography
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Performance Optimized**: Built with Next.js 15 for optimal performance and SEO
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels
- **SEO Ready**: Meta tags, structured data, and optimized for search engines
- **Modern UI Components**: Built with shadcn/ui components and Lucide React icons
- **Smooth Animations**: CSS animations and hover effects for enhanced user experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- Docker (for deployment)

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cvilo-landing-nextjs
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
yarn build
```

### Running Production Build

```bash
yarn start
```

## 🐳 Docker Deployment

### Quick Deployment

Use the provided deployment script:

```bash
./deploy.sh
```

This script will:
- Build the Docker image
- Stop any existing container
- Start a new container on port 3001
- Show deployment status

### Manual Docker Deployment

1. **Build the image**
   ```bash
   docker build -t cvilo-landing-nextjs .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name cvilo-landing-nextjs \
     -p 3001:3001 \
     --restart unless-stopped \
     cvilo-landing-nextjs
   ```

3. **Access the application**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🏗️ Project Structure

```
cvilo-landing-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles and Tailwind CSS
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page component
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── navigation.tsx      # Navigation component
│   │   └── footer.tsx          # Footer component
│   └── lib/                    # Utility functions
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Dependencies and scripts
└── deploy.sh                   # Deployment script
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-blue-600 to-purple-600`)
- **Secondary**: Purple gradient (`from-purple-600 to-pink-600`)
- **Accent**: Pink gradient (`from-pink-600 to-red-600`)
- **Background**: Light gradients with subtle patterns

### Typography
- **Font**: Geist Sans (modern, clean font)
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable text with proper line height

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Subtle shadows with hover animations
- **Navigation**: Sticky header with backdrop blur
- **Footer**: Dark theme with social links

## 📱 Responsive Design

The landing page is fully responsive and optimized for:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NODE_ENV=development
PORT=3000
```

### Next.js Configuration

The `next.config.ts` file includes:
- Standalone output for Docker deployment
- Security headers
- Performance optimizations

### Tailwind CSS

Custom configuration in `tailwind.config.js`:
- Custom color palette
- Animation utilities
- Responsive design utilities

## 📦 Dependencies

### Core Dependencies
- **Next.js 15.3.3**: React framework
- **React 19.1.0**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4.1.8**: Utility-first CSS framework

### UI Components
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons
- **class-variance-authority**: Component variants
- **clsx**: Conditional classes

### Development
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## 📈 Analytics

The landing page is ready for analytics integration:

- **Google Analytics 4**: Add your GA4 tracking ID
- **Google Tag Manager**: Add your GTM container ID
- **Hotjar**: Add your Hotjar site ID
- **Custom Events**: Track user interactions

## 🔒 Security

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Content Security Policy**: Configured for security
- **HTTPS Only**: Production deployment uses HTTPS
- **Input Validation**: All user inputs are validated

## 🌐 SEO

- **Meta Tags**: Optimized for search engines
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Auto-generated sitemap
- **Robots.txt**: Search engine crawling rules
- **Open Graph**: Social media sharing optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: hello@cvilo.com
- **Documentation**: [docs.cvilo.com](https://docs.cvilo.com)
- **Issues**: [GitHub Issues](https://github.com/cvilo/landing-page/issues)

## 🎯 Roadmap

- [ ] Add dark mode support
- [ ] Implement A/B testing
- [ ] Add more landing page templates
- [ ] Integrate with CMS
- [ ] Add multi-language support
- [ ] Implement PWA features

---

Built with ❤️ by the CVilo team 