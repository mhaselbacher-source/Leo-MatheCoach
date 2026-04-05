/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_RESET_GUARD_PIN?: string;
  readonly VITE_DEFAULT_PLAYER_NAME?: string;
  readonly VITE_DEFAULT_PLAYER_PIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
