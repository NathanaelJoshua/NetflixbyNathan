import axios from 'axios';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { VscAdd, VscCheck } from 'react-icons/vsc';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import request from '../Request';

export const SimilarMovies = (props) => {

    // item parameter
    const id = props.itemId;
    const type = props.type;
    const [vote, setVote] = useState();
    const [image, setImage] = useState();
    const [release, setRelease] = useState('');
    const [runtime, setRunTime] = useState('');
    const [desc, setDesc] = useState('');
    const [title, setTitle] = useState('');

    //api 
    let apiItem = request.requestItemById;

    //UI Status
    const [isLoad, setLoad] = useState(true);
    const [isExistInList, setExistInList] = useState(false);

    // user
    const {user} = UserAuth();
    const [userMovieList, setUserMovieList] = useState([]);
    const userDb = doc(db, 'users', `${user?.email}`);
    const [movieObject, setMovieObject] = useState();

    //data setup
    useEffect(()=>{
        onSnapshot(doc(db, 'users',`${user?.email}`), (doc)=>{
            setUserMovieList(doc.data()?.savedShows);
        });  

        const editApi = (api, type, id) =>{
            api = api.replace('#type#', type);
            api = api.replace('#id#', id);
            
            return api;
        }

        const getItemData = async ( ) =>{
            await axios.get(apiItem).then((response)=>{
                let v = 0;
                let duration = '';
                const data = response.data;

                //set movie
                setMovieObject(data)

                //set Vote
                v = Math.floor(data.vote_average*10) +'% Match'
                setVote(v);

                //set Title
                if(data.title) setTitle(data.title)
                else setTitle(data.name)

                //set Image
                setImage(data.backdrop_path)

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
        
        apiItem = editApi(apiItem, type, id);

        getItemData();
        setLoad(false);
    },[id])

    // user movie list from db setup
    useEffect(()=>{
        if(userMovieList){
            if(userMovieList.some(obj => obj.item.id === id) ) setExistInList(true);
        }
    },[userMovieList])

    //button handler
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

    const limitText = (str, num) => {
        if(str.length > num){
            return str.slice(0, num) + '...';
        }
        else return str;
    }

    if(isLoad){
        return '';
    }
  return (
    <div className='rounded-md bg-[#2f2f2f] overflow-clip my-2 w-full '>
        <div className='relative'>
            <img className='w-full h-full object-cover' src={`https://image.tmdb.org/t/p/original/${image}`} alt={title}/>
            
            <div className='absolute bg-gradient-to-bl from-black via-transparent to-transparent w-full h-full top-0 right-0'>
                <div className='text-white p-3 text-end'>
                    {runtime}
                </div>
            </div>      
        </div>
        <div className='p-4'>
            <div className='flex justify-between items-center flex-wrap'>
                <div>
                    <div className='text-green-500 font-semibold'>
                        {vote}
                    </div>
                    
                    <div className='flex gap-2 text-md text-white mb-3 items-center '>
                        <div className='px-2 outline outline-white outline-[0.2px] h-max'>
                            13+
                        </div>
                        <div className='text-white font-semibold'>
                            {release}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex justify-center items-center rounded-full outline outline-2 p-3 mx-2 cursor-pointer hover:text-white text-gray-300' onClick={AddListHandler}>
                        {isExistInList ? <VscCheck/> : <VscAdd/>}
                    </div>
                </div>
            </div>

            <div className='text-white text-start py-2 text-sm'>
                {limitText(desc,200)}
            </div>
        </div>
        
    </div>
  )
}
