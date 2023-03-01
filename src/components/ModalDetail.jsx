import axios from 'axios';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import {  FaPlay } from 'react-icons/fa';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import { SlArrowDown, SlArrowUp, SlLike } from 'react-icons/sl';
import { VscAdd, VscCheck, VscChromeClose } from 'react-icons/vsc';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import request from '../Request';
import { SimilarMovies } from './SimilarMovies';
import { Trailer } from './Trailer';

export const ModalDetail = (props) => {
    // user
    const {user} = UserAuth();
    const [userMovieList, setUserMovieList] = useState([]);
    const userDb = doc(db, 'users', `${user?.email}`);

    // UI status
    const [moviePlay, setMoviePlay] = useState(false);
    const [isExistInList, setExistInList] = useState(false);
    const [isSoundOn, setSound] = useState(true);
    const [isLoad, setLoad] = useState(true);
    const [isSimilarMovieExpand, setSimilarMovieExpand] = useState(false);
    const [show, setShow] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [animation, startAnimation] = useState(false);
    const scrollRef = useRef(null);

    // item parameter
    const id = props.id;
    const type = props.type;
    const [cast, setCast] = useState([]);
    const [vote, setVote] = useState();
    const [genre, setGenre] = useState([]);
    const [image, setImage] = useState();
    const [title, setTitle] = useState();
    const [release, setRelease] = useState('');
    const [runtime, setRunTime] = useState('');
    const [desc, setDesc] = useState('')
    const [similarItem, setSimilarItem] = useState([]);
    const [age, setAge] = useState('13+');
    const [movieObject, setMovieObject] = useState();
    
    // api list
    let apiCredit = request.requestCredit;
    let apiItem = request.requestItemById;
    let apiSimilar = request.requestSimilar;
    
    // data setup
    useEffect(()=>{
        onSnapshot(doc(db, 'users',`${user?.email}`), (doc)=>{
            setUserMovieList(doc.data()?.savedShows);
        });  

        const editApi = (api, type, id) =>{
            api = api.replace('#type#', type);
            api = api.replace('#id#', id);
            
            return api;
        }

        const getCreditData = async ( ) =>{
            await axios.get(apiCredit).then((response)=>{
                setCast(response.data.cast);
            });
        }

        const getSimilarData = async ( ) =>{
            await axios.get(apiSimilar).then((response)=>{
                setSimilarItem(response.data.results);
            });
        }

        const getItemData = async ( ) =>{
            await axios.get(apiItem).then((response)=>{
                let v = 0;
                let duration = '';
                const data = response.data;

                setMovieObject(data)

                //set Vote
                v = Math.floor(data.vote_average*10) +'% Match'
                setVote(v);

                //set Genre
                setGenre(data.genres)

                //set Image
                setImage(data.backdrop_path)

                //set Title
                if(data.title) setTitle(data.title)
                else setTitle(data.name)

                //set Release
                if(data.first_air_date) setRelease((data.first_air_date).slice(0,4))
                else setRelease((data.release_date).slice(0,4))

                //set Description
                setDesc(data.overview);

                //set Runtime
                if(type === 'tv'){
                    duration = data.seasons.length + ' Season';
                    if(data.seasons.length > 1){
                        duration += 's'
                    }
                    setRunTime(duration);
                }
                else{
                    duration = data.runtime;
                    const hour = Math.floor(duration / 60);
                    const minutes = (duration - (hour*60));
                    
                    if(minutes === 0){
                        duration = hour + 'h'
                    }
                    else if(hour === 0){
                        duration = minutes + 'm'
                    }
                    else{
                        duration = hour + 'h ' + minutes + 'm'
                    }
                    setRunTime(duration);
                }
                
            });
        }

        const handleMoviePlay = () => {
            setTimeout(()=>{
                setMoviePlay(true)
            },3000)

            setTimeout(()=>{
                startAnimation(true)
            },2000)

            setTimeout(()=>{
                setMoviePlay(false)
            },22000)
            
            setTimeout(()=>{
                startAnimation(false)
            },23000)
        }
        
        // random age
        const randomAge = (start, end) =>{
            const range = end - start;
            const age = Math.floor(Math.random() * range) + start;
            setAge(age);
        }
            
        apiCredit = editApi(apiCredit, type, id);
        apiItem = editApi(apiItem, type, id);
        apiSimilar = editApi(apiSimilar, type, id);

        getCreditData();
        getItemData();
        getSimilarData();
        randomAge(13,20);

        //open modal animation
        setTimeout(()=> setShow(true),500);
        setLoad(false);
        handleMoviePlay();
    },[id])

    // user movie list from db setup
    useEffect(()=>{
        if(userMovieList){
            if(userMovieList.some(obj => obj.item.id === id) ) setExistInList(true);
        }
    },[userMovieList])

    useEffect(() => {
        if (isScrolled) {
          scrollRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          setIsScrolled(false);
        }
      }, [isScrolled]);

    //button handler
    const SoundHandler = () => {
        setSound(!isSoundOn)
    }

    const ExpandHandler = () => {
        setSimilarMovieExpand(!isSimilarMovieExpand);
    }

    const AddListHandler = async () => {
        if(isExistInList === false){
            setExistInList(true);
            await updateDoc(userDb, {
                savedShows: arrayUnion({
                    type: type,
                    item: movieObject
                })
            })
        }
        else{
            setExistInList(false);
            deleteMovieonDB(id);
        }
    }

    const closeModalHandler = () => {
        setShow(false);
        setTimeout(()=> props.onClose(),500)
    }

    // delete movie list on db
    const deleteMovieonDB = async (id) =>{
        try {
            const result = userMovieList.filter((item) => item.item.id !== id)
            await updateDoc(userDb, {
                savedShows: result
            })
            
        } catch (error) {
            console.log(error);
        }
    }
    
    
    if(isLoad){
        return ''
    }
  return (
    <div className="fixed z-100 left-0 top-0 w-full h-screen overflow-y-scroll overflow-x-hidden bg-black/70">
        <div className={`relative bg-[#141414] rounded-md sm:w-[90%] md:w-[80%] lg:w-[60%] mx-auto mt-[5%] overflow-clip transition-all duration-500 ease-in-out ${show ? 'opacity-100' : 'opacity-0'}`}>

            {/* top */}
            <div className=' w-full h-[500px]'>
                <div className='absolute w-full bg-gradient-to-t from-[#141414] h-[500px] p-10 flex justify-between'>
                        
                    <div className='flex items-start justify-end flex-col'>
                        <div className='text-start text-white text-3xl font-semibold my-5'>
                            {title}
                        </div>
                        <div className='flex flex-row h-max'>
                            <button className='bg-white p-3 h-max text-black rounded-md py-2 px-6 font-semibold flex items-center'> 
                                <FaPlay /> 
                                <span className='ml-3'>Play</span>
                            </button>
                            <div onClick={AddListHandler} className='flex justify-center items-center rounded-full outline outline-2 p-3 mx-4 cursor-pointer hover:text-white text-gray-300'>
                                {isExistInList ? <VscCheck/> : <VscAdd/>}
                            </div>
                            <div className='flex justify-center items-center rounded-full outline outline-2 p-3 cursor-pointer hover:text-white text-gray-300'>
                                <SlLike/>
                            </div>
                        </div>
                        
                    </div>

                    <div className='text-white flex flex-col justify-between'>
                        <div className='rounded-full mr-3 text-xl bg-black p-3 cursor-pointer h-max' onClick={closeModalHandler}>
                            <VscChromeClose/>
                        </div>
                        <div className='rounded-full mr-3 text-lg outline outline-2 outline-white p-3 cursor-pointer h-max' onClick={SoundHandler}>
                            {isSoundOn?
                                <HiOutlineSpeakerWave/>
                            :
                                <HiOutlineSpeakerXMark/>
                            }
                            
                        </div>
                    </div>

                </div>
                <div className='w-full h-full bg-[#141414] overflow-hidden'>
                    {moviePlay ?
                        <Trailer movieId={id} width={'200%'} type={type} height={'200%'} muted={!isSoundOn}/> : 
                        <img className={`w-full h-full object-cover transition duration-500 ${!animation ? 'opacity-100' : 'opacity-0'}`} src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
                    }
                </div>
            </div>
            {/* mid */}
            <div className='p-10 flex text-white columns-2'>
                <div className='flex flex-col w-[60%]'>
                    <div className='flex gap-2 text-md text-white mb-3 items-center py-3'>
                        <div className='text-green-500 font-semibold'>
                            {vote}
                        </div>
                        <div className='text-white font-semibold'>
                            {release}
                        </div>
                        <div className='px-2 outline outline-white outline-[0.01px] flex'>
                            {age}+
                        </div>
                        <div className=''>
                            {runtime}
                        </div>
                        <div className='px-1 outline outline-white outline-[0.2px] text-xs h-max'>
                            HD
                        </div>
                    </div>
                    <div className='text-white text-start'>
                        {desc}   
                    </div>
                </div>
                <div className='w-[40%] text-start pl-10'>
                    {/* Cast */}
                    <div className='flex flex-wrap gap-1'>
                        <p className='a text-gray-500'>
                            Cast: 
                        </p>
                        {cast.slice(0,3).map((c, index) => (
                            <p className='text-white cursor-pointer hover:underline' key={index}>
                                {c.name},
                            </p>
                        ))}
                        <p className='text-white cursor-pointer hover:underline italic' onClick={() => setIsScrolled(true)}>
                            more
                        </p>
                    </div> 

                    {/* Genres */}
                    <div className='flex flex-wrap gap-1 my-5    '>
                        <p className='a text-gray-500'>
                            Genres: 
                        </p>
                        {genre.map((g, index) => (
                            <p className='text-white cursor-pointer hover:underline' key={index}>
                                
                                {index === genre.length-1 ?
                                <p>{g.name}</p>
                                    :
                                <p>{g.name},</p>
                                }
                                
                            </p>
                         ))}
                    </div> 
                </div>
            </div>
            {/* similar movies */}
            <div className='p-10'>
                <div className='text-white text-2xl font-semibold text-start pb-5'>
                    More Like This
                </div>
                <div className={isSimilarMovieExpand ?  'grid grid-cols-3 gap-4 transition duration-500 mb-20' : 'grid grid-cols-3 gap-4 h-[1100px] overflow-y-clip transition duration-500'}>
                    {similarItem.slice(0,17).map((item,index) => (
                        <SimilarMovies itemId={item.id} key={index} type={type}/>
                    ))}
                </div>
                <div className='w-full flex justify-end items-center relative flex-col -mt-5'>
                    <div className='flex justify-end items-center flex-col'>
                        <div className='h-20 bg-gradient-to-t from-[#141414] w-full absolute'/>
                        <hr className='border border-white w-full absolute'/>
                    </div>
                    <div className='flex justify-center -mt-5'>
                        <div onClick={ExpandHandler} className='absolute flex justify-center bg-black/80 items-center rounded-full outline outline-2 p-3 cursor-pointer hover:text-white text-gray-300 w-max'>
                            {!isSimilarMovieExpand ? <SlArrowUp/> : <SlArrowDown/>}
                            
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-10' ref={scrollRef}>
                <div className='text-white text-2xl font-semibold text-start py-5'>
                    About {title}
                </div>
                <div>
                    {/* Cast */}
                    <div className='flex flex-wrap overflow-x-scroll whitespace-nowrap scrollbar-hide gap-1'>
                        <p className='a text-gray-500'>
                            Cast: 
                        </p>
                        {cast.slice(0,10).map((c, index) => (
                            <p className='text-white cursor-pointer hover:underline' key={index}>
                                {index === genre.length-1 ?
                                <p>{c.name}</p>
                                    :
                                <p>{c.name},</p>
                                }
                            </p>
                        ))}
                    </div> 

                    {/* Genres */}
                    <div className='flex flex-wrap gap-1 my-2    '>
                        <p className='a text-gray-500'>
                            Genres: 
                        </p>
                        {genre.map((g, index) => (
                            <p className='text-white cursor-pointer hover:underline' key={index}>
                                
                                {index === genre.length-1 ?
                                <p>{g.name}</p>
                                    :
                                <p>{g.name},</p>
                                }
                                
                            </p>
                         ))}
                    </div> 

                    {/* Age */}
                    <div className='flex flex-wrap gap-1 my-2'>
                        <p className='text-gray-500'>
                            Maturity Rating: 
                        </p>

                        <div className='px-2 text-white mx-3 outline outline-white outline-[0.01px] w-max'>
                            {age}+
                        </div>

                        <div className='text-white'>
                            Recommended for ages {age} and up
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
