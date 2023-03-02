import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.js'
import { IoMdArrowDropdown } from "react-icons/io";
import { SearchBar } from './SearchBar.jsx';
import { RiPencilFill, RiAccountCircleLine, RiFolderTransferLine, RiNotification2Line } from "react-icons/ri";
import { TbHelp, TbMenu2 } from "react-icons/tb";


import  './Navbar.css';


const Navbar = (props) => {
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
          <div id="navMain" className={`${!props.isModalVisible && 'fixed'} flex  items-center justify-between md:px-[50px] py-4 z-40 w-full ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'}`}>
              <div className='flex'>
                {/* burger menu if width small */}
                <div className='md:hidden flex text-white items-center justify-center dropdown'>
                  <a className=' mx-4 '>
                    <TbMenu2 className='burger'/>
                  </a>
                  <div className='menu left-0'>
                      {/* triangle */}
                      <div className='triangle ml-[15px]'/>
                      <Link to={'/Home'}>
                        <div className='text-white flex text-start p-3 bg-black'>
                            Home
                        </div>
                      </Link>
                      <Link to={'/tvshows'}>
                        <div className='text-white flex text-start p-3 bg-black'>
                            Tv Shows
                        </div>
                      </Link>
                      <Link to={'/movies'}>
                        <div className='text-white flex text-start p-3 bg-black'>
                            Movies
                        </div>
                      </Link>
                      <Link to={'/mylist'}>
                        <div className='text-white flex text-start p-3 bg-black'>
                            My List
                        </div>
                      </Link>
                  </div>
                </div>
                <Link to={'/Home'} className='pr-5'> 
                  <img  className='h-8' src={process.env.PUBLIC_URL + "/images/Logo.png"}/>
                </Link>
                <div className='md:flex hidden'>
                  <div className='text-white px-5'>
                      <Link to={'/Home'}>
                        Home
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to={'/tvshows'}>
                        TV Shows
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to={'/movies'}>
                        Movies
                      </Link>
                  </div>

                  <div className='text-white px-5'>
                      <Link to={'/mylist'}>
                        My List
                      </Link>
                  </div>
                </div>
              </div>
            
              <div className='text-white flex items-center'>
                  {/* search bar */}
                  <SearchBar/>

                  {/* notification*/}
                  <div className='px-2 cursor-pointer dropdown'>
                    <a>
                      <RiNotification2Line className='text-lg'/>
                    </a>
                    <div className='menu w-[500px]'>
                      {/* triangle */}
                      <div className='triangle absolute right-3'/>

                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 border-t-[0.05px] border-gray-400 opacity-70 hover:opacity-90'>
                            <div className='text-gray-500 text-xl w-[130px] h-[70px] bg-white rounded-md'>

                            </div>
                            <div className='flex flex-col flex-wrap text-start pl-3 w-[280px]'>
                                <div className='text-white'>
                                    Netflix Lookahead
                                    <br/> Explore what's coming soon
                                </div>
                                <div className='text-xs text-gray-500 py-1'>
                                    5 days ago
                                </div>
                            </div>
                        </div>
                      </Link>   

                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 border-t-[0.05px] border-gray-400 opacity-70 hover:opacity-90'>
                            <div className='text-gray-500 text-xl w-[130px] h-[70px] bg-white rounded-md'>

                            </div>
                            <div className='flex flex-col flex-wrap text-start pl-3 w-[280px]'>
                                <div className='text-white'>
                                    Netflix Lookahead
                                    <br/> Explore what's coming soon
                                </div>
                                <div className='text-xs text-gray-500 py-1'>
                                    5 days ago
                                </div>
                            </div>
                        </div>
                      </Link>   

                      
                    </div>
                    
                  </div>

                  {/* user dropdown */}
                  <div className='dropdown px-2'>
                    <a>
                      <div className='flex items-center'>
                        <div className='bg-slate-400 w-8 h-8 mx-1 rounded-md'>
                            <img  className='rounded-md w-full h-full' src={process.env.PUBLIC_URL + "/images/MoneyHeistpp.png"}/>
                        </div>
                        <IoMdArrowDropdown className='arrow'/>
                      </div>
                    </a>
                    <div className='menu'>
                      {/* triangle */}
                      <div className='triangle ml-[78%]'/>
                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 bg-black'>
                            <div className='text-gray-500 text-xl'>
                              <RiPencilFill/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Manage Profiles
                            </div>
                        </div>
                      </Link>  
                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 bg-black'>
                            <div className='text-gray-500 text-xl'>
                              <RiFolderTransferLine/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Transfer Profiles
                            </div>
                        </div>
                      </Link>  
                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 bg-black'>
                            <div className='text-gray-500 text-xl'>
                              <RiAccountCircleLine/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Account
                            </div>
                        </div>
                      </Link>  
                      <Link>
                        <div className='flex flex-row items-center gap-2 p-3 bg-black'>
                            <div className='text-gray-500 text-xl'>
                              <TbHelp/> 
                            </div>
                            <div className='text-sm hover:underline underline-offset-1'>
                              Help Center
                            </div>
                        </div>
                      </Link>  

                      <a onClick={handleLogOut} className=' border-t-[0.05px] border-gray-400 p-3'>
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
              <Link to={'/Home'} className='pr-5'> 
                <img  className='h-8' src={process.env.PUBLIC_URL + "/images/Logo.png"}/>
              </Link>
      
            </div>
        </div>
        }
    </div>
  )
}

export default Navbar