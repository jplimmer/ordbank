import { APP_CONFIG } from './config';
import { LANGUAGES } from './languages';

export function getDefaultLanguages() {
  const { source, target } = APP_CONFIG.defaultLanguages;

  return {
    source: LANGUAGES[source],
    target: LANGUAGES[target],
  };
}
