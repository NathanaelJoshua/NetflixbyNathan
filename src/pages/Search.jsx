import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Movies } from '../components/Movies';
import useWindowDimensions from '../components/windowDimensions';
import request from '../Request'

export const Search = () => {
  const location = useLocation();  
  const pageMax = 6;
  const pageUrl = '&page=';
  const [movies, setMovies] = useState([]);
  const [filteredMovie, setfilteredMovie] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [movieWidth, setMovieWidth] = useState(0);

  let api = request.requestSearch;
  const queryParams = new URLSearchParams(window.location.search);
  const p = queryParams.get("q");
  const [movieCount,setMovieCount] = useState(6);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [param, setParam] = useState(p);

  const movieWidthFunction = () =>{
    const movieWidth = (width - 100);
    setMovieWidth(movieWidth/movieCount);
    }


  
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
  },[windowWidth]);


  useEffect(() =>{
    const movieItemScroll = () =>{
        if(windowWidth<=640){
            setMovieCount(3)
            }
            else if(windowWidth<=768){
                setMovieCount(4)
            }
            else if(windowWidth<=1024){
                setMovieCount(5)
            }
            else setMovieCount(6);
    
        }
    movieItemScroll();
  },[windowWidth])

   
  const getData = async () => {
    let apiPage;
    let obj = [];
    api += param;
    apiPage = api + pageUrl;
    if(param){
      for(let i=1;i<pageMax;i++){
          apiPage += i;
          await axios.get(apiPage).then((response)=>{
            obj.push(response.data.results);
        });
        apiPage = api + pageUrl;
      }
      setMovies(obj);
      
      setLoading(false);
      }
  };

  useEffect(() =>{
    let objMovieFiltered = [];
    const filterMovie = () => {
      for(let i=0; i<movies.length;i++){
        for(let j=0; j<movies[i].length;j++){
          if(movies[i][j].backdrop_path){
            objMovieFiltered.push(movies[i][j])
          }
        }
      }

      setfilteredMovie(objMovieFiltered);
    }

    filterMovie();
  },[movies]);

  useEffect(() =>{
    movieWidthFunction();
    getData();
  },[param]);

  useEffect(()=>{
    movieWidthFunction()
  });

  useEffect(() => {
    setParam(p);
  }, [location]);


  if (isLoading) {
    return <div></div>;
  }
  return (
    
    <div>
      {filteredMovie.length !== 0 ? 
      <div className='py-[100px] pl-[50px] w-full'>
        <div className='flex pb-3'>
            <div className='text-gray-400 font-normal text-lg mr-2 whitespace-nowrap'>
              Explore titles related to: 
            </div>
            <div className='text-white font-normal flex-wrap text-lg flex flex-row whitespace-nowrap overflow-x-scroll scrollbar-hide'>
                {movies.length?
                    movies[0].slice(0,9).map((item, index) => {
                      return (index === 0) ?
                        <div key={index} className='flex'>
                          {item.name ? 
                          <div>{item.name}</div>
                          
                          :
                          <div>{item.title}</div>}
                  
                        </div>

                        :

                        <div key={index} className='flex'>
                          
                          <div className='mx-2'> | </div>
                          {item.name ? 
                          <div>{item.name}</div>
                          
                          :
                          <div>{item.title}</div>}
                  
                        </div>
                        })
                  : ''
                  }

                
            </div>
              
        </div>
        <div className='flex flex-row flex-wrap'>
            {filteredMovie.map((item,index) => (
              <div className='pb-[50px] relative'  key={index} >
                <Movies movie={item} width={movieWidth} type={item.media_type} movieCount={movieCount} index={index} searchKey='1' />
              </div>
              ))}
        </div>
      </div>

      :
      <div className='h-screen flex flex-col justify-center'>
        <div className='text-white text-3xl font-medium'>No Result Found</div>
        <div className='text-gray-300 mt-3'>
          We couldn't find what you searched for.
          <br/>
          Try searching again.
        </div>
      </div>
      }
    </div>

    
)
}
