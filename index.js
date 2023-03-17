require('dotenv').config();
const PORT = process.env.PORT || 5000;
const Application = require('./src/framework/application');
const movieRouter = require('./src/routers/movie-router');
const genreRouter = require('./src/routers/genre-router');
const jsonParser = require('./src/framework/parseJson');
const parseUrl = require('./src/framework/parseUrl');

const app = new Application();

app.use(jsonParser);
app.use(parseUrl(`http://localhost:${PORT}`));


app.addRouter(movieRouter);
app.addRouter(genreRouter);

const start = () => {
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
}

start();