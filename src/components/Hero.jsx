import React from 'react';
import Navbar from './Navbar.jsx';

const Hero = () => {
    return (
        <section className="border-l border-[#080808]">
            <Navbar />
            <div id='hero-section' className="py-[100px] flex flex-row items-center justify-between">
                <div className='left-hero flex flex-col gap-5'>

                    <div>
                        <code>// Hello, World</code>
                        <h1 className='name text-[80px] mb-0'>Samuel <span className='highlight text-[#F74100]'>John</span></h1>
                        <p className='subtitle text-[30px]'>"Fullstack Engineer"</p>
                    </div>
                    <div className='minor w-1/2 flex flex-col gap-2.5'>
                        <div className='bordered border border-[#d4cbcb] p-2.5'>
                            NixtNocode
                        </div>
                        <p className='desc text-xs'>
                            We're a digital products design and development agency that's passionate with the digital experiences
                        </p>
                    </div>
                </div>
                <div className='right-hero flex gap-4'>
                    <div className='bordered stat-card flex flex-col gap-[60px] p-5 border border-[#d4cbcb]'>
                        <span className='stat-title text-left w-40 text-xs uppercase'>Clients Satisified and Repeating</span>
                        <p className='stat text-[60px] text-right font-bold'>95%</p>
                    </div>
                    <div className='bordered stat-card flex flex-col gap-[60px] p-5 border border-[#d4cbcb]'>
                        <span className='stat-title text-left w-40 text-xs uppercase'>Products completed in 24 countries</span>
                        <p className='stat text-[60px] text-right font-bold'>86+</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;