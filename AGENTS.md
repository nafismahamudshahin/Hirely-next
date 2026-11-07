# Hirely

Single Next.js App Router homepage using React 19, TypeScript, Tailwind CSS 4, and shadcn-style primitives.

- Root layout: `app/layout.tsx`; homepage composition: `app/page.tsx`.
- Shared shell components: `components/layout/`; homepage sections: `components/home/`.
- Reusable UI primitives: `components/ui/`; public image assets: `public/images/`.
- Alias `@/*` resolves from repository root; configure aliases in `tsconfig.json`, not `next.config.ts`.

## Commands

Run from the repository root:

```bash
npm run dev
npm run typecheck
npm run lint
npm run format
npm run build
```

No test runner is configured. Use `npm run build` as the final integration check.

## Next.js 16

Next.js 16.4.4 differs from older releases. Read relevant guides under `node_modules/next/dist/docs/` before changing app-router APIs, images, fonts, data loading, or server/client-component boundaries.

`AGENTS.md` carries a managed `nextjs-agent-rules` block. `next dev` rewrites that block; preserve it when editing this file.

## Styling

- Tailwind 4 is imported and configured in `app/globals.css`; use Tailwind utilities and arbitrary values for component styles.
- `lucide-react` 1.70 does not export the usual social-media icon names; use inline SVGs where needed.
- Local images live in `public/images/` and are referenced by URL strings; static imports may also be used for bundled images.
