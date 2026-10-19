# URL Shorting Landing Page

## Overview & Project Scope

Welcome to the **URL Shorting Landing Page** web application, a modern, highly interactive, and fully responsive landing page featuring dynamic URL shorting, robust error handling, clipboard integration, and modal/popover dialog controls.

## Hero Preview

![App Preview](public/hero.png)

## Links

- **Live Demo URL:** https://Ahmed-let-front.github.io/url-shorting/
- **Frontend Mentor Solution:** https://www.frontendmentor.io/challenges/url-shortening-api-landing-page-2ce3ob-G

## AI Collaboration

- 🤖 **UI & Layout Assistance:** AI collaboration was utilized exclusively to assist with structuring and refining the user interface (UI) and layout architecture. All core application logic, DOM manipulation, and programming were independently engineered and implemented by the author.

---

## Lighthouse Performance Audit

## ![Lighthouse Score](public/lighthouse.png)

## Logic Architecture Notice

> 💡 **Note:** Since this is a modern front-end **Landing Page**, a complex architectural flowchart is not required. The project relies on clean component rendering, event delegation, and state-driven DOM updates.

---

## Core Features & Logic Pipelines

- 🔗 **Dynamic URL Shorting:** Real-time URL shorting with interactive input validation and error handling.
- 📋 **Clipboard Integration:** Seamless one-click copy functionality using modern clipboard APIs.
- ⚡ **Interactive Modals & Popovers:** Robust dialog element integration for demo presentation notices.

## Tech Stack & Implementation Details

- 🧱 **Semantic HTML5 Markup:** Clean, accessible, and structured DOM hierarchy leveraging modern dialog elements.
- 💻 **Vanilla JavaScript:** Structured asynchronous JavaScript utilizing ES6 modules and event delegation.
- 🎨 **Tailwind CSS v4:** Utility-first styling utilizing modern CSS features and responsive design variables.
- ⚡ **Vite:** Next-generation frontend tooling ensuring fast HMR and optimized production bundling.

## What I Learned & Architectural Highlights

- Learned that `navigator.clipboard` is a powerful Web API that interacts directly with the device's operating system clipboard to securely write and save the short URL.
- Understood how proxy servers are utilized to bypass CORS restrictions when communicating with external shorting APIs, and that there are both free and paid proxy options available for development and production.

---

## API & Backend Architecture Note

> 💡 **Development Note:** I am fully aware that the API key for the URL shortening service is currently exposed directly in the frontend code. This was chosen temporarily for quick setup and deployment, and I plan to move this logic to a dedicated backend architecture to secure the API key away from the browser later when time permits.

---

## Project Initialization & Local Setup

To run this project locally, follow these steps:

### 1. Clone the repository:

```bash
git clone https://github.com/Ahmed-let-front/url-shorting.git
```

### 2. Navigate to the project directory:

```bash
cd url-shorting
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Start the development server:

```bash
npm run dev
```

### 5. Build for production:

```bash
npm run build
```

---

## Vite Build Configuration

The project uses an optimized **vite.config.js** file tailored for production asset bundling and vendor chunk splitting:

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  base: '/url-shorting/',
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
```

---

## Author

- GitHub: [ahmed-let-front](https://github.com/Ahmed-let-front)
- Frontend Mentor: [Ahmed yasser](https://www.frontendmentor.io/profile/Ahmed-let-front)
- LinkedIn: [Ahmed Yasser](https://www.linkedin.com/in/ahmed-yasser-frontend/)

---

**Thanks** Created By **Ahmed Yasser** ❤️
