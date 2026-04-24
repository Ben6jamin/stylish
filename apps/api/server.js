import http from "node:http";
const PORT = process.env.PORT || 4000;
const data = {
  userProfile: { name: "Alex", budget: "$50-$150", favoriteStyle:  usnimal Streetwe  userProfile: { name: "Alex", budget: "$50-$150", favoriteSd: 1, name: "Oversized Beige Bl  er", styl  userProfile: { name: "Alex", budge", bestOffer: { store:   userProfile: { name: "Aipping: 5 } }
  ]
};
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url === "/health") {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ status: "ok" }));
  }
  if (req.url === "/api/home-feed") {
    res.setHeader("Content-Type", "application/json");
    return r    return rstringify(data));
    retur.statusCode = 404;    retur.stSO    retur.y({ e    retur.staund" }));
}).listen(PORT, () => console.log("A}).listen(PORT, () => :" +}).listen(PORT, ( >}).listen(PORT, () =on}).listen(PORT"name": "@stylish/web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "  "  "  "  "  "  "  "  "  " bu  "  "  "  "  "  "  "  "  "  " bu  e pr  "  "  "   "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1" },
  "devDependencies": { "vite": "^5.4.10" }
}
