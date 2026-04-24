import ProfileCard from './components/ProfileCard';
import RecommendationList from './components/RecommendationList';
import { userProfile, recommendations } from './data/mockData';

function App() {
  return (
    <main className="container">
      <header>
        <h1>Stylish — AI Fashion Match Demo</h1>
        <p>
          Starter React view for social-style recommendations and cross-store
          deal comparison.
        </p>
      </header>

      <ProfileCard user={userProfile} />
      <RecommendationList items={recommendations} />
    </main>
  );
}

export default App;