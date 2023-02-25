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
    title:'Top Rated',
    fetchURL: request.requestTopRated,
  },
  {
    id:3,
    title:'Trending',
    fetchURL: request.requestTrending,
  }
  
]

const MainObject = [
  {
    id:110316,
    logoImage : './images/AliceLogo.png', 
    videosUrl: './videos/Alice.mp4',
    api: request.requestTvById,
    type: 'netflixSeries'
  }
]

const TvShowsPage = () => {
  
  return (
    <div className='relative'>
      {MainObject.map((item) => (
        <Main id={item.id} type={item.type} logo={item.logoImage} video={item.videosUrl} key={item.id} api={item.api}/>
      ))}
      
      <div className='relative'>
        <div className='mt-[-200px]'>
          {Row.map((item) => (
              <MovieList title={item.title} fetchURL={item.fetchURL} id={item.id} key={item.id} type='tv'/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TvShowsPage;