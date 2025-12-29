# 🎨 Retro Archive

> Minimalist anime merchandise showcase with affiliate marketing

![Version](https://img.shields.io/badge/version-0.1.0-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

**Retro Archive** is a brutalist-inspired, bilingual (EN/ES) ecommerce showcase for anime merchandise. Built with Next.js 16, it features a powerful admin panel synced with GitHub, real-time search, dark mode, and affiliate link tracking.

---

## ✨ Features

### Core Functionality
- 🌐 **Bilingual Support** - English & Spanish with dynamic routing
- 🌓 **Dark/Light Theme** - Persistent theme toggle
- 🔍 **Real-time Search** - Filter by name, description, and tags
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance Optimized** - Server-side rendering, image optimization

### E-commerce & Marketing
- 🛍️ **Product Showcase** - Grid/list view toggle
- ⭐ **Featured Products** - Highlighted hero section
- 💝 **Favorites System** - LocalStorage persistence
- 📊 **Google Analytics** - GA4 integration
- 🔗 **UTM Tracking** - Automatic affiliate link tracking
- 📧 **Newsletter** - Simple email collection

### Admin Panel
- 🔐 **Secure Login** - Password-protected admin access
- ✏️ **Product Management** - Full CRUD operations
- 🖼️ **Mockup Generator** - Preview products on apparel
- 🔄 **GitHub Sync** - Auto-commit product changes
- 📈 **Inventory Stats** - Real-time dashboard

### User Experience
- 🎨 **Brutalist Design** - Retro minimalist aesthetic
- 🔗 **Social Sharing** - Direct share buttons with clipboard fallback
- 🔎 **Image Zoom** - Product detail magnification
- 💬 **Smart Related Products** - Relevance-based recommendations
- 🚀 **Loading States** - Skeleton screens for better UX
- ❌ **Error Boundaries** - Graceful error handling
- 🎯 **Custom 404** - Styled not-found page

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State** | Zustand (favorites), React Hooks |
| **Analytics** | Google Analytics 4 |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lucasmedinad/retro-archive.git
   cd retro-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file (see `.env.example` for reference):
   ```env
   # Required
   ADMIN_PASSWORD=your_secure_password
   
   # Optional
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your_account
   NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your_account
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📂 Project Structure

```
retro-archive/
├── src/
│   ├── app/
│   │   ├── [lang]/              # Localized routes (en, es)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── product/[id]/    # Product detail pages
│   │   │   ├── favorites/       # Favorites page
│   │   │   └── loading.tsx      # Loading skeleton
│   │   ├── admin/               # Admin panel
│   │   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── actions/             # Server Actions
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── FeaturedProduct.tsx
│   │   ├── NewsletterForm.tsx
│   │   └── ...
│   ├── data/
│   │   ├── products.json        # Product catalog
│   │   ├── products.ts          # Product utilities
│   │   └── newsletter.json      # Newsletter subscribers
│   └── dictionaries/
│       ├── en.json              # English translations
│       └── es.json              # Spanish translations
├── public/
│   ├── mockups/                 # Product images
│   └── placeholder.png          # Fallback image
└── package.json
```

---

## 🎮 Usage

### Adding Products

#### Via Admin Panel (Recommended)
1. Navigate to `/admin/login`
2. Enter password (from `.env.local`)
3. Click "+ NEW PRODUCT"
4. Fill in details and upload image
5. Changes auto-commit to GitHub

#### Manually
Edit `src/data/products.json`:
```json
{
  "en": [
    {
      "id": "unique-id",
      "name": "Product Name",
      "price": "$25.00",
      "image": "/mockups/image.jpg",
      "buyUrl": "https://affiliate-link.com",
      "category": "DESIGN",
      "description": "Product description",
      "tags": ["anime", "minimal"],
      "featured": false
    }
  ]
}
```

### Translations

Add new keys to `src/dictionaries/en.json` and `src/dictionaries/es.json`:
```json
{
  "nav": {
    "new_key": "English text"
  }
}
```

### Newsletter Subscribers

View subscribers in `src/data/newsletter.json`:
```json
[
  {
    "email": "user@example.com",
    "subscribedAt": "2025-12-29T12:00:00.000Z"
  }
]
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      accent: '#ff0000', // Change accent color
    }
  }
}
```

### Fonts
Edit `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables on Vercel

```
ADMIN_PASSWORD=your_password
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 📊 Analytics

This project uses Google Analytics 4. Track:
- Page views
- Product clicks (UTM tagged)
- Social shares
- Favorites added
- Newsletter signups

---

## 🔒 Security

- Admin panel protected by password
- Server Actions with validation
- No sensitive data exposed client-side
- HTTPS enforced in production

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is **open source** and available under the [MIT License](LICENSE).

---

## 🙌 Credits

- **Design**: Inspired by brutalist and retro minimalist aesthetics
- **Icons**: [Lucide React](https://lucide.dev)
- **Framework**: [Next.js](https://nextjs.org)
- **Deployment**: [Vercel](https://vercel.com)

---

## 📧 Contact

Lucas Medina - [@lucasmedinad](https://instagram.com/lucasmedinad)

Project Link: [https://github.com/lucasmedinad/retro-archive](https://github.com/lucasmedinad/retro-archive)

---

## 🗺️ Roadmap

- [x] Bilingual support
- [x] Dark mode
- [x] Admin panel
- [x] Newsletter
- [x] Smart related products
- [ ] Product reviews
- [ ] Wishlist sharing
- [ ] Blog/news section
- [ ] Advanced filtering (price range, sort)
- [ ] Image upload from admin panel

---

**Made with 🖤 by Lucas**
