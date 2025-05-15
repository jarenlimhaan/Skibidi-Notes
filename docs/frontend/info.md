# Frontend Project Guide

This is a [Next.js](https://nextjs.org/) project using [shadcn/ui](https://ui.shadcn.com/) for UI components.

## 🧠 Project Overview

This frontend serves as the UI layer for our application. It uses:

- **Next.js** for routing, SSR/SSG, and API routes.
- **shadcn/ui** for modular, accessible components based on Radix UI.
- **Tailwind CSS** for utility-first styling.
- **TypeScript** for type safety.

## 🗂️ Project Structure 

This is an example of how our project structure would look like (not 100% yet)
```bash
    src/
    ├── app/             # All pages and routes live here (App Router)
    │   ├── page.tsx     # Home page ("/")
    │   └── dashboard/   # Nested route ("/dashboard")
    │       ├── layout.tsx
    │       └── page.tsx
    │
    ├── components/      # Reusable UI and custom components
    │   ├── ui/          # shadcn/ui components (Button, Input, etc.)
    │   └── custom/      # Your own components (Navbar, Sidebar, etc.)
    │
    ├── lib/             # Helpers, API functions, constants, utils
    │   ├── components/  # shadcn/ui components (Button, Input, etc.)
    │   └── api/         # Group related API endpoints
    │       ├── user.ts
    │       └── auth.ts
    │
    ├── styles/          # Tailwind config and global styles
    └── public/          # Static assets (images, icons, etc.)
```

## 🎨 Adding dependencies 

This guide explains how to:
- Add a new npm package (dependency)
- Add a new UI component using [shadcn/ui](https://ui.shadcn.com/)

### Installing a dependency on Nextjs
```bash
npm i <<package name>>
```

```bash
# dev dependency
npm i -D <<package name>>
```

### Adding a Shadcn Component
- Fetch the component from the shadcn library
- A button example below:
```bash
npx shadcn-ui@latest add button
```