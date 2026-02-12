export default {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 120,
  bracketSpacing: true,
  endOfLine: "auto",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/theme/global.css",
  tailwindFunctions: ["clsx"],
};
