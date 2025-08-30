const isDevelopment = import.meta.env.MODE === 'development';

const nativeConsole = console;

export const logger = {
  log: (...args) => {
    if (isDevelopment) nativeConsole.log(...args);
  },

  debug: (...args) => {
    if (isDevelopment) nativeConsole.debug('[DEBUG]', ...args);
  },

  warn: (...args) => {
    if (isDevelopment) nativeConsole.warn(...args);
  },

  error: (...args) => {
    // Always log errors so they can be observed in production
    nativeConsole.error(...args);
  }
};
