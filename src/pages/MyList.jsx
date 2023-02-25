import React, { useEffect } from 'react'
import { doc, onSnapshot} from 'firebase/firestore'
import { db } from '../firebase'
import { UserAuth } from '../context/AuthContext';
import { useState } from 'react';
import useWindowDimensions from '../components/windowDimensions';
import { Movies } from '../components/Movies';
import { FaUndo } from "react-icons/fa";

export const MyList = () => {
  
  const [listMovie, setListMovie] = useState();
  const {user} = UserAuth();
  
  const [movieCount,setMovieCount] = useState(6);
  const [movieWidth, setMovieWidth] = useState(0);
  const { width } = useWindowDimensions();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoad, setLoad] = useState(true);

  useEffect(() => {
    onSnapshot(doc(db, 'users',`${user?.email}`), (doc)=>{
        setListMovie(doc.data()?.savedShows);
    });
  },[user.email])

  useEffect(() =>{
    const movieItemScroll = () =>{
        if(windowWidth<=640){
            setMovieCount(3)
            }
            else if(windowWidth<=768){
                setMovieCount(4)
            }
            else if(windowWidth<=1024){
                setMovieCount(5)
            }
            else setMovieCount(6);
    
        }
    movieItemScroll();
  },[windowWidth])

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
    const movieWidthFunction = () =>{
      const movieWidth = (width - 100);
      setMovieWidth(movieWidth/movieCount);
    }
    movieWidthFunction();
    
    if(listMovie){
      setLoad(false)
    }
  },);

  if(isLoad){
    return '';
  }
  return (
    <div className='pl-[50px] py-10 h-screen'>
        <div className='text-white py-10 text-start text-3xl font-normal'>
            My List
        </div>
        {listMovie.length > 0 ? 
          <div className='flex flex-row flex-wrap'>
            {listMovie.map((item,index) => (
              <div className='pb-[50px] relative' key={index}>
                <Movies movie={item.movie} width={movieWidth} type={item.type} movieCount={movieCount} index={index} searchKey='1'/>
              </div>
                ))}
          </div>
          :
          <div className=' flex flex-col justify-center'>
            <div className='text-white text-3xl font-medium'>No Result Found</div>
            <div className='text-gray-300 mt-3'>
              You haven't add any title to your list yet
            </div>
          </div>
        }

        {/* <div className='flex justify-center items-center'>
          <div className={removeAlert ? 'fixed flex translate-y-[-50%] bottom-0 mb-10 bg-white rounded-3xl transition duration-500' : 'fixed transition bottom-[-100px] duration-500 bg-white rounded-3xl'}>
              <div className='flex gap-10 justify-between py-3 px-9'>
                  <div className='flex'>
                    <p className='font-semibold mr-1'>{removedMovieTitle}</p> has been removed from My List.
                  </div>
                  <div className='cursor-pointer font-medium flex flex-row items-center' onClick={onUndoClickHandler}>
                    <FaUndo className='mr-3'/> Undo
                  </div>
              </div>
          </div>
        </div> */}
        
        
    </div>
  )
}
