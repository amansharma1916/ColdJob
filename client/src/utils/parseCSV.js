import { isValidEmail } from './validateEmail';

export function parseCSV(text) {
  if (!text) return { headers: [], rows: [], emails: [] };

  const lines = text.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [], emails: [] };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || '').trim();
    });
    return row;
  });

  const emails = [];
  const emailColumn = headers.find(
    (h) => h.toLowerCase().includes('email') || h.toLowerCase() === 'e-mail'
  );

  if (emailColumn) {
    rows.forEach((row) => {
      const email = row[emailColumn];
      if (email && isValidEmail(email)) {
        emails.push(email);
      }
    });
  }

  return { headers, rows, emails };
}

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}