import React, { useEffect, useState } from 'react'
import { GrPlayFill } from "react-icons/gr";
import { VscAdd, VscCircleFilled, VscCheck } from "react-icons/vsc";
import { BsChevronDown } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import { Trailer } from './Trailer';
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';

export const MovieHover = (props) => {
    const index = props.index;
    const currentIndex = props.crntIndx;
    const movieCount = props.movieCount;
    const genreId = props.movie.genre_ids;
    const image = props.movie.backdrop_path;
    const title = props.movie.title;
    const type = props.type;
    const genre = props.genre;
    const [genreName, setGenreName] = useState([]);
    const [hoverStyle, setHoverStyle] = useState('')
    const [anim, setAnim] = useState(true);
    const [listClick, setListClick] = useState(false);
    const [load, setLoad] = useState(true);
    const {user} = UserAuth();
    const [multi, setMulti] = useState();
    
    const movieWidth = props.width*multi;
    const [delay, setDelay] = useState(false);
    const [listMovie, setListMovie] = useState([]);
    const movieId = doc(db, 'users', `${user?.email}`);
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
        const setMultiplier = () =>{
            let style = '';
            if(windowWidth<=640){
                setMulti(2)
            }
            else if(windowWidth<=768){
                setMulti(1.8)
            }
            else if(windowWidth<=1024){
                setMulti(1.6)
            }
            else {
                setMulti(1.4);
            }
            }
        
        setMultiplier()

      },[windowWidth])

    useEffect(()=>{
        let style = '';
        if(props.searchKey){
            if((index+movieCount)%movieCount === 0){
                style = 'absolute bottom-[-70%] left-0 z-10';
                setHoverStyle(style);
            }
            else if (index%movieCount === movieCount-1) {
                style = 'absolute bottom-[-70%] right-0 z-10 ';
                setHoverStyle(style);
            }
            else {
                style = ' absolute bottom-[-70%] z-50 ';
                style += setLeft(multi);
                setHoverStyle(style);
            }
        }
        else {
            if (index === currentIndex) {
                style = 'absolute bottom-[-70%] left-0 z-50';
                setHoverStyle(style);
            } 
            else if (index === (currentIndex + movieCount - 1)) {
                style = 'absolute bottom-[-70%] right-0 z-50';
                setHoverStyle(style);
            }
            else {
                style = 'absolute bottom-[-70%] z-50 ';
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
                    movie: props.movie
                })
            })
        }
        else{
            setListClick(false);
            setAnim(true)
            deleteMovieonDB(props.movie.id);
        }
    }

    const deleteMovieonDB = async (id) =>{
        try {
            const result = listMovie.filter((item) => item.movie.id !== id)
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

    useEffect(()=>{
        onSnapshot(doc(db, 'users',`${user?.email}`), (doc)=>{
            setListMovie(doc.data()?.savedShows);
        });
        
        
        const genreHandler = () =>{
            let arr = [];
            for(let i=0;i<genreId.length;i++){
                
                const genreFilter = Array.from(genre.genres).filter(
                    (g) => g.id === genreId[i]
                  );
                  arr.push(genreFilter[0].name);
    
            }
            setGenreName(arr);
            setLoad(false);
        
        }
        const undoClickHandler = () =>{
            if(props.undoClick === true){
                props.hiddenFunction();
            } 
        }
        genreHandler();
        transition();   
        handlerAnim();
        undoClickHandler()
    }, [user?.email])


    useEffect(()=>{
        if(listMovie){
            if(listMovie.some(obj => obj.movie.id === props.movie.id) ) setListClick(true);
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
        <div className={hoverStyle}>
            <div className={delay ? 'duration-500 transition scale-100' : 'scale-0 duration-300 transition' } style={{width: movieWidth}}>
                <div className='bg-black' style={{width: movieWidth}}>
                    {anim ? <img className='object-cover cursor-pointer rounded-sm ' style={{width: movieWidth}} src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
                    :
                    <div>
                        <Trailer movie={props.movie} width={movieWidth} type={type}/>
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
                            <div className='flex justify-center items-center rounded-full outline outline-2 p-3 cursor-pointer hover:text-white text-gray-300'>
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
                            1h 39m
                        </div>
                        <div className='px-1 outline outline-white outline-[0.2px] text-[0.5rem] '>
                            HD
                        </div>
                    </div>

                    <div className='flex flex-row gap-1 flex-wrap'>
                        {genreName.slice(0,3).map((name, index) => 
                            {
                                return (index === 0) ?
                                    <div key={index} className='flex flex-row text-sm text-white items-center'>
                                        <div className='font-semibold text-white '>
                                            {name}
                                        </div>
                                    </div>

                                :

                                <div key={index} className='flex flex-row text-sm text-white items-center'>
                                    <div className='text-gray-500 text-[0.5rem] mx-1' >
                                            <VscCircleFilled/>
                                        </div>
                                    <div className='font-semibold text-white '>
                                        {name}
                                    </div>
                                </div>
                            }

                            
                        )}
                    </div>
                </div>
            </div>
        </div>
    
    )
}
