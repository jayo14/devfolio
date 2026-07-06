import React from 'react';

const Navbar = () => {
    return (
        <header className="flex flex-row items-center justify-between border-x border-[#080808]">
            <div>
                Logo
            </div>
            <nav>
                <ul className="flex flex-row gap-[40px] list-none">
                    <li><a href="#" className="no-underline text-white">Home</a></li>
                    <li><a href="#features" className="no-underline text-white">Feature</a></li>
                    <li><a href="#about" className="no-underline text-white">About</a></li>
                    <li><a href="#project" className="no-underline text-white">Projects</a></li>
                    <li><a href="#blog" className="no-underline text-white">Blog</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;