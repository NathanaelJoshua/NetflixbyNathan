import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import request from '../Request';
import './Trailer.css'

export const Trailer = (props) => {
    let [keyTrailer, setKeyTrailer] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const type = props.type;
    const [isLoading,setLoading] = useState(true);
    const [isError, setError] = useState(false);
    let api = request.requestTrailer;
    const movieId = props.movie.id;

    const setMovieId = () => {
        api =  api.replace('trailerId', movieId);
        api =  api.replace('typeId', type);
    }

    useEffect(() =>{
        setMovieId();
        getData();
    },[keyTrailer]); 

    const getData = async () => {
      try {
        await axios.get(api).then((response)=>{
          setKeyTrailer(response.data.results[0].key);
          changeYoutubeUrl();
        });
      } catch (error) {
          setError(true);
      }

      
      setLoading(false);
    };

    const changeYoutubeUrl = ( ) =>{
        let urlY = 'https://www.youtube.com/watch?v=';
        urlY += keyTrailer;
        setYoutubeUrl(urlY);
    }


if (isLoading) {
    return <div className="App">Loading...</div>;
    }
  return (
  <div>
{isError ? 
        <video id='videoTrailer' autoPlay loop className='w-full h-full object-cover'>
            <source src='./videos/LastOfUs.mp4' type="video/mp4"></source>
        </video>
      :
      
      <ReactPlayer
      className='iframe'
      playing={true}
      controls={false}
      width={props.width}
      height={'190px'}
      url={youtubeUrl}
      config={{ youtube: { playerVars: { disablekb: 1, modestbranding: 1 } } }} />
    }
  </div>
    
    
  )
}
