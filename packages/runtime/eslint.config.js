import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";

export default [
  // ignore build outputs
  { ignores: ["dist/**", "build-types/**"] },

  // TypeScript source
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // base JS recommended rules
      ...js.configs.recommended.rules,
      // TS recommended rules
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
