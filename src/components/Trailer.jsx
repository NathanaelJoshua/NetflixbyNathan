import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import request from '../Request';

export const Trailer = (props) => {

    // item parameter
    const [keyTrailer, setKeyTrailer] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const type = props.type;
    let api = request.requestTrailer;
    const movieId = props.movieId;

    // UI
    const [isLoading,setLoading] = useState(true);
    const [isError, setError] = useState(false);

    useEffect(() =>{
        const setMovieId = () => {
            api =  api.replace('trailerId', movieId);
            api =  api.replace('typeId', type);
        }

        const getData = async () => {
          try {
            await axios.get(api).then((response)=>{
              setKeyTrailer(response.data.results[0].key);
              changeYoutubeUrl();
            });
          } catch (error) {
              setError(true);
          }
          
        };
        setMovieId();
        getData();
        setLoading(false);
    },[keyTrailer]); 


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
      muted={props.muted}
      width={props.width}
      height={props.height}
      url={youtubeUrl}
      config={{ youtube: { playerVars: { disablekb: 1, modestbranding: 1 } } }} />
    }
  </div>
    
    
  )
}
