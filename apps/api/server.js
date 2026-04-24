import http from 'node:http';

const PORT = process.env.PORT || 4000;

const payload = {
  userProfile: {
    name: 'Alex',
    budget: '$50 - $150',
    favoriteStyle: 'Minimal Streetwear',
    inspiredBy: ['Zendaya', 'Hailey Bieber']
  },
  recommendations: [
    { id: 1, name: 'Oversized Beige Blazer', styleMatch: 94 },
    { id: 2, name: 'Wide-Leg Black Trousers', styleMatch: 91 }
  ]
};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') return res.end(JSON.stringify({ status: 'ok' }));
  if (req.url === '/api/home-feed') return res.end(JSON.stringify(payload));

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
}).listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});