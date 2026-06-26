import { google } from 'googleapis';
import axios from 'axios';
import { getOAuth2Client } from '../config/google.js';
import User from '../models/User.model.js';
import { decrypt } from '../helpers/crypto.helper.js';
import { buildMimeMessage } from '../helpers/mime.helper.js';
import { AuthError, AppError } from '../errors/index.js';
import { env } from '../config/env.js';

export const sendEmail = async (userId, { to, subject, htmlBody, resumeUrl }) => {
  const user = await User.findById(userId).select('encryptedRefreshToken gmailConnected');
  if (!user || !user.gmailConnected || !user.encryptedRefreshToken) {
    throw new AuthError('Gmail not connected. Please reconnect your account.');
  }

  const refreshToken = decrypt(user.encryptedRefreshToken);
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Auto-refresh access token
  await oauth2Client.getAccessToken();

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Build attachments array if resume is provided
  const attachments = [];
  if (resumeUrl) {
    try {
      const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
      const content = Buffer.from(response.data).toString('base64');
      attachments.push({
        filename: 'resume.pdf',
        mimeType: 'application/pdf',
        content,
      });
    } catch (err) {
      console.warn(`[gmail] Failed to download resume attachment: ${err.message}`);
    }
  }

  const raw = buildMimeMessage({ to, subject, htmlBody, attachments });

  try {
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
    return {
      gmailMessageId: result.data.id,
      gmailThreadId: result.data.threadId,
    };
  } catch (err) {
    if (err.response?.data?.error === 'invalid_grant') {
      await User.findByIdAndUpdate(userId, {
        gmailConnected: false,
        encryptedRefreshToken: null,
      });
      throw new AuthError('Gmail connection expired. Please reconnect your account.');
    }
    throw new AppError(`Gmail send failed: ${err.message}`, 502);
  }
};