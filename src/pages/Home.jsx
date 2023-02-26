import { useEffect, useState } from 'react'
import { Main } from '../components/Main'
import { MovieList } from '../components/MovieList'
import { UserAuth } from '../context/AuthContext'
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
    id:60574,
    logoImage : './NetflixbyNathan/images/PeakyBlinders.png', 
    videosUrl: './NetflixbyNathan/videos/PeakyBlinders.mp4',
    api: request.requestTvById,
    type: 'netflixSeries'
  }
]

const Home = () => {
  const {user} = UserAuth();
  const [isLoad, setLoad] = useState(false);

  useEffect(()=>{
    if(user){
      setLoad(true);
    }
  },[user]);

  if(!isLoad){
    return ''
  }
  return (
    <div className='relative'>
      {MainObject.map((item) => (
        <Main id={item.id} logo={item.logoImage} video={item.videosUrl} api={item.api} key={item.id} type={item.type}/>
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

export default Home