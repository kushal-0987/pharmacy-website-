<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Homepage sections live in `src/components/home/`; `src/routes/index.tsx` only composes them. Why: the deliverable is a single homepage, so one folder keeps it easy to navigate.
- The hero 3D scene (`HeroScene.tsx`, three/R3F) is `React.lazy`-loaded and mounted only after hydration, inside an error boundary. Why: three.js must not run during SSR and a WebGL failure must not break the page.
- Media the page shows (logo, hero video, photos) is stored via `lovable-assets` pointers in `src/assets/*.asset.json`; only the favicon is a real file in `public/`. Why: keeps the repo light and serves media from the CDN.
- Copy and company facts come from `src/components/home/site-data.ts`. Why: one place to update verified business details.
