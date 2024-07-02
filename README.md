# Next.js & NextUI Template

This is a template for creating applications using Next.js 14 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).

```
npg
├─ .eslintrc.json
├─ .gitignore
├─ .npmrc
├─ .vscode
│  └─ settings.json
├─ app
│  ├─ categories
│  │  ├─ chuan-mei
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ guo-wai
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ he-ji
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  └─ onlyfans
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     └─ [slug]
│  │        └─ page.tsx
│  ├─ error.tsx
│  ├─ layout.tsx
│  ├─ lib
│  │  └─ api.ts
│  ├─ page.tsx
│  ├─ providers.tsx
│  ├─ search
│  │  └─ [slug]
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ ui
│  │  ├─ ButtonServer.tsx
│  │  ├─ HotsVideos.tsx
│  │  ├─ RecommendedVideos.tsx
│  │  ├─ Swiper.tsx
│  │  ├─ VideoCard.tsx
│  │  └─ VideoPlayer.tsx
│  └─ video
│     └─ [id]
│        ├─ layout.tsx
│        ├─ loading.tsx
│        └─ page.tsx
├─ components
│  ├─ counter.tsx
│  ├─ icons.tsx
│  ├─ navbar.tsx
│  ├─ primitives.ts
│  └─ theme-switch.tsx
├─ config
│  ├─ fonts.ts
│  └─ site.ts
├─ LICENSE
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ apple-icon.png
│  ├─ asxhengfu.png
│  ├─ favicon.ico
│  ├─ icon.png
│  ├─ next.svg
│  ├─ sqkjhengfu.png
│  └─ vercel.svg
├─ README.md
├─ styles
│  └─ globals.css
├─ tailwind.config.js
├─ tsconfig.json
└─ types
   └─ index.ts

```

```
npg
├─ .eslintrc.json
├─ .gitignore
├─ .npmrc
├─ .vscode
│  └─ settings.json
├─ app
│  ├─ api
│  │  └─ route.ts
│  ├─ chuan-mei
│  │  ├─ layout.tsx
│  │  ├─ opengraph-image.tsx
│  │  ├─ page.tsx
│  │  ├─ twitter-image.tsx
│  │  └─ [...slug]
│  │     ├─ opengraph-image.tsx
│  │     ├─ page.tsx
│  │     └─ twitter-image.tsx
│  ├─ error.tsx
│  ├─ guo-wai
│  │  ├─ layout.tsx
│  │  ├─ opengraph-image.tsx
│  │  ├─ page.tsx
│  │  ├─ twitter-image.tsx
│  │  └─ [...slug]
│  │     ├─ opengraph-image.tsx
│  │     ├─ page.tsx
│  │     └─ twitter-image.tsx
│  ├─ he-ji
│  │  ├─ layout.tsx
│  │  ├─ opengraph-image.tsx
│  │  ├─ page.tsx
│  │  ├─ twitter-image.tsx
│  │  └─ [...slug]
│  │     ├─ opengraph-image.tsx
│  │     ├─ page.tsx
│  │     └─ twitter-image.tsx
│  ├─ layout.tsx
│  ├─ lib
│  │  └─ api.ts
│  ├─ manifest.json
│  ├─ onlyfans
│  │  ├─ layout.tsx
│  │  ├─ opengraph-image.tsx
│  │  ├─ page.tsx
│  │  ├─ twitter-image.tsx
│  │  └─ [...slug]
│  │     ├─ opengraph-image.tsx
│  │     ├─ page.tsx
│  │     └─ twitter-image.tsx
│  ├─ opengraph-image.tsx
│  ├─ page.tsx
│  ├─ providers.tsx
│  ├─ robots.txt
│  ├─ search
│  │  └─ [slug]
│  │     ├─ layout.tsx
│  │     ├─ opengraph-image.tsx
│  │     ├─ page.tsx
│  │     └─ twitter-image.tsx
│  ├─ twitter-image.tsx
│  ├─ ui
│  │  ├─ ButtonServer.tsx
│  │  ├─ HotsVideos.tsx
│  │  ├─ Pagination.tsx
│  │  ├─ RecommendedVideos.tsx
│  │  ├─ SearchForm.tsx
│  │  ├─ Swiper.tsx
│  │  ├─ VideoCard.tsx
│  │  ├─ VideoGrid.tsx
│  │  └─ VideoPlayer.tsx
│  └─ video
│     └─ [id]
│        ├─ layout.tsx
│        ├─ loading.tsx
│        └─ page.tsx
├─ components
│  ├─ CategoryTabs.tsx
│  ├─ counter.tsx
│  ├─ icons.tsx
│  ├─ navbar.tsx
│  ├─ primitives.ts
│  ├─ theme-switch.tsx
│  └─ YandexMetrica.tsx
├─ config
│  ├─ fonts.ts
│  └─ site.ts
├─ LICENSE
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ apple-icon.png
│  ├─ asxhengfu.png
│  ├─ favicon.ico
│  ├─ icon.png
│  ├─ next.svg
│  ├─ NotoSansSC-VariableFont_wght.ttf
│  ├─ sqkjhengfu.png
│  └─ vercel.svg
├─ README.md
├─ styles
│  └─ globals.css
├─ tailwind.config.js
├─ tsconfig.json
└─ types
   ├─ hls.d.ts
   └─ index.ts

```
