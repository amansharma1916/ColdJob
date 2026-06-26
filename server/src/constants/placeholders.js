export const SUPPORTED_PLACEHOLDERS = Object.freeze([
  'recipient_name',
  'first_name',
  'last_name',
  'company',
  'role',
  'industry',
  'date',
  'day',
  'month',
  'year',
  'github',
  'linkedin',
  'portfolio',
  'sender_name',
  'sender_email',
  'custom_1',
  'custom_2',
  'custom_3',
  'custom_4',
  'custom_5',
]);

export const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;