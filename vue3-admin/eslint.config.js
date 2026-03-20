import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint flat config: Vue + base JS + Prettier compatibility.
export default defineConfig([
  // Workspace configs are handled per package in the monorepo.
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,vue}'],
    extends: [js.configs.recommended, ...vue.configs['flat/recommended'], prettier],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      // Keep Vue templates readable in demos.
      'vue/max-attributes-per-line': 'off'
    }
  }
])
