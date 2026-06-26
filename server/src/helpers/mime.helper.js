export const buildMimeMessage = ({ to, subject, htmlBody, attachments = [] }) => {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const lines = [];

  lines.push(`To: ${to}`);
  lines.push('MIME-Version: 1.0');
  lines.push(`Subject: ${subject}`);
  lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  lines.push('');

  // HTML part
  lines.push(`--${boundary}`);
  lines.push('Content-Type: text/html; charset="UTF-8"');
  lines.push('Content-Transfer-Encoding: base64');
  lines.push('');
  lines.push(Buffer.from(htmlBody, 'utf-8').toString('base64'));

  // Attachments
  for (const attachment of attachments) {
    lines.push(`--${boundary}`);
    lines.push(`Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`);
    lines.push('Content-Transfer-Encoding: base64');
    lines.push(`Content-Disposition: attachment; filename="${attachment.filename}"`);
    lines.push('');
    // Split base64 content into lines of max 76 chars (RFC 2045)
    const content = attachment.content;
    for (let i = 0; i < content.length; i += 76) {
      lines.push(content.substring(i, i + 76));
    }
  }

  // End boundary
  lines.push(`--${boundary}--`);

  return Buffer.from(lines.join('\r\n'), 'utf-8').toString('base64url');
};