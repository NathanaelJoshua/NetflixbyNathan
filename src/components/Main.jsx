import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import './Main.css'
import ModalContext from '../context/ModalContext';

export const Main = (props) => {

    //modal context
    const { showModal } = useContext(ModalContext);
    const LogoImage = props.logo;
    const videoUrl = props.video;
    const movieId = props.id;
    const type = props.type;
    let api = props.api;
    const [movie, setOneMovies] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [onMovieHover, setHover] = useState(0);
    const [isSoundOn, setSound] = useState(true);

    const setMovieId = () => {
        api =  api.replace('movieId', movieId);
    }

    const getData = async () => {
        await axios.get(api).then((response)=>{
            setOneMovies(response.data);
            setLoading(false);
        });
    };
    useEffect(() =>{
        setMovieId();
        getData();
    },[api]);

    const SoundHandler = () => {
        const vid = document.getElementById('videoTrailer');
        if(isSoundOn === true) 
        {
            vid.muted = true;
            setSound(false);
        }
        else {
            vid.muted = false;
            setSound(true);
        }
    }

    const onHoverHandler=()=>{
        setTimeout(
            () => setHover(1), 
            500
          );
    }
    const onLeaveHandler=()=>{
        setTimeout(
            () => setHover(0), 
            500
          );
    }

    const limitText = (str, num) => {
        if(str.length > num){
            return str.slice(0, num) + '...';
        }
        else return str;
    }

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }
    return (
        <div className='relative w-full h-[800px] text-white' onMouseEnter={onHoverHandler} onMouseLeave={onLeaveHandler}>
            <div className='w-full h-full'>
                <div className='absolute w-full bg-gradient-to-t from-black  h-[800px] pl-[50px] flex items-end pb-[300px] justify-between'>
                    <div className='flex flex-col align-baseline justify-start'>
                        {onMovieHover === 1 ? 
                        <div className='text-white text-start opacity-0 lg:w-[40%] md:w-[60%] xs:w-[90%] mb-5'>
                            {limitText(movie.overview,200)}
                        </div>
                        :<div className=' duration-1000'/>}
                        
                        <div className=' lg:w-[80%] md:w-[85%] xs:w-[90%] mb-5 duration-500'>
                            {type === 'tv' ? 
                            <img  className='h-10' src="./NetflixbyNathan/images/NetflixSeries.png" alt="NetflixSeriesLogo"/>
                            : <div></div> }
                            <img  className='w-[500px]' src={LogoImage} alt={movie.title}/>
                        </div>
                        
                        {onMovieHover === 0 ? 
                        <div className='text-white text-start lg:w-[40%] md:w-[60%] xs:w-[90%] mb-5 duration-1000'>
                            {limitText(movie.overview,200)}
                        </div>
                        :<div className=' duration-1000'/>}

                        <div className='flex justify-start item-end'>
                            <button className='bg-white p-3 text-black rounded-md py-2 px-6 font-semibold flex items-center'> 
                                <FaPlay /> 
                                <span className='ml-3'>Play</span>
                            </button>
                            <button onClick={() => showModal(movieId, type)} className='ml-3 bg-gray-500/50 p-3 text-white rounded-md py-2 px-6 font-semibold flex items-center'>
                                <AiOutlineInfoCircle/>
                                <span className='ml-3'>More Info</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className='flex items-center'>
                        <div className='rounded-full mr-3 text-lg outline outline-2 outline-white p-3 cursor-pointer' onClick={SoundHandler}>
                            {isSoundOn === true ?
                                <HiOutlineSpeakerWave/>
                            :
                                <HiOutlineSpeakerXMark/>
                            }
                            
                        </div>
                        <div className='pr-8 py-1 pl-2 border-l-2 text-lg bg-gray-500/50'>
                            16+
                        </div>
                    </div>
                </div>
                <div className='w-full h-full'>
                {onMovieHover === 0 ? 
                    <img className='w-full h-full object-cover' src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt={movie.title}/>
                    
                    : 
                    <video id='videoTrailer'autoPlay loop className='w-full h-full object-cover'>
                        <source src={videoUrl} type="video/mp4"></source>
                    </video>}
                </div>
            </div>
        </div>
    )
}