import { getOAuth2Client, SCOPES } from '../config/google.js';
import { signAccessToken } from '../helpers/jwt.helper.js';
import { encrypt } from '../helpers/crypto.helper.js';
import User from '../models/User.model.js';
import { AuthError } from '../errors/AuthError.js';
import { env } from '../config/env.js';

export const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
};

export const handleOAuthCallback = async (code) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.id_token) {
    throw new AuthError('No id_token returned from Google.');
  }

  // Decode id_token payload
  const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      googleId,
      email,
      name,
      avatar: picture,
      lastLoginAt: new Date(),
    });
  } else {
    user.name = name || user.name;
    user.avatar = picture || user.avatar;
    user.lastLoginAt = new Date();
  }

  // Encrypt and store refresh token
  if (tokens.refresh_token) {
    user.encryptedRefreshToken = encrypt(tokens.refresh_token);
    user.gmailConnected = true;
  }

  await user.save();

  const jwtToken = signAccessToken({ userId: user._id, email: user.email });

  return {
    token: jwtToken,
    user: user.toSafeObject(),
  };
};

export const refreshGoogleToken = async (userId) => {
  const user = await User.findById(userId).select('encryptedRefreshToken');
  if (!user || !user.encryptedRefreshToken) {
    throw new AuthError('No refresh token stored. Please reconnect your Google account.');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: user.encryptedRefreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();

  if (credentials.refresh_token) {
    user.encryptedRefreshToken = encrypt(credentials.refresh_token);
    await user.save();
  }

  const jwtToken = signAccessToken({ userId: user._id });
  return { token: jwtToken };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    encryptedRefreshToken: null,
    gmailConnected: false,
  });
};