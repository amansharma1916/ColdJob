import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeDate(date) {
  if (!date) return '';
  return dayjs(date).fromNow();
}

export function formatDate(date, format = 'MMM D, YYYY h:mm A') {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function formatShortDate(date) {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY');
}