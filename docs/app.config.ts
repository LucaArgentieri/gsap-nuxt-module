export default defineAppConfig({
  docus: {
    locale: "en",
  },
  seo: {
    title: "gsap-nuxt-module",
    description:
      "GSAP integration for Nuxt — auto-import, plugin composables, and zero-overhead tree-shaking.",
  },
  header: {
    title: "gsap-nuxt-module",
  },
  // socials: {
  //   github: 'https://github.com/LucaArgentieri/gsap-nuxt-module',
  // },
  github: {
    url: "https://github.com/LucaArgentieri/gsap-nuxt-module",
    branch: "main",
    rootDir: "docs",
  },
  toc: {
    title: "On this page",
    bottom: {
      title: "Links",
      links: [
        {
          label: "GitHub",
          icon: "i-simple-icons-github",
          to: "https://github.com/LucaArgentieri/gsap-nuxt-module",
          target: "_blank",
        },
        {
          label: "npm",
          icon: "i-simple-icons-npm",
          to: "https://npmjs.com/package/gsap-nuxt-module",
          target: "_blank",
        },
        {
          label: "GSAP docs",
          icon: "i-lucide-book-open",
          to: "https://gsap.com/docs/v3/",
          target: "_blank",
        },
      ],
    },
  },
  // ui: {
  //   colors: {
  //     primary: "gsap",
  //     neutral: "zinc",
  //   },
  // },
});
