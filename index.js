const {
  addonBuilder,
  serveHTTP,
  publishToCentral,
} = require("stremio-addon-sdk");
const fs = require("fs");

// Lê o arquivo output.json
let movieData = [];
try {
  const data = fs.readFileSync("./all.json", "utf8");
  movieData = JSON.parse(data); // Converte o JSON para um array
} catch (err) {
  console.error("Erro ao ler all.json:", err);
}

const builder = new addonBuilder({
  id: "org.moviesaddon",
  version: "1.0.0",
  name: "Add-on de Filmes",
  catalogs: [],
  resources: ["stream"], // Suporte apenas para streams
  types: ["movie", "series"], // Adiciona suporte a filmes
  idPrefixes: ["tt"], // Prefixos baseados no IMDb
});

// Handler de Streams
builder.defineStreamHandler(function (args) {
  console.log(`Solicitado stream para o ID: ${args.id}`);

  // Busca o filme correspondente no arquivo JSON

  if (args.type === "movie") {
    const movies = movieData.filter((item) => item.imdb_id === args.id);

    const newMovies = movies.map((serie) => ({
      ...serie,
      title: serie.language === "portuguese" ? "🇧🇷" : "🇺🇸",
    }));

    return Promise.resolve({ streams: newMovies });
  } else {
    const [id, temp, episode] = args.id.split(":");

    const series = movieData.filter(
      (item) =>
        item.imdb_id == id && item.season == temp && item.episode == episode
    );

    const newSeries = series.map((serie) => ({
      ...serie,
      title: serie.language === "portuguese" ? "🇧🇷" : "🇺🇸",
    }));

    return Promise.resolve({ streams: newSeries });
  }
});

// Inicia o servidor
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
publishToCentral(
  "https://stremio-addon-production.up.railway.app/manifest.json"
);
