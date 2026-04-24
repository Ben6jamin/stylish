function RecommendationList({ items }) {
  return (
    <section className="card">
      <h2>AI Recommendations + Best Deals</h2>
      <ul className="recommendation-list">
        {items.map((item) => {
          const totalCost = item.bestOffer.price + item.bestOffer.shipping;

          return (
            <li key={item.id} className="recommendation-item">
              <h3>{item.name}</h3>
              <p><strong>Style Match:</strong> {item.styleMatch}%</p>
              <p><strong>Why this item:</strong> {item.reason}</p>
              <p>
                <strong>Best Deal:</strong> {item.bestOffer.store} — ${item.bestOffer.price}
                {' '}+ ${item.bestOffer.shipping} shipping (Total: ${totalCost})
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RecommendationList;