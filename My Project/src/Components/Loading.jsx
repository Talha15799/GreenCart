import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../Context/AppContext'

const Loading = () => {
  const{navigate}= useAppContext();
  let {search}= useLocation();
  const query = new URLSearchParams(search);
  const nextURL= query.get('next');


  useEffect(()=>{
    if(nextURL){    
      setTimeout(()=>{
        navigate(`/${nextURL}`);
        
      },5000) 
    }
  },[nextURL])   


  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-34 w-24 border-4 border-gray-300 border-t-primary'>

        </div>

    </div>
  )
}

export default Loading