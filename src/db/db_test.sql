select movie.*, 
array_agg(genre_name) as genres
from movie
left join movie_genre as mg on (movie.id = mg.movie_id)
left join genre on (mg.genre_id = genre.id)
group by movie.id;
