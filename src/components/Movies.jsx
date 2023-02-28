import axios from 'axios';
import React, { useEffect, useState } from 'react'
import request from '../Request';
import { MovieHover } from './MovieHover';
import './Movies.css'

export const Movies = (props) => {
  const [onMovieHover, setHover] = useState(0);
  const [genre, setGenre] = useState('');
  const [isLoading, setLoading] = useState(true);

  const id = props.movie.id;
  const image = props.movie.backdrop_path;
  let api = request.requestGenre;
  const movieWidth = props.width;
  const type = props.type;    
  let title = props.movie.title;

  const changeTypeUrl = () =>{
    api = api.replace('typeId', type);
  }

  const onHoverHandler=()=>{
    setHover(1);
  }

  const onLeaveHandler=()=>{
    setHover(0)
  }

  useEffect(() =>{
    changeTypeUrl();
    const getData = async () => {
        await axios.get(api).then((response)=>{
            setGenre(response.data);
        });
    };
      
      getData();
      setLoading(false);
  },[id]);



  if (isLoading) {
    return <div></div>;
  }
  return (
    <div className='inline-block opacity-100 z-0 transition-all duration-500' style={{width: movieWidth}}>
      <div className='pr-1 relative' style={{width: movieWidth}} onMouseLeave={onLeaveHandler} onMouseEnter={onHoverHandler}>
        <img className='object-cover cursor-pointer rounded-sm' style={{width: movieWidth}} src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
        {onMovieHover === 1 ? 
          <MovieHover genre={genre} movie={props.movie} width={movieWidth} type={type} searchKey={props.searchKey} 
          index={props.index} movieCount={props.movieCount} crntIndx={props.crntIndx} closeHover={onLeaveHandler}/>
          :
          <div/>  
        }
      </div>
      
  </div>
      
  )
}
