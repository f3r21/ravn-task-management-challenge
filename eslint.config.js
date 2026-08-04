import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'src/graphql/generated', 'public/mockServiceWorker.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // `configs.flat` is the flat-config namespace; `configs['recommended-latest']`
  // at the top level is still the legacy eslintrc shape and ESLint 10 rejects it.
  reactHooks.configs.flat['recommended-latest'],
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        // The root config files are not part of the app's `tsconfig.json`
        // (see the comment there about Vite/Vitest type duplication), so the
        // project service needs them listed explicitly or typed linting
        // reports them as outside the project.
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'vite.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // The challenge is graded on type discipline. `any` and `@ts-ignore` are
      // the two ways to opt out of it silently, so both are errors rather than
      // warnings — a warning in CI is a warning nobody reads.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      // `type` imports are erased at build time; marking them keeps the emitted
      // module graph honest about what is a real runtime dependency.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Test files legitimately await non-promises via matchers and pass loosely
    // typed fixtures around; the type-checked rules that guard production code
    // produce noise here without catching real defects.
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'src/mocks/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    // This config file itself. Type-aware rules cannot say anything useful here:
    // several ESLint plugins ship no type declarations, so every value read off
    // them is an error type and the unsafe-* rules fire on the act of composing
    // a config. The rules that matter for app code still apply to app code.
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
)
