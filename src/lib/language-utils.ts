import { APP_CONFIG } from '../config/config';

export function getDefaultLanguages() {
  const { source, target } = APP_CONFIG.defaultLanguages;

  return {
    source: source,
    target: target,
  };
}
