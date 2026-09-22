// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'TMS — Teacher Management System',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
    },
  },

  i18n: {
    baseUrl: '/',
    locales: [
      { code: 'en', name: 'English', file: 'en.ts' },
      { code: 'km', name: 'ខ្មែរ', file: 'km.ts' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: false,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'tms_locale',
      redirectOn: 'root',
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  icon: {
    serverBundle: { collections: ['heroicons', 'mdi'] },
  },

  typescript: {
    strict: true,
  },
})
