import React, { useState } from 'react'
import { IoEyeOutline,IoEyeOffOutline } from "react-icons/io5";
import { useLoginMutation } from '../../redux/services/authApi';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/loading.json'
import { ResponseError } from '../../type/error';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/features/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SubmitButton from '../SubmitButton';

const initialFormData = {
    email: '',
    password: ''
}

const Login = () => {
    const [formData,setFormData] = useState(initialFormData)

    const {email,password} = formData

  const [showPassword,setShowPassword] = useState(false)

  const [login,{isLoading}] = useLoginMutation()

  const location = useLocation()

  const from = location.state?.from?.pathname || '/'


  const googleLogin = () => {
    window.open('http://localhost:5000/api/v1/auth/google', '_self')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!email || !password){
        toast.error('All Feilds Required!', {
            position: "top-right"
        });
        return
    }
    try {
        const data = await login({email,password}).unwrap()
        dispatch(setCredentials(data.user))
        toast.success('You have succesfully logged in', {
            position: "top-right"
        });
        navigate(from)
    } catch (error) {
        // console.log("error",error)
        const resErr = error as ResponseError
        toast.error(resErr?.data?.message, {
            position: "top-right"
        });
    }
  }
  return (
    <>
      <h4 className='font-semibold text-[20px] mb-6'>Login</h4>
      <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
              <label htmlFor="email" className='mb-3 text-[15px]'>
                  Email address *
              </label>
              <input autoFocus type="email" name='email' value={email} id='email' onChange={handleChange} className='py-2 px-4 focus:outline-none border-[1px] border-[#ccc] rounded' />
          </div>
          <div className='flex flex-col mb-4'>
              <label htmlFor="password" className='mb-3 text-[15px]'>
                  Password *
              </label>
              <div className='relative'>
                  <input type={showPassword ? 'text' : "password"} name='password' value={password} onChange={handleChange} id='password'  className='py-2 px-4 w-full focus:outline-none border-[1px] border-[#ccc] rounded'  />
                  <span className='cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]'
                  onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <IoEyeOffOutline className="text-lg"/> : <IoEyeOutline  className="text-lg"/>}
                  </span>
              </div>
          </div>
          <Link to={'/login/forgot-password'} className='text-blue-500 border-b border-blue-500 text-sm mb-4'>Forgot Passowrd?</Link>
          <div className='flex items-center gap-8 pt-4 flex-wrap'>
            <SubmitButton isLoading={isLoading} title='Login' />
            <button type='button' className='btn-primary cursor-pointer w-full px-4 md:w-auto items-center gap-2' onClick={googleLogin}>Login With Google </button>
          </div>
      </form>
    </>
  )
}

export default Login