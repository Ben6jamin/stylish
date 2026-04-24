import React from 'react';

function RecommendationList({ items }) {
  if (!items?.length) {
    return (
      <section className="card recommendations-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Personalized Feed</p>
            <h2>AI recommendations and best deals</h2>
          </div>
        </div>

        <p className="section-copy">
          Sign in successfully and Stylish will load your personalized recommendations here.
        </p>
      </section>
    );
  }

  return (
    <section className="card recommendations-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Personalized Feed</p>
          <h2>AI recommendations and best deals</h2>
        </div>
      </div>

      <ul className="recommendation-list">
        {items.map((item) => {
          const totalCost = item.bestOffer.price + item.bestOffer.shipping;

          return (
            <li key={item.id} className="recommendation-item">
              <div className="recommendation-topline">
                <span className="match-pill">{item.styleMatch}% match</span>
                <span className="store-pill">{item.bestOffer.store}</span>
              </div>

              <h3>{item.name}</h3>
              <p className="recommendation-reason">{item.reason}</p>
              {item.signal ? <p className="recommendation-signal">{item.signal}</p> : null}

              <div className="deal-row">
                <div>
                  <p className="deal-label">Best available total</p>
                  <strong className="deal-total">${totalCost}</strong>
                </div>

                <p className="deal-breakdown">
                  ${item.bestOffer.price} item + ${item.bestOffer.shipping} shipping
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RecommendationList;
