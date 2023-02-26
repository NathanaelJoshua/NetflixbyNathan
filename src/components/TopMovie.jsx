import axios from 'axios';
import React, { useEffect, useState } from 'react'
import request from '../Request';
import { MovieHover } from './MovieHover';

export const TopMovie = (props) => {
    const [onMovieHover, setHover] = useState(0);
    const [genre, setGenre] = useState('');
    const [isLoading, setLoading] = useState(true);
    let api = request.requestGenre;
    const title = props.movie.title;
    const type = props.type;
    const image = props.movie.poster_path;
    const top = props.idx + 1;
    const movieWidth = props.width;
    const imageTop = '../NetflixbyNathan/images/NumberTop/' + top +'.png'
    
    
    const changeTypeUrl = () =>{
      api = api.replace('typeId', type);
    }
    
    const onHoverHandler=()=>{
      setHover(1)
    }
    const onLeaveHandler=()=>{
      setHover(0)
    }

    useEffect(() =>{
  
      const getData = async () => {
          await axios.get(api).then((response)=>{
              setGenre(response.data);
              setLoading(false);
          });
      };
      
        changeTypeUrl();
        getData();
    },[api]);
  
    if(isLoading){
      return ''
    }
    return (
      <div className='inline-block' style={{width: movieWidth}}>
        <div className='pr-1 flex relative' style={{width: movieWidth}} onMouseLeave={onLeaveHandler} onMouseEnter={onHoverHandler}>
            <div>
                <img className='ml-[30px] h-full object-fill' src={imageTop} alt={title}/>
            </div>
            <img className='object-cover cursor-pointer rounded-sm' style={{width: movieWidth/2}} src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
            {onMovieHover === 1 ? 
                <MovieHover genre={genre}  movie={props.movie}  width={movieWidth} type={type} index={props.index} movieCount={props.movieCount} crntIndx={props.crntIndx}/>
                :
                <div/>  
            }
        </div>
        
    </div>
        
    )
}
