import React from 'react'
import MainBanner from '../Components/MainBanner'
import Categories from '../Components/Categories'
import Bestseller from '../Components/Bestseller'
import BottomBanner from '../Components/BottomBanner'
import Newsletter from '../Components/Newsletter'

const Home = () => {
  return (
    <div className='mt-10'>
       <MainBanner />
       <Categories />
       <Bestseller />
       <BottomBanner />
       <Newsletter />
    </div>
  )
}

export default Home