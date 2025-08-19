import React from 'react'
import { assets, features } from '../assets/assets.js'

const BottomBanner = () => {
    return (
        <div className='relative mt-24'>
            <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block' />
            <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden' />
            <div className='absolute inset-0 flex items-center justify-center w-full h-full'>
                <div className='flex flex-col md:flex-row items-center md:items-stretch justify-center w-full h-full px-4 md:px-0'>
                    {/* Left: Image (empty for background only) */}
                    <div className="hidden md:block md:w-1/2"></div>
                    {/* Right: Features */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-12">
                        <h1 className='text-2xl md:text-3xl font-semibold text-primary mb-6 text-center md:text-left'>
                            Why We Are the Best ?
                        </h1>
                        {features.map((feature, index) => (
                            <div key={index} className='flex items-center gap-4 mt-2 w-full'>
                                <img src={feature.icon} alt={feature.title} className='w-9 md:w-11' />
                                <div>
                                    <h3 className='md:text-xl text-lg font-semibold'>{feature.title}</h3>
                                    <p className='text-gray-500/70 text-xs md:text-sm'>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BottomBanner