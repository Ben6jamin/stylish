import React from 'react';

const providerLabels = {
  email: 'Email',
  google: 'Google',
  instagram: 'Instagram',
  facebook: 'Facebook'
};

function ProfileCard({ user }) {
  if (!user) {
    return null;
  }

  return (
    <section className="card profile-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Style Profile</p>
          <h2>Customer snapshot</h2>
        </div>
      </div>

      <div className="profile-grid">
        <article className="profile-fact">
          <p className="profile-label">Name</p>
          <strong className="profile-value">{user.name}</strong>
        </article>

        <article className="profile-fact">
          <p className="profile-label">Budget</p>
          <strong className="profile-value">{user.budget}</strong>
        </article>

        <article className="profile-fact">
          <p className="profile-label">Preferred style</p>
          <strong className="profile-value">{user.favoriteStyle}</strong>
        </article>

        <article className="profile-fact">
          <p className="profile-label">Mood</p>
          <strong className="profile-value">Polished, social, and wearable</strong>
        </article>
      </div>

      <div className="taste-stack">
        <p className="profile-label">Inspired by</p>
        <div className="profile-chip-group">
          {user.inspiredBy.map((name) => (
            <span key={name} className="profile-chip">
              {name}
            </span>
          ))}
        </div>
      </div>

      {user.connectedProviders?.length ? (
        <div className="taste-stack">
          <p className="profile-label">Connected sources</p>
          <div className="profile-chip-group">
            {user.connectedProviders.map((provider) => (
              <span key={provider} className="profile-chip source-chip">
                {providerLabels[provider] || provider}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProfileCard;
