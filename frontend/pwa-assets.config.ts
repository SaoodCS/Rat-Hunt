import {
    defineConfig,
    minimalPreset,
    createAppleSplashScreens,
    combinePresetAndAppleSplashScreens
  } from '@vite-pwa/assets-generator/config'
  
  export default defineConfig({
    preset: combinePresetAndAppleSplashScreens(minimalPreset, createAppleSplashScreens()),
    images: ['public/icons/logo-512x512.png']
  })