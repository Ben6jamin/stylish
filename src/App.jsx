import React, { useEffect, useState } from 'react';
import ProfileCard from './components/ProfileCard';
import RecommendationList from './components/RecommendationList';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const AUTH_TOKEN_KEY = 'stylish.authToken';

const socialProviders = [
  {
    id: 'google',
    label: 'Continue with Google',
    helper: 'Sync approved preferences, account basics, and search-led style signals.',
    note: 'Fastest onboarding'
  },
  {
    id: 'instagram',
    label: 'Continue with Instagram',
    helper: 'Pull creator taste, saved looks, and fashion intent the user approves.',
    note: 'Best for visual taste'
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    helper: 'Use community-driven shopping signals and identity details with consent.',
    note: 'Strong interest graph'
  }
];

const trustHighlights = [
  'Create a real local account, then sign back in with the same credentials through the backend.',
  'Keep the consent layer explicit so users understand what Stylish is allowed to use.',
  'Turn approved signals into recommendations with visible reasons and store-by-store pricing.'
];

const consentPoints = [
  'Profile basics and verified account identity',
  'Liked looks, saved items, and followed creators the user approves',
  'Shopping intent signals used to explain recommendations and deal comparisons'
];

const landingStats = [
  { value: '3', label: 'Connected networks' },
  { value: '92%', label: 'Explained style matches' },
  { value: '1 tap', label: 'Consent checkpoint' }
];

const magicMoments = [
  {
    title: 'Consent Ledger',
    detail: 'Every signal category is approved before the profile is unlocked.'
  },
  {
    title: 'Taste Orbit',
    detail: 'Creators, brands, and budget cues blend into a visible fashion identity.'
  },
  {
    title: 'Deal Radar',
    detail: 'Recommendations arrive with the reason and the best available total.'
  }
];

const signalChips = [
  'Saved looks',
  'Favorite creators',
  'Budget range',
  'Brand affinity',
  'Fit preferences',
  'Wishlist intent'
];

const initialForm = {
  name: '',
  email: '',
  password: ''
};

const emptyDashboard = {
  userProfile: null,
  recommendations: []
};

function SocialIcon({ provider }) {
  if (provider === 'google') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12.24 10.285v3.935h5.517c-.223 1.27-.967 2.346-2.057 3.069l3.324 2.58c1.935-1.785 3.046-4.415 3.046-7.549 0-.723-.065-1.418-.186-2.035H12.24Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.76 0 5.076-.915 6.768-2.48l-3.324-2.58c-.922.618-2.101.983-3.444.983-2.646 0-4.887-1.785-5.688-4.185l-3.436 2.651A10.216 10.216 0 0 0 12 22Z"
        />
        <path
          fill="#4A90E2"
          d="M6.312 13.738A6.143 6.143 0 0 1 6 11.999c0-.604.11-1.188.312-1.739L2.876 7.609A10.216 10.216 0 0 0 1.8 12c0 1.647.393 3.206 1.076 4.39l3.436-2.652Z"
        />
        <path
          fill="#FBBC05"
          d="M12 6.078c1.501 0 2.847.517 3.907 1.533l2.93-2.93C17.07 3.034 14.754 2 12 2A10.216 10.216 0 0 0 2.876 7.609l3.436 2.651C7.113 7.86 9.354 6.078 12 6.078Z"
        />
      </svg>
    );
  }

  if (provider === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.75" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.67 21v-7.68h2.58l.39-3.01h-2.97V8.39c0-.87.24-1.47 1.49-1.47H16.8V4.23c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.88 1.4-3.88 3.98v2.22H8v3.01h2.6V21h3.07Z"
      />
    </svg>
  );
}

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {
    Accept: 'application/json'
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Could not reach the Stylish API. Start the backend and try again.');
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Something went wrong while talking to the Stylish API.');
  }

  return payload;
}

function App() {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState(initialForm);
  const [consentChecked, setConsentChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [session, setSession] = useState(null);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [pendingAction, setPendingAction] = useState('');
  const [authToken, setAuthToken] = useState(() => window.localStorage.getItem(AUTH_TOKEN_KEY) || '');
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)));

  const isSignup = mode === 'signup';
  const isBusy = Boolean(pendingAction);

  const hydrateAuthState = (payload, token) => {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      setAuthToken(token);
    }

    setSession(payload.session);
    setDashboard({
      userProfile: payload.userProfile,
      recommendations: payload.recommendations
    });
    setStatusMessage('');
  };

  const clearAuthState = (message = '') => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken('');
    setSession(null);
    setDashboard(emptyDashboard);
    setForm(initialForm);
    setConsentChecked(false);
    setMarketingChecked(false);
    setPendingAction('');
    setStatusMessage(message);
  };

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      if (!authToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const payload = await apiRequest('/api/home-feed', { token: authToken });

        if (!ignore) {
          hydrateAuthState(payload, authToken);
        }
      } catch (error) {
        if (!ignore) {
          clearAuthState('Your previous session expired. Sign in again to reopen your style studio.');
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    if (!consentChecked) {
      setStatusMessage(
        `Please approve data consent before ${isSignup ? 'creating an account' : 'signing in'}.`
      );
      return;
    }

    setPendingAction(isSignup ? 'signup' : 'signin');
    setStatusMessage('');

    try {
      const payload = await apiRequest(
        isSignup ? '/api/auth/signup' : '/api/auth/signin',
        {
          method: 'POST',
          body: {
            name: form.name,
            email: form.email,
            password: form.password,
            consentChecked,
            marketingChecked
          }
        }
      );

      hydrateAuthState(payload, payload.token);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setPendingAction('');
    }
  };

  const handleSocialAuth = async (provider) => {
    if (!consentChecked) {
      setStatusMessage(`Please approve data consent before connecting ${provider}.`);
      return;
    }

    setPendingAction(provider);
    setStatusMessage('');

    try {
      const payload = await apiRequest('/api/auth/social', {
        method: 'POST',
        body: {
          provider,
          consentChecked,
          marketingChecked
        }
      });

      hydrateAuthState(payload, payload.token);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setPendingAction('');
    }
  };

  const handleReset = async () => {
    const currentToken = authToken;

    clearAuthState();

    if (!currentToken) {
      return;
    }

    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        token: currentToken
      });
    } catch {
      // Ignore logout failures and still clear the local session.
    }
  };

  if (isBootstrapping) {
    return (
      <div className="page-shell">
        <main className="loading-shell">
          <div className="loading-orb" />
          <p className="eyebrow">Restoring Session</p>
          <h1>Reopening the Stylish style studio...</h1>
          <p className="lead-copy">
            We’re reconnecting the approved account data and rebuilding the personalized fashion feed.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {session ? (
        <main className="dashboard-shell">
          <section className="hero-banner">
            <div className="hero-banner-copy">
              <p className="eyebrow eyebrow-light">Backend Auth Connected</p>
              <h1>
                {session.provider === 'email'
                  ? 'Your Stylish account is live.'
                  : 'Your social style graph is synced.'}
              </h1>
              <p>
                Signed in with {session.providerLabel}. Stylish is now using the approved
                signals to explain every recommendation, rank the best store totals, and
                keep the user’s consent choices visible.
              </p>

              <div className="hero-chip-row">
                {session.connectedProviders.map((provider) => (
                  <span key={provider} className="hero-chip">
                    {provider === 'email'
                      ? 'Email profile'
                      : `${provider.charAt(0).toUpperCase()}${provider.slice(1)} sync`}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-banner-stats">
              <div>
                <span className="stat-label">Connected Source</span>
                <strong>{session.providerLabel}</strong>
              </div>
              <div>
                <span className="stat-label">Signed-in Identity</span>
                <strong>{session.email}</strong>
              </div>
              <div>
                <span className="stat-label">Permission Status</span>
                <strong>{session.consentChecked ? 'Approved' : 'Pending'}</strong>
              </div>
              <button type="button" className="secondary-button" onClick={handleReset}>
                Switch account
              </button>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-column">
              <ProfileCard user={dashboard.userProfile} />

              <section className="card permission-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Permission Snapshot</p>
                    <h2>What Stylish can use</h2>
                  </div>
                </div>

                <p className="section-copy">
                  The dashboard below is now driven by the backend session and the approved
                  signals that came through sign up, sign in, or social auth.
                </p>

                <div className="permission-chip-group">
                  {consentPoints.map((point) => (
                    <span key={point} className="permission-chip">
                      {point}
                    </span>
                  ))}
                </div>

                <p className="meta-note">
                  {session.marketingChecked
                    ? 'Trend updates and price-drop alerts are enabled for this account.'
                    : 'Promotional alerts are currently off, so only core personalization is active.'}
                </p>
              </section>
            </div>

            <RecommendationList items={dashboard.recommendations} />
          </section>
        </main>
      ) : (
        <main className="auth-layout">
          <section className="intro-panel">
            <div className="glow glow-one" />
            <div className="glow glow-two" />

            <div className="intro-copy">
              <span className="brand-pill">Stylish Magic Beta</span>
              <p className="eyebrow">Consent-First Fashion Intelligence</p>
              <h1>Turn social taste into a stylish sign-in moment.</h1>
              <p className="lead-copy">
                Stylish now connects the landing page, auth experience, and backend session
                flow into one product. Users can create an account, sign back in later, or
                continue with a social provider while the consent model stays clear.
              </p>
            </div>

            <div className="metric-strip">
              {landingStats.map((stat) => (
                <article key={stat.label} className="metric-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>

            <section className="magic-stage">
              <article className="phone-preview">
                <div className="phone-preview-topbar">
                  <span className="preview-pill">Live preview</span>
                  <span className="preview-mini">AI match + deal radar</span>
                </div>

                <div className="preview-look-card">
                  <span className="look-tag">Saved look sync</span>
                  <h3>Quiet luxury, creator-led, and city-ready.</h3>
                  <p>Signals blend into one profile before recommendations go live.</p>
                </div>

                <div className="preview-tile-grid">
                  <article className="preview-tile">
                    <span>Match</span>
                    <strong>94%</strong>
                  </article>
                  <article className="preview-tile">
                    <span>Best total</span>
                    <strong>$94</strong>
                  </article>
                  <article className="preview-tile">
                    <span>Consent</span>
                    <strong>Active</strong>
                  </article>
                </div>
              </article>

              <article className="floating-panel floating-panel-one">
                <p className="eyebrow">Creator Sync</p>
                <h3>Instagram saves become explainable style data.</h3>
              </article>

              <article className="floating-panel floating-panel-two">
                <p className="eyebrow">Deal Pulse</p>
                <h3>Every recommendation ships with a store total and reasoning.</h3>
              </article>
            </section>

            <div className="highlight-stack">
              {trustHighlights.map((highlight, index) => (
                <article key={highlight} className="highlight-card">
                  <span className="highlight-index">0{index + 1}</span>
                  <p>{highlight}</p>
                </article>
              ))}
            </div>

            <section className="signal-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Signals With User Approval</p>
                  <h2>Consent preview</h2>
                </div>
              </div>

              <div className="signal-chip-group">
                {signalChips.map((signal) => (
                  <span key={signal} className="signal-chip">
                    {signal}
                  </span>
                ))}
              </div>

              <div className="magic-moment-grid">
                {magicMoments.map((moment) => (
                  <article key={moment.title} className="magic-moment-card">
                    <h3>{moment.title}</h3>
                    <p>{moment.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section className="auth-panel">
            <div className="auth-panel-inner">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Account Access</p>
                  <h2>{isSignup ? 'Create a backend-powered account' : 'Sign in to reopen the feed'}</h2>
                </div>
              </div>

              <p className="section-copy">
                Email sign up creates a real local account in the backend. Social buttons
                also hit backend auth routes so the flow is fully connected end to end.
              </p>

              <div className="mode-switch" role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  className={`mode-button ${isSignup ? 'is-active' : ''}`}
                  onClick={() => setMode('signup')}
                  disabled={isBusy}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  className={`mode-button ${!isSignup ? 'is-active' : ''}`}
                  onClick={() => setMode('signin')}
                  disabled={isBusy}
                >
                  Sign in
                </button>
              </div>

              <div className="social-auth-grid">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className={`social-button social-button-${provider.id}`}
                    onClick={() => handleSocialAuth(provider.id)}
                    disabled={isBusy}
                  >
                    <span className={`social-icon-shell ${provider.id}`}>
                      <SocialIcon provider={provider.id} />
                    </span>

                    <span className="social-copy">
                      <strong>{provider.label}</strong>
                      <small>{provider.helper}</small>
                    </span>

                    <span className="social-note">{pendingAction === provider.id ? 'Connecting...' : provider.note}</span>
                  </button>
                ))}
              </div>

              <div className="auth-divider">
                <span>or continue with email</span>
              </div>

              <form className="auth-form" onSubmit={handleEmailSubmit}>
                {isSignup ? (
                  <label className="field">
                    <span>Full name</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFieldChange}
                      placeholder="Alex Morgan"
                      required
                      disabled={isBusy}
                    />
                  </label>
                ) : null}

                <div className="field-grid">
                  <label className="field">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFieldChange}
                      placeholder="alex@stylish.app"
                      required
                      disabled={isBusy}
                    />
                  </label>

                  <label className="field">
                    <span>Password</span>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFieldChange}
                      placeholder="minimum 8 characters"
                      required
                      disabled={isBusy}
                    />
                  </label>
                </div>

                <section className="consent-card">
                  <div>
                    <p className="eyebrow">User Consent</p>
                    <h3>Data use approval</h3>
                    <p className="section-copy">
                      Approval is part of the auth flow now. The backend will reject sign up,
                      sign in, or social connect requests until consent is confirmed.
                    </p>
                  </div>

                  <ul className="consent-list">
                    {consentPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <label className="consent-option">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(event) => setConsentChecked(event.target.checked)}
                      disabled={isBusy}
                    />
                    <span>
                      I consent to Stylish using the approved profile and social data to
                      personalize recommendations and compare store offers.
                    </span>
                  </label>

                  <label className="consent-option optional-option">
                    <input
                      type="checkbox"
                      checked={marketingChecked}
                      onChange={(event) => setMarketingChecked(event.target.checked)}
                      disabled={isBusy}
                    />
                    <span>
                      Send optional trend updates, price-drop alerts, and editorial picks.
                    </span>
                  </label>
                </section>

                <p className={`form-feedback ${statusMessage ? 'is-visible' : ''}`}>
                  {statusMessage ||
                    'Social auth is wired to the backend with demo provider identities until real OAuth keys are added.'}
                </p>

                <button type="submit" className="primary-button" disabled={isBusy}>
                  {pendingAction === 'signup'
                    ? 'Creating account...'
                    : pendingAction === 'signin'
                      ? 'Signing in...'
                      : isSignup
                        ? 'Create account'
                        : 'Sign in'}
                </button>
              </form>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
