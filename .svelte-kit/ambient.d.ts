
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const npm_package_devDependencies__tailwindcss_typography: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_devDependencies_tailwindcss_animate: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_devDependencies_clsx: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const MallocSpaceEfficient: string;
	export const WINDOWID: string;
	export const npm_package_scripts_dev: string;
	export const MallocNanoZone: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const EXTENSION_KIT_EXTENSION_TYPE: string;
	export const PNPM_HOME: string;
	export const USER: string;
	export const npm_package_devDependencies_tailwind_variants: string;
	export const COMMAND_MODE: string;
	export const npm_package_devDependencies_zod: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_package_dependencies_lucide: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies_svelte_sonner: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_devDependencies_formsnap: string;
	export const npm_package_devDependencies_vaul_svelte: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_package_devDependencies_sveltekit_superforms: string;
	export const PATH: string;
	export const npm_package_devDependencies_bits_ui: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_command: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_devDependencies_lucide_svelte: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies__tailwindcss_container_queries: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const npm_config__tiptap_pro_registry: string;
	export const XPC_FLAGS: string;
	export const npm_package_devDependencies_paneforge: string;
	export const npm_package_devDependencies__tailwindcss_forms: string;
	export const npm_package_devDependencies_mode_watcher: string;
	export const npm_package_devDependencies_tailwind_merge: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const HOME: string;
	export const SHLVL: string;
	export const npm_package_type: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_package_dependencies_gsap: string;
	export const npm_package_devDependencies__internationalized_date: string;
	export const npm_package_dependencies_firebase: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const ALACRITTY_WINDOW_ID: string;
	export const npm_package_devDependencies_embla_carousel_svelte: string;
	export const npm_lifecycle_script: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const ZED_TERM: string;
	export const BUN_INSTALL: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const npm_package_scripts_prepare: string;
	export const COLORTERM: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		npm_package_devDependencies__tailwindcss_typography: string;
		npm_package_devDependencies_prettier: string;
		npm_package_devDependencies_tailwindcss_animate: string;
		TERM_PROGRAM: string;
		NODE: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		INIT_CWD: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_devDependencies_clsx: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		MallocSpaceEfficient: string;
		WINDOWID: string;
		npm_package_scripts_dev: string;
		MallocNanoZone: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		EXTENSION_KIT_EXTENSION_TYPE: string;
		PNPM_HOME: string;
		USER: string;
		npm_package_devDependencies_tailwind_variants: string;
		COMMAND_MODE: string;
		npm_package_devDependencies_zod: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_package_dependencies_lucide: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies_svelte_sonner: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		npm_package_devDependencies_formsnap: string;
		npm_package_devDependencies_vaul_svelte: string;
		npm_config_frozen_lockfile: string;
		npm_package_devDependencies_sveltekit_superforms: string;
		PATH: string;
		npm_package_devDependencies_bits_ui: string;
		__CFBundleIdentifier: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_command: string;
		npm_package_scripts_preview: string;
		npm_package_devDependencies_lucide_svelte: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies__tailwindcss_container_queries: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		npm_config__tiptap_pro_registry: string;
		XPC_FLAGS: string;
		npm_package_devDependencies_paneforge: string;
		npm_package_devDependencies__tailwindcss_forms: string;
		npm_package_devDependencies_mode_watcher: string;
		npm_package_devDependencies_tailwind_merge: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_autoprefixer: string;
		HOME: string;
		SHLVL: string;
		npm_package_type: string;
		HOMEBREW_PREFIX: string;
		npm_package_dependencies_gsap: string;
		npm_package_devDependencies__internationalized_date: string;
		npm_package_dependencies_firebase: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		ALACRITTY_WINDOW_ID: string;
		npm_package_devDependencies_embla_carousel_svelte: string;
		npm_lifecycle_script: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		ZED_TERM: string;
		BUN_INSTALL: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		npm_package_scripts_prepare: string;
		COLORTERM: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
