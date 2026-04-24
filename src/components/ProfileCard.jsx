function ProfileCard({ user }) {
  return (
    <section className="card">
      <h2>Customer Style Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Budget:</strong> {user.budget}</p>
      <p><strong>Preferred Style:</strong> {user.favoriteStyle}</p>
      <p><strong>Inspired by:</strong> {user.inspiredBy.join(', ')}</p>
    </section>
  );
}

export default ProfileCard;