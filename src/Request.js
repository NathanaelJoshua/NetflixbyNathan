const key = 'd8bad17ac9f68bf93ed41b6266fa3b95';

const request = {
    requestPopular: `https://api.themoviedb.org/3/typeId/popular?api_key=${key}&language=en-US&page=1`,
    requestTopRated: `https://api.themoviedb.org/3/typeId/top_rated?api_key=${key}&language=en-US&page=2`,
    requestTrending: `https://api.themoviedb.org/3/trending/typeId/day?api_key=${key}&language=en-US&page=2`,
    requestUpcoming: `https://api.themoviedb.org/3/typeId/upcoming?api_key=${key}&language=en-US&page=1`,
    requestLatest: `https://api.themoviedb.org/3/typeId/now_playing?api_key=${key}&language=en-US&page=2`,
    requestTvShows: `https://api.themoviedb.org/3/tv/popular?api_key=${key}&language=en-US&page=2`,
    requestGenre: `https://api.themoviedb.org/3/genre/typeId/list?api_key=${key}&language=en-US`,
    requestSearch: `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=`,
    requestTrailer: `https://api.themoviedb.org/3/typeId/trailerId/videos?api_key=${key}`,
    requestMovieById: `https://api.themoviedb.org/3/movie/movieId?api_key=${key}&language=en-US`,
    requestTvById: `https://api.themoviedb.org/3/tv/movieId?api_key=${key}&language=en-US`,
    requestCredit: `https://api.themoviedb.org/3/#type#/#id#/credits?api_key=${key}&language=en-US`,
    requestItemById: `https://api.themoviedb.org/3/#type#/#id#?api_key=${key}&language=en-US`,
    requestSimilar: `https://api.themoviedb.org/3/#type#/#id#/recommendations?api_key=${key}`
};


export default request;