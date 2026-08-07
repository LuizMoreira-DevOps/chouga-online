const THEME_STORAGE_KEY = "chouga-theme";

export const THEME_OPTIONS = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? THEME_OPTIONS.LIGHT
    : THEME_OPTIONS.DARK;
}

export function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === THEME_OPTIONS.LIGHT || savedTheme === THEME_OPTIONS.DARK) {
    return savedTheme;
  }

  return THEME_OPTIONS.SYSTEM;
}

export function resolveTheme(theme) {
  return theme === THEME_OPTIONS.SYSTEM ? getSystemTheme() : theme;
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = resolveTheme(theme);
}

export function saveTheme(theme) {
  if (theme === THEME_OPTIONS.SYSTEM) {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  applyTheme(theme);
}
