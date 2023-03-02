import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Movies } from './Movies';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import './MovieList.css';
import { TopMovie } from './TopMovie';

export const MovieList = (props) => {
  const title = props.title;
  let api = props.fetchURL;
  const idKey = props.id;
  const type = props.type;
  const [movieCount,setMovieCount] = useState(6);
  const [movies, setMovies] = useState([]);
  const [topTen, setTopTen] = useState(false);
  const [totalMovie,setTotalMovie] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [movieWidth, setMovieWidth] = useState(0);
  const [currentIndex, setIndexCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    useEffect(()=>{
        const w = (windowWidth - 100);
        setMovieWidth(w/movieCount);
    });

  const returnTopTen = () => {
    if(title.includes('Top 10')){
        setTotalMovie(10);
        setTopTen(true);
    }
  }
  const slideLeft = () =>{
    var sl = document.getElementById('slider' + idKey);
    let nextIndex = currentIndex - movieCount;
    let scrollLength = 0;
    if(nextIndex >= 0){
        scrollLength = nextIndex*movieWidth;
        setIndexCurrentIndex(nextIndex);
    }
    else{
        scrollLength = (0)*movieWidth;
        setIndexCurrentIndex(0);
    }
    
    sl.style.transform = `translate3d(${-scrollLength}px, 0, 0)`;
  };
  const slideRight = () =>{
        var sl = document.getElementById('slider' + idKey);
        let nextIndex = currentIndex + movieCount;
        let scrollLength = 0;

        if((nextIndex+movieCount) <= totalMovie){
            scrollLength = nextIndex*movieWidth;
            setIndexCurrentIndex(nextIndex);
        }
        else{
            scrollLength = ((totalMovie - nextIndex)*movieWidth) + ((currentIndex)*movieWidth);
            setIndexCurrentIndex(totalMovie-movieCount);
        }
        
        sl.style.transform = `translate3d(-${scrollLength}px, 0, 0)`
  };

  const changeTypeUrl = () =>{
    api = api.replace('typeId', type);
  }

  useEffect(() =>{
    changeTypeUrl();
    const getData = async () => {
        await axios.get(api).then((response)=>{
            setMovies(response.data.results);
            setTotalMovie(response.data.results.length);
            returnTopTen();
            setLoading(false);
        });
    };
      getData();
  },[api]);


  const filteredImageNotNull = movies.filter(m => {
    return m.backdrop_path != null;
  });

  if (isLoading) {
    return <div ></div>;
  }
  return (
    <div className='pb-[40px] group'>
        <div className='py-2 flex text-start ml-[50px]'>
            <span className='text-white font-bold text-xl'>{title}</span>
        </div>
        <div className='flex items-center overflow-x-clip  relative'>
            {currentIndex !== 0 ?
            <MdChevronLeft onClick={slideLeft}  className='text-white bg-black opacity-50 absolute text-xl h-full z-10 cursor-pointer hidden group-hover:block' size={50}/>
            :''
            }

            {!topTen ?
                <div id={'slider' + idKey} className='w-full h-full whitespace-nowrap duration-700 ml-[50px]'>
                    <div className='relative'>
                   
                        {filteredImageNotNull.map((item, index)  => (
                            <Movies key={item.id} movie={item} width={movieWidth} type={type} index={index} crntIndx={currentIndex} movieCount={movieCount}/>
                        ))}
                    </div>
                </div>
            :
                <div id={'slider' + idKey} className='w-full h-full whitespace-nowrap duration-700 ml-[40px]'>
                    <div className='relative'>
                        {movies.slice(0, 10).map((item, index) => (
                            <TopMovie key={item.id} movie={item} width={movieWidth} idx={index} type={type} index={index} crntIndx={currentIndex} movieCount={movieCount}/>
                        ))}
                    </div>
                </div>
            }
            
            {currentIndex !== (totalMovie-movieCount)?
                <MdChevronRight  onClick={slideRight} className='rightSlider text-white bg-black opacity-50 absolute text-xl h-full z-10 cursor-pointer right-0 hidden group-hover:block' size={40}/>
            :
                ''
            }
            </div>
        
    </div>
  )
}
