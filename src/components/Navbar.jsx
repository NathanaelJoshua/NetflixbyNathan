import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.js'
import { IoMdArrowDropdown } from "react-icons/io";
import { SearchBar } from './SearchBar.jsx';
import { RiPencilFill, RiAccountCircleLine, RiFolderTransferLine, RiNotification2Line } from "react-icons/ri";
import { TbHelp, TbMenu2 } from "react-icons/tb";


import  './Navbar.css';


const Navbar = () => {
  const {user, logOut} = UserAuth();
  const [isScrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', stickNavbar);

    return () => {
      window.removeEventListener('scroll', stickNavbar);
    };
  }, []);
  const stickNavbar = () => {
    const height = document.getElementById('navMain').offsetHeight;
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > height ? setScrolled(true) : setScrolled(false);
    }
  };
  
  return (
    <div>

    {user ? 
          <div id="navMain" className={isScrolled  ? 'flex fixed items-center justify-between md:px-[50px] py-4 z-40 w-full bg-black' : 'flex fixed items-center justify-between md:px-[50px] py-4 z-40 w-full bg-gradient-to-b from-black to-transparent'}>
              <div className='flex'>
                <div className='md:hidden flex text-white items-center justify-center dropdown'>
                  <a className=' mx-4 '>
                    <TbMenu2 className='burger'/>
                  </a>
                  <div className='menuBurger'>
                      <a className='triBurger'/>
                      <div className='text-white px-2 flex text-start'>
                        <Link to='/NetflixByNathan'>
                          Home
                        </Link>
                      </div>
                      <div className='text-white px-2 flex text-start'>
                        <Link to='/tvshows'>
                          Tv Shows
                        </Link>
                      </div>
                      <div className='text-white px-2 flex text-start'>
                        <Link to='/movies'>
                          Movies
                        </Link>
                      </div>
                      <div className='text-white px-2 flex text-start'>
                        <Link to='/mylist'>
                          My List
                        </Link>
                      </div>
                  </div>
                </div>
                <Link to='/NetflixByNathan' className='pr-5'> 
                  <img  className='h-8' src="./NetflixbyNathan/images/Logo.png"/>
                </Link>
                <div className='md:flex hidden'>
                  <div className='text-white px-5'>
                      <Link to='/NetflixByNathan'>
                        Home
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to='/tvshows'>
                        TV Shows
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to='/movies'>
                        Movies
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to='/mylist'>
                        My List
                      </Link>
                  </div>
                </div>
                
              </div>
            
              <div className='text-white flex items-center'>
                  <SearchBar/>
                  <div className='px-2 cursor-pointer'>
                    <a>
                      <RiNotification2Line className='text-lg'/>
                    </a>
                  </div>
                  <div className='dropdown px-2'>
                    <a>
                      <div className='flex items-center'>
                        <div className='bg-slate-400 w-8 h-8 mx-1 rounded-md'>
                            <img  className='rounded-md w-full h-full' src="./NetflixbyNathan/images/MoneyHeistpp.png"/>
                        </div>
                        <IoMdArrowDropdown className='arrow'/>
                      </div>
                    </a>
                    <div className='menu'>
                      <div className='tri'/>
                      <a href=''>
                        <div className='flex flex-row items-center gap-2'>
                            <div className='text-gray-500 text-xl'>
                              <RiPencilFill/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Manage Profiles
                            </div>
                        </div>
                      </a>  
                      <a href=''>
                        <div className='flex flex-row items-center gap-2'>
                            <div className='text-gray-500 text-xl'>
                              <RiFolderTransferLine/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Transfer Profiles
                            </div>
                        </div>
                      </a>  
                      <a href=''>
                        <div className='flex flex-row items-center gap-2'>
                            <div className='text-gray-500 text-xl'>
                              <RiAccountCircleLine/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Account
                            </div>
                        </div>
                      </a>  
                      <a href=''>
                        <div className='flex flex-row items-center gap-2'>
                            <div className='text-gray-500 text-xl'>
                              <TbHelp/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Help Center
                            </div>
                        </div>
                      </a>  

                      <a onClick={handleLogOut} className=' border-t-[0.05px] border-gray-400'>
                        <div className='text-sm hover:underline underline-offset-1'>
                          Sign out of Netflix
                        </div>
                      </a>
                    </div>
                  </div>
              </div>
          </div>
        :
        <div id="navMain" className='flex fixed items-center justify-start px-[50px] py-4 z-40 w-full from-black to-transparent'>
            <div className='flex'>
              <Link to='/NetflixByNathan' className='pr-5'> 
                <img  className='h-8' src="./NetflixbyNathan/images/Logo.png"/>
              </Link>
      
            </div>
        </div>
        }
    </div>
  )
}

export default Navbar