import { Main } from '../components/Main'
import { MovieList } from '../components/MovieList'
import request from '../Request'

const Row = [
  {
    id:1,
    title:'Popular',
    fetchURL: request.requestPopular,
  },
  {
    id:2,
    title:'Latest',
    fetchURL: request.requestLatest,
  },
  {
    id:3,
    title:'Top Rated',
    fetchURL: request.requestTopRated,
  },
  {
    id:4,
    title:'Top 10 Movie',
    fetchURL: request.requestUpcoming,
  },
  {
    id:5,
    title:'Trending',
    fetchURL: request.requestTrending,
  }
  
]

const MainObject = [
  {
    id:335787,
    logoImage : './images/UnchartedLogo.png', 
    videosUrl: './videos/Uncharted.mp4',
    api: request.requestMovieById
  }
]

const MoviesPage = () => {
  return (
    <div className='relative'>
      {MainObject.map((item) => (
        <Main id={item.id} logo={item.logoImage} video={item.videosUrl} key={item.id} api={item.api}/>
      ))}
      <div className='relative'>
        <div className='mt-[-200px]'>
          {Row.map((item) => (
              <MovieList title={item.title} fetchURL={item.fetchURL} id={item.id} key={item.id} type='movie'/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MoviesPage;