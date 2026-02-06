/**
 * Reference to vite/client removed to fix "Cannot find type definition file" error.
 * Local interfaces below handle ImportMeta typing for environment variables.
 */

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
