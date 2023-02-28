import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.js'

export const SignUp = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [isEmailError, setEmailError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);
  const [error,setError] = useState('');
  const {signUp} = UserAuth();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
        
    let checkEmail = checkEmailFunction(email);
    let checkPass = checkPassFunction(password);

    if(checkEmail === false){
        setEmailError(true);
    }
    else setEmailError(false);
    if(checkPass === false){
        setPasswordError(true);
    }
    else setPasswordError(false);
        
    if(checkPass === true && checkEmail === true)
    {
        try {
            await signUp(email,password);
            navigate('/');
        } catch (error) {
            setError(error.message)
        }
    }
  }

  
  const setEmailInputStyle = () =>{
    let className = 'bg-gray-700 text-white rounded-sm p-3 my-2 w-full ';
    if(isEmailError === true){
        className += 'border-b-[3px] border-orange-400'
    }
    
    return className;
}

const setPasswordInputStyle = () =>{
    let className = 'bg-gray-700 text-white rounded-sm p-3 my-2 w-full ';
    if(isPasswordError === true){
        className += 'border-b-[3px] border-orange-400'
    }
    
    return className;
}

  const checkEmailFunction = (input) => {

    if (/\S+@\S+\.\S+/.test(input)) {
        return true;
    } 
    else return false;
}

const checkPassFunction = (input) => {

    if (input.length > 4 && input.length< 60) {
        return true;
    } 
    else return false;
}
  return (
    <div>
        <img className='sm:block hidden object-cover h-full w-full absolute' src='https://assets.nflxext.com/ffe/siteui/vlv3/1ecf18b2-adad-4684-bd9a-acab7f2a875f/4f859d52-289a-4ab5-80b4-f3db0bdf4cde/ID-en-20230116-popsignuptwoweeks-perspective_alpha_website_large.jpg' alt=''/>
        <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'>
            <div className='fixed w-full px-4 py-24 z-50'>
                <div className='max-w-[450px] h-[600px] mx-auto bg-black/75 text-white rounded-md'>
                    <div className='py-16 max-w-[300px] mx-auto'>
                        <h1 className='text-3xl font-semibold text-start'>Sign Up</h1>
                        <form className='w-full flex flex-col py-4'  onSubmit={onSubmitHandler} >
                        {error ? <p className='p-3 bg-orange-400 rounded-md text-start'>{error}</p> : null}
                            <div className='w-full flex flex-col pb-2'>
                                <input className={setEmailInputStyle()} onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Email or Phone Number'></input>
                                {isEmailError ? 
                                    <div className='text-orange-400 text-xs flex text-start'>
                                        Please enter a valid email or phone number.
                                    </div>
                                : ""}
                            </div>
                            <div className='w-full flex flex-col pb-2'>
                                <input className={setPasswordInputStyle()} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password'></input>
                                {isPasswordError ? 
                                    <div className='text-orange-400 text-xs flex text-start'>
                                        Your password must contain between 4 and 60 characters.
                                    </div>
                                : ""}
                            </div>
                            <button type='submit' className='bg-red-600 text-white font-bold p-3 rounded-sm mt-5 mb-3'>Sign Up</button>
                            <div className='flex justify-between items-center text-gray-400 text-sm'>
                                <div>
                                    <input type='checkbox' className="mr-2"/>
                                    Remember Me
                                </div>
                                <div>
                                    Need Help?
                                </div>
                            </div>
                            <div className='flex justify-start mt-12'>
                                <p className='text-gray-400 mr-1'>New to Netflix?</p>
                                <Link to='/Login'>
                                    <p className='text-white'>Sign In Now</p>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}
