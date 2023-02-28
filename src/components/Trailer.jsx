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
    const [playing, setPlaying] = useState(false);


    useEffect(() =>{
        const setMovieId = () => {
            api =  api.replace('trailerId', movieId);
            api =  api.replace('typeId', type);
        }

        const randomTrailer = (start, end) =>{
          const range = end - start;
          const number = Math.floor(Math.random() * range) + start;
          return number;
      }

        const getData = async () => {
          try {
            await axios.get(api).then((response)=>{
              console.log(response.data.results)
              if(response.data.results.length === 0){
                  setKeyTrailer('57FeEHKai0g')
              }
              else
              {
                  const index = randomTrailer(0, response.data.results.length - 1)
                  setKeyTrailer(response.data.results[index].key);
              }
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
    
    const handleOnReady = () => {
      setPlaying(true);
    };


if (isLoading) {
    return <div className="App">Loading...</div>;
    }
  return (
  <div className='w-full h-full flex justify-center items-center'>
    {isError ? 
        <video id='videoTrailer' autoPlay loop className='w-full h-full object-cover'>
            <source src='./videos/LastOfUs.mp4' type="video/mp4"></source>
        </video>
      :
      
      <ReactPlayer
      className='iframe'
      controls={false}
      muted={props.muted}
      width={props.width}
      height={props.height}
      playing={playing}
      onReady={handleOnReady}
      url={youtubeUrl}
      config={{ youtube: { playerVars: { disablekb: 1, modestbranding: 0 } } }} />
    }
  </div>
    
    
  )
}
