import http from 'node:http';
import { randomBytes, randomUUID, scryptSync } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT || 4000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'data', 'auth-store.json');

const sessions = new Map();

const fallbackProfile = {
  budget: '$80 - $220',
  favoriteStyle: 'Modern Luxe Streetwear',
  inspiredBy: ['Runway streetwear', 'Capsule wardrobe edits', 'City-night tailoring']
};

const baseRecommendations = [
  {
    id: 1,
    name: 'Oversized Beige Blazer',
    styleMatch: 94,
    reason: 'Matches a polished silhouette and relaxed layering without feeling over-styled.',
    bestOffer: { store: 'StyleHub', price: 89, shipping: 5 }
  },
  {
    id: 2,
    name: 'Wide-Leg Black Trousers',
    styleMatch: 91,
    reason: 'Balances clean tailoring with an easy drape that works across day and night looks.',
    bestOffer: { store: 'UrbanRack', price: 62, shipping: 0 }
  },
  {
    id: 3,
    name: 'Chunky White Sneakers',
    styleMatch: 88,
    reason: 'Keeps the outfit grounded in social-ready comfort while still feeling premium.',
    bestOffer: { store: 'SneakPeak', price: 109, shipping: 8 }
  }
];

const socialProfiles = {
  google: {
    name: 'Aaliyah Stone',
    email: 'aaliyah.google@stylish.dev',
    budget: '$90 - $250',
    favoriteStyle: 'Minimal Tech Luxe',
    inspiredBy: ['The Row', 'Search-curated capsule looks', 'Modern tailoring']
  },
  instagram: {
    name: 'Maya Rivers',
    email: 'maya.instagram@stylish.dev',
    budget: '$60 - $180',
    favoriteStyle: 'Creator-Led Street Glam',
    inspiredBy: ['Festival reels', 'Creator moodboards', 'Color-pop layering']
  },
  facebook: {
    name: 'Jordan Ellis',
    email: 'jordan.facebook@stylish.dev',
    budget: '$70 - $190',
    favoriteStyle: 'Smart Casual Social',
    inspiredBy: ['Weekend brunch looks', 'Marketplace finds', 'City layering']
  }
};

const providerCues = {
  email: 'Profile answers and account preferences',
  google: 'Google account interests and saved preferences',
  instagram: 'Instagram saves, follows, and creator taste signals',
  facebook: 'Facebook community activity and shopping intent signals'
};

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function ensureStore() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(store) {
  await ensureStore();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function isValidEmail(email = '') {
  return /^\S+@\S+\.\S+$/.test(String(email).trim());
}

function isValidPassword(password = '') {
  return String(password).trim().length >= 8;
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString('hex');
}

function createSession(userId, provider) {
  const token = randomBytes(24).toString('hex');

  sessions.set(token, {
    userId,
    provider,
    createdAt: new Date().toISOString()
  });

  return token;
}

function getTokenFromRequest(req) {
  const authorization = req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7).trim();
}

function formatProviderLabel(provider) {
  return provider === 'email'
    ? 'Email'
    : `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;

      if (raw.length > 1_000_000) {
        reject(httpError(413, 'Request body is too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(httpError(400, 'Invalid JSON payload.'));
      }
    });

    req.on('error', reject);
  });
}

function createProfileFromUser(user) {
  return {
    name: user.name,
    budget: user.budget,
    favoriteStyle: user.favoriteStyle,
    inspiredBy: user.inspiredBy,
    connectedProviders: user.connectedProviders
  };
}

function createRecommendations(user, provider) {
  const inspirations = user.inspiredBy?.length ? user.inspiredBy : fallbackProfile.inspiredBy;
  const styleTone = user.favoriteStyle || fallbackProfile.favoriteStyle;
  const providerCue = providerCues[provider] || providerCues.email;
  const providerBoost = provider === 'instagram' ? 2 : provider === 'google' ? 1 : 0;

  return baseRecommendations.map((item, index) => {
    const inspiration = inspirations[index % inspirations.length];

    return {
      ...item,
      styleMatch: Math.min(98, item.styleMatch + providerBoost - index),
      reason: `${item.reason} Tuned for ${styleTone.toLowerCase()} and inspiration from ${inspiration}.`,
      signal: `${providerCue} helped push this piece higher in the ranking.`
    };
  });
}

function buildAuthPayload(user, provider, token) {
  return {
    token,
    session: {
      name: user.name,
      email: user.email,
      provider,
      providerLabel: formatProviderLabel(provider),
      consentChecked: user.consentChecked,
      marketingChecked: user.marketingChecked,
      connectedProviders: user.connectedProviders
    },
    userProfile: createProfileFromUser(user),
    recommendations: createRecommendations(user, provider)
  };
}

function createEmailUser({ name, email, password, marketingChecked }) {
  const salt = randomBytes(16).toString('hex');
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    name: String(name).trim(),
    email,
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    consentChecked: true,
    marketingChecked: Boolean(marketingChecked),
    connectedProviders: ['email'],
    budget: fallbackProfile.budget,
    favoriteStyle: fallbackProfile.favoriteStyle,
    inspiredBy: fallbackProfile.inspiredBy,
    createdAt: now,
    updatedAt: now
  };
}

function createSocialUser(provider, marketingChecked) {
  const profile = socialProfiles[provider];
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    name: profile.name,
    email: profile.email,
    passwordSalt: '',
    passwordHash: '',
    consentChecked: true,
    marketingChecked: Boolean(marketingChecked),
    connectedProviders: [provider],
    budget: profile.budget,
    favoriteStyle: profile.favoriteStyle,
    inspiredBy: profile.inspiredBy,
    createdAt: now,
    updatedAt: now
  };
}

async function requireUserFromToken(req) {
  const token = getTokenFromRequest(req);
  const session = token ? sessions.get(token) : null;

  if (!token || !session) {
    throw httpError(401, 'Please sign in to load your personalized feed.');
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.id === session.userId);

  if (!user) {
    sessions.delete(token);
    throw httpError(401, 'Your session is no longer available. Please sign in again.');
  }

  return { token, session, user };
}

async function handleSignUp(req, res) {
  const body = await parseBody(req);
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!name || name.length < 2) {
    throw httpError(400, 'Please enter a full name with at least 2 characters.');
  }

  if (!isValidEmail(email)) {
    throw httpError(400, 'Please enter a valid email address.');
  }

  if (!isValidPassword(password)) {
    throw httpError(400, 'Password must be at least 8 characters long.');
  }

  if (!body.consentChecked) {
    throw httpError(400, 'Please approve data consent before creating an account.');
  }

  const store = await readStore();
  const existingUser = store.users.find((entry) => entry.email === email);

  if (existingUser) {
    throw httpError(409, 'An account with this email already exists. Try signing in instead.');
  }

  const user = createEmailUser({
    name,
    email,
    password,
    marketingChecked: body.marketingChecked
  });

  store.users.push(user);
  await writeStore(store);

  const token = createSession(user.id, 'email');
  sendJson(res, 201, buildAuthPayload(user, 'email', token));
}

async function handleSignIn(req, res) {
  const body = await parseBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!isValidEmail(email)) {
    throw httpError(400, 'Please enter a valid email address.');
  }

  if (!password) {
    throw httpError(400, 'Please enter your password.');
  }

  if (!body.consentChecked) {
    throw httpError(400, 'Please approve data consent before signing in.');
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.email === email);

  if (!user || !user.passwordHash || !user.passwordSalt) {
    throw httpError(401, 'We could not find an email account with those credentials.');
  }

  const candidateHash = hashPassword(password, user.passwordSalt);

  if (candidateHash !== user.passwordHash) {
    throw httpError(401, 'Email or password is incorrect.');
  }

  user.consentChecked = true;
  user.marketingChecked = Boolean(body.marketingChecked);
  user.updatedAt = new Date().toISOString();

  if (!user.connectedProviders.includes('email')) {
    user.connectedProviders.push('email');
  }

  await writeStore(store);

  const token = createSession(user.id, 'email');
  sendJson(res, 200, buildAuthPayload(user, 'email', token));
}

async function handleSocialAuth(req, res) {
  const body = await parseBody(req);
  const provider = String(body.provider || '').trim().toLowerCase();

  if (!socialProfiles[provider]) {
    throw httpError(400, 'This social provider is not available yet.');
  }

  if (!body.consentChecked) {
    throw httpError(400, `Please approve data consent before connecting ${formatProviderLabel(provider)}.`);
  }

  const store = await readStore();
  let user = store.users.find((entry) => entry.email === socialProfiles[provider].email);

  if (!user) {
    user = createSocialUser(provider, body.marketingChecked);
    store.users.push(user);
  } else {
    user.consentChecked = true;
    user.marketingChecked = Boolean(body.marketingChecked);
    user.updatedAt = new Date().toISOString();

    if (!user.connectedProviders.includes(provider)) {
      user.connectedProviders.push(provider);
    }
  }

  await writeStore(store);

  const token = createSession(user.id, provider);
  sendJson(res, 200, buildAuthPayload(user, provider, token));
}

async function handleHomeFeed(req, res) {
  const { token, session, user } = await requireUserFromToken(req);
  sendJson(res, 200, buildAuthPayload(user, session.provider, token));
}

function handleLogout(req, res) {
  const token = getTokenFromRequest(req);

  if (token) {
    sessions.delete(token);
  }

  sendJson(res, 200, { ok: true });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;

    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/signup') {
      await handleSignUp(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/signin') {
      await handleSignIn(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/social') {
      await handleSocialAuth(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      handleLogout(req, res);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/home-feed') {
      await handleHomeFeed(req, res);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
      console.error('Stylish API error:', error);
    }

    sendJson(
      res,
      statusCode,
      {
        error:
          statusCode >= 500
            ? 'Something went wrong on the Stylish API.'
            : error.message
      }
    );
  }
});

ensureStore()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start Stylish API:', error);
    process.exit(1);
  });
