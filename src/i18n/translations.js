// Combined translation maps consumed by LanguageContext.
//
// English (en) is the hand-written source of truth in ./en.js.
// Other languages are GENERATED from it by scripts/translate-i18n.mjs
// (`npm run i18n:translate`) and imported here.
//
// To add a language: run `npm run i18n:translate -- --lang <code>`, then
// import the generated file below, add it to `translations`, and list it in
// LANGUAGES in ../context/LanguageContext.jsx.

import { en } from './en.js'
import { si } from './si.js'

export const translations = { en, si }
