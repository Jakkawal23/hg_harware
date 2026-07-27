# HG-Hardware (คลังสินค้าน็อตฮาร์ดแวร์)

An e-commerce and catalog platform for HG-Hardware, built with modern web technologies to showcase hardware products and handle quotation requests.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Internationalization (i18n)**: [next-intl](https://next-intl-docs.vercel.app/)
- **Database / Backend**: [Supabase](https://supabase.com/)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Key Features

- **Product Catalog**: Browse hardware products and view specifications.
- **RFQ System**: Seamless "Request for Quotation" drawer and workflow.
- **Internationalization**: Full i18n support for multiple languages (e.g., Thai, English).
- **Responsive Design**: Fully responsive, mobile-first design.
- **Interactive UI**: Fluid animations and highly polished user interfaces.

## 📂 Project Structure

- `src/app/` - Next.js App Router pages (with locale routing like `/[locale]/...`)
- `src/components/` - Reusable React components (e.g., Navbar, RFQDrawer)
- `supabase/` - Supabase database integration and configurations
- `messages/` - Translation JSON files for `next-intl`
- `public/` - Static assets like images and icons
