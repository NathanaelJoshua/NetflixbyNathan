import React, { useEffect, useState } from 'react'
import { GoSearch, GoX } from "react-icons/go";
import { useNavigate } from "react-router-dom";


export const SearchBar = () => {
const [isActive, setIsActive] = useState(false);
const [searchValue,setSearchValue] = useState('');
const [searchResult,setSearchResult] = useState('');
const [isBlur, setBlur] = useState(true);

const navigate = useNavigate();

  useEffect(() =>{
    searchValue ? setSearchResult(searchValue.toLowerCase()) : setSearchResult('')
  },[searchValue]); 

  useEffect(() =>{
    if(searchResult){
      const searchUrl = '/Search?q=';
      navigate(searchUrl + searchResult);
    }
  },[searchResult]); 

  useEffect(() =>{
    const queryParams = new URLSearchParams(window.location.search);
    const p = queryParams.get("q");
    console.log(queryParams)
    if(p){
      setSearchValue(p);
      setIsActive(true);
    }
  },[]); 

  useEffect(() =>{
  },[isBlur]); 
  
  const handleClick = () => {
    const input = document.getElementById('searchInput');
    setIsActive(true);
    input.focus();
  };

  const closeSearch = () => {
    setIsActive(false);
    setSearchResult('');
    setSearchValue('');
    navigate('/');
  }

  const handleBlur = event => {
    setIsActive(false);
  };

  const handlerChange = e => {
    setSearchValue(e);
    setBlur(false);
  }
  
  return (
    <div className='px-2 relative'>
        <div className={isActive ? 'flex flex-row items-center p-1 bg-black duration-500 outline outline-1 outline-white ' 
        : 'flex flex-row items-center p-1'} 
         onBlur={isBlur ? handleBlur : ()=>{}}>
        <GoSearch onClick={handleClick} className='cursor-pointer'/> 
        <input  autoComplete="off" onChange={e => handlerChange(e.target.value)} value={searchValue}  id="searchInput" className={isActive ? 'opacity-100 w-100 duration-500 bg-black mx-3 outline-none' 
        :'w-0 opacity-0 h-0'} placeholder='Titles, people, genres'/>
        <GoX onClick={closeSearch} className={isActive ? 'block cursor-pointer text-white' : 'hidden'}/>
        </div>
    </div>
  )
}
