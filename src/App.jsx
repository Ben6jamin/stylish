import { useState } from 'react';
import ProfileCard from './components/ProfileCard';
import RecommendationList from './components/RecommendationList';
import { userProfile, recommendations } from './data/mockData';

const socialProviders = [
  {
    id: 'google',
    label: 'Continue with Google',
    helper: 'Use your account basics and saved preferences with permission.',
    badge: 'G'
  },
  {
    id: 'instagram',
    label: 'Continue with Instagram',
    helper: 'Connect your style signals, follows, and saved looks you approve.',
    badge: 'IG'
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    helper: 'Import identity details and shopping interest signals you allow.',
    badge: 'f'
  }
];

const trustHighlights = [
  'Personalized styling based on the looks, brands, and creators you actually engage with.',
  'Transparent deal matching so users can compare price, shipping, and fit rationale in one place.',
  'Consent-first onboarding that makes data use clear before anything is connected.'
];

const consentPoints = [
  'Profile basics and verified account identity',
  'Liked looks, saved items, and followed creators you approve',
  'Shopping intent signals used to explain recommendations and deal comparisons'
];

const initialForm = {
  name: '',
  email: '',
  password: ''
};

const providerNames = {
  email: 'Email',
  google: 'Google',
  instagram: 'Instagram',
  facebook: 'Facebook'
};

function App() {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState(initialForm);
  const [consentChecked, setConsentChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [session, setSession] = useState(null);

  const isSignup = mode === 'signup';
  const personalizedProfile = {
    ...userProfile,
    name: session?.name || userProfile.name
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const openSession = (provider) => {
    setSession({
      provider,
      mode,
      name: form.name || userProfile.name,
      email: form.email || 'alex@stylish.app',
      marketingChecked,
      consentChecked: true
    });
    setStatusMessage('');
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();

    if (!consentChecked) {
      setStatusMessage(
        `Please confirm data consent before ${isSignup ? 'creating an account' : 'signing in'}.`
      );
      return;
    }

    openSession('email');
  };

  const handleSocialAuth = (provider) => {
    if (!consentChecked) {
      setStatusMessage(`Please confirm data consent before connecting ${providerNames[provider]}.`);
      return;
    }

    openSession(provider);
  };

  const handleReset = () => {
    setSession(null);
    setStatusMessage('');
    setForm(initialForm);
    setConsentChecked(false);
    setMarketingChecked(false);
  };

  return (
    <div className="page-shell">
      {session ? (
        <main className="dashboard-shell">
          <section className="hero-banner">
            <div className="hero-banner-copy">
              <p className="eyebrow eyebrow-light">Consent Captured</p>
              <h1>
                {session.mode === 'signup'
                  ? 'Your style studio is ready.'
                  : 'Your personalized style feed is waiting.'}
              </h1>
              <p>
                Signed in with {providerNames[session.provider]}. Stylish can now use the
                approved signals to build recommendations, explain why each item fits,
                and surface better deals across stores.
              </p>
            </div>

            <div className="hero-banner-stats">
              <div>
                <span className="stat-label">Connected Source</span>
                <strong>{providerNames[session.provider]}</strong>
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
              <ProfileCard user={personalizedProfile} />

              <section className="card permission-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Permission Snapshot</p>
                    <h2>What Stylish can use</h2>
                  </div>
                </div>

                <p className="section-copy">
                  These approved signals help the app personalize recommendations and
                  keep the reasoning visible to the user.
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
                    ? 'Price-drop alerts and trend recaps are enabled for this account.'
                    : 'Promotional alerts are still off, so only core personalization is active.'}
                </p>
              </section>
            </div>

            <RecommendationList items={recommendations} />
          </section>
        </main>
      ) : (
        <main className="auth-layout">
          <section className="intro-panel">
            <div className="glow glow-one" />
            <div className="glow glow-two" />

            <div className="intro-copy">
              <span className="brand-pill">Stylish Beta</span>
              <p className="eyebrow">AI Styling, But Transparent</p>
              <h1>Turn social taste into a consent-first fashion profile.</h1>
              <p className="lead-copy">
                Stylish helps users connect the accounts they trust, explain what data is
                being used, and convert that signal into personalized fashion matches with
                store-by-store deal comparison.
              </p>
            </div>

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
                <span className="signal-chip">Saved looks</span>
                <span className="signal-chip">Favorite creators</span>
                <span className="signal-chip">Budget range</span>
                <span className="signal-chip">Brand affinity</span>
                <span className="signal-chip">Fit preferences</span>
                <span className="signal-chip">Wishlist intent</span>
              </div>
            </section>
          </section>

          <section className="auth-panel">
            <div className="auth-panel-inner">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Account Access</p>
                  <h2>{isSignup ? 'Create a new account' : 'Sign in to continue'}</h2>
                </div>
              </div>

              <p className="section-copy">
                Let users continue with email or connect a social account while clearly
                approving how their data will be used.
              </p>

              <div className="mode-switch" role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  className={`mode-button ${isSignup ? 'is-active' : ''}`}
                  onClick={() => setMode('signup')}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  className={`mode-button ${!isSignup ? 'is-active' : ''}`}
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </button>
              </div>

              <div className="social-auth-grid">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className="social-button"
                    onClick={() => handleSocialAuth(provider.id)}
                  >
                    <span className={`social-badge ${provider.id}`}>{provider.badge}</span>
                    <span className="social-copy">
                      <strong>{provider.label}</strong>
                      <small>{provider.helper}</small>
                    </span>
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
                    />
                  </label>

                  <label className="field">
                    <span>Password</span>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFieldChange}
                      placeholder="••••••••"
                      required
                    />
                  </label>
                </div>

                <section className="consent-card">
                  <div>
                    <p className="eyebrow">User Consent</p>
                    <h3>Data use approval</h3>
                    <p className="section-copy">
                      Before continuing, users must approve the signals Stylish can use to
                      personalize recommendations and explain shopping decisions.
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
                    />
                    <span>
                      Send optional trend updates, price-drop alerts, and editorial picks.
                    </span>
                  </label>
                </section>

                <p className={`form-feedback ${statusMessage ? 'is-visible' : ''}`}>
                  {statusMessage ||
                    'Users can disconnect Google, Instagram, or Facebook later in account settings.'}
                </p>

                <button type="submit" className="primary-button">
                  {isSignup ? 'Create account' : 'Sign in'}
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
