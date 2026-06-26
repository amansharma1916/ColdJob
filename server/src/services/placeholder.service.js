import { PLACEHOLDER_REGEX, SUPPORTED_PLACEHOLDERS } from '../constants/placeholders.js';

export const replace = (template, variables) => {
  if (!template) return template;

  return template.replace(PLACEHOLDER_REGEX, (match, key) => {
    if (variables[key] !== undefined && variables[key] !== null) {
      return variables[key];
    }
    // Leave unmatched placeholders as-is, log warning
    console.warn(`[placeholder] Unmatched placeholder: {{${key}}}`);
    return match;
  });
};

export const extractPlaceholders = (text) => {
  if (!text) return [];
  const matches = text.match(PLACEHOLDER_REGEX);
  if (!matches) return [];
  const keys = matches.map((m) => m.replace(/[{}]/g, ''));
  return [...new Set(keys)];
};