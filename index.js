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

    const newUrl = movies.map((movie) => ({
      ...movie,
      url: `http://dnsfixo1.xyz/movie/27529388/22319562/${movie["xui-id"]}.mp4`,
    }));

    return Promise.resolve({ streams: newUrl });
  } else {
    const [id, temp, episode] = args.id.split(":");

    const series = movieData.filter(
      (item) =>
        item.imdb_id == id && item.season == temp && item.episode == episode
    );

    const newUrl = series.map((serie) => ({
      ...serie,
      url: `http://dnsfixo1.xyz/series/27529388/22319562/${serie["xui-id"]}.mp4`,
    }));

    return Promise.resolve({ streams: newUrl });
  }
});

// Inicia o servidor
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
publishToCentral(
  "https://stremio-addon-production.up.railway.app/manifest.json"
);
