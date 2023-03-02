import React, { useEffect, useState } from 'react'
import { GrPlayFill } from "react-icons/gr";
import { VscAdd, VscCircleFilled, VscCheck } from "react-icons/vsc";
import { BsChevronDown } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import { Trailer } from './Trailer';
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import axios from 'axios';
import request from '../Request';
import { useContext } from 'react';
import ModalContext from '../context/ModalContext';

export const MovieHover = (props) => {
    const [listMovie, setListMovie] = useState([]);
    const [hoverStyle, setHoverStyle] = useState('')
    const [anim, setAnim] = useState(true);
    const [listClick, setListClick] = useState(false);
    const [load, setLoad] = useState(true);
    const {user} = UserAuth();
    const [multi, setMulti] = useState();
    const [delay, setDelay] = useState(false);
    const movieId = doc(db, 'users', `${user?.email}`);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [runtime, setRunTime] = useState();
    const [bottom, setBottom] = useState('-50%');
    
    // item property
    
    const id = props.movie.id;
    const index = props.index;
    const currentIndex = props.crntIndx;
    const movieCount = props.movieCount;
    const image = props.movie.backdrop_path;
    const title = props.movie.title;
    const type = props.type;
    const [genre, setGenre] = useState([])
    const movieWidth = props.width*multi;
    let apiItem = request.requestItemById;

    //modal context
    const { showModal } = useContext(ModalContext);


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
        const setMultiplier = () =>{
            if(windowWidth<=640){
                setMulti(2)
                setBottom(-50*2 + '%')
                
            }
            else if(windowWidth<=768){
                setMulti(1.8)
                setBottom(-50*1.8 + '%')
            }
            else if(windowWidth<=1024){
                setMulti(1.6)
                setBottom(-50*1.6 + '%')
            }
            else {
                setMulti(1.4);
                setBottom(-50*1 + '%')
            }
            }
        
        setMultiplier()

      },[windowWidth])

    useEffect(()=>{
        let style = '';
        if(props.searchKey){
            if((index+movieCount)%movieCount === 0){
                style = 'absolute left-0 z-10';
                setHoverStyle(style);
            }
            else if (index%movieCount === movieCount-1) {
                style = 'absolute right-0 z-10 ';
                setHoverStyle(style);
            }
            else {
                style = ' absolute z-50 ';
                style += setLeft(multi);
                setHoverStyle(style);
            }
        }
        else {
            if (index === currentIndex) {
                style = 'absolute  my-auto left-0 z-50';
                setHoverStyle(style);
            } 
            else if (index === (currentIndex + movieCount - 1)) {
                style = 'absolute right-0 z-50';
                setHoverStyle(style);
            }
            else {
                style = 'absolute z-50 ';
                style += setLeft(multi);
                setHoverStyle(style);
            }
            
        };
    },[multi])


    const setLeft = (multi) => {
        let style = '';

        if(multi===1.4){
            style = ' left-[-20%] '
            return style;
        }
        else if(multi === 1.6){
            style = ' left-[-30%] '
            return style;
        }
        else if(multi === 1.8){
            style = ' left-[-40%] '
            return style;
        }
        else{
            style = ' left-[-50%] '
            return style;
        }
    }

    const onAddListHandler = async () => {
        if(listClick === false){
            setListClick(true);
            await updateDoc(movieId, {
                savedShows: arrayUnion({
                    type: type,
                    item: props.movie,
                })
            })
        }
        else{
            setListClick(false);
            setAnim(true)
            deleteMovieonDB(id);
        }
    }

    const deleteMovieonDB = async (id) =>{
        try {
            const result = listMovie.filter((item) => item.item.id !== id)
            await updateDoc(movieId, {
                savedShows: result
            })
            
        } catch (error) {
            console.log(error);
        }
    }

    const handlerAnim = () => {
        setTimeout(() => {
            setAnim(false);
          }, 1500);
    }

    const openModalHandler = () => {
        showModal(id, type);
    }

    useEffect(()=>{
        onSnapshot(doc(db, 'users',`${user?.email}`), (doc)=>{
            setListMovie(doc.data()?.savedShows);
        });   
        const editApi = (api, type, id) =>{
            api = api.replace('#type#', type);
            api = api.replace('#id#', id);
            
            return api;
        }
        const getItemData = async ( ) =>{
            await axios.get(apiItem).then((response)=>{
                let duration = '';
                const data = response.data;

                //set Genre
                setGenre(data.genres)

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

        apiItem = editApi(apiItem,type,id);

        getItemData();
        transition();   
        handlerAnim();
        setLoad(false)
    }, [user?.email])


    useEffect(()=>{
        if(listMovie.length !== 0){
            if(listMovie.some(obj => obj.item.id === id) ) setListClick(true);
        }
    },[listMovie])

    const transition = () => {
        setTimeout(()=>{
            setDelay(true)
        },700)
    }
        
    if(load){
        return <div ></div>;
    }
    return (
        <div>
            <div className={hoverStyle} style={{bottom: `${bottom}`}}>
                <div className={delay ? 'duration-500 transition scale-100' : 'scale-0 duration-300 transition' } style={{width: movieWidth}}>
                    <div className='bg-black' style={{width: movieWidth}}>
                        {anim ? <img className='object-cover cursor-pointer rounded-sm ' style={{width: movieWidth}} src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
                        :
                        <div>
                            <Trailer movieId={id} width={movieWidth} type={type} height={'190px'}/>
                        </div>}
                    </div>
                    
                    <div className='p-5 bg-stone-900 w-full whitespace-normal'>
                        <div className='justify-between flex flex-wrap mb-3'>
                            <div className='flex'>
                                <div className='flex justify-center items-center rounded-full text-black bg-white p-3 cursor-pointer'>
                                    <GrPlayFill/>
                                </div>
                                <div className='flex justify-center items-center rounded-full outline outline-2 p-3 mx-2 cursor-pointer hover:text-white text-gray-300' onClick={onAddListHandler}>
                                    {listClick ? <VscCheck/> : <VscAdd/>}
                                </div>
                                <div className='flex justify-center items-center rounded-full outline outline-2 p-3 cursor-pointer hover:text-white text-gray-300'>
                                    <SlLike/>
                                </div>
                                </div>
                            <div className='flex'>
                                <div onClick={openModalHandler} className='flex justify-center items-center rounded-full outline outline-2 p-3 cursor-pointer hover:text-white text-gray-300'>
                                    <BsChevronDown/>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2 text-xs text-white mb-3'>
                            <div className='text-green-500 font-semibold'>
                                New
                            </div>
                            <div className='px-2 outline outline-white outline-[0.2px] '>
                                13+
                            </div>
                            <div className=''>
                                {runtime}
                            </div>
                            <div className='px-1 outline outline-white outline-[0.2px] text-[0.5rem] '>
                                HD
                            </div>
                        </div>

                        <div className='flex flex-row gap-1 flex-wrap'>
                            {genre.slice(0,3).map((g, index) => 
                                {
                                    return (index === 0) ?
                                        <div key={index} className='flex flex-row text-sm text-white items-center'>
                                            <div className='font-semibold text-white '>
                                                {g.name}
                                            </div>
                                        </div>

                                    :

                                    <div key={index} className='flex flex-row text-sm text-white items-center'>
                                        <div className='text-gray-500 text-[0.5rem] mx-1' >
                                                <VscCircleFilled/>
                                            </div>
                                        <div className='font-semibold text-white '>
                                            {g.name}
                                        </div>
                                    </div>
                                }

                                
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    
    )
}
