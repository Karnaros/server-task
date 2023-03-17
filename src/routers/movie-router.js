const Router = require('../framework/router');
const controller = require('../controllers/movie-controller');
const router = new Router()

router.get('/movies', controller.getMovies);

router.post('/movies', controller.createMovie);

router.put('/movies', controller.updateMovie);

router.delete('/movies', controller.deleteMovie);

module.exports = router;
