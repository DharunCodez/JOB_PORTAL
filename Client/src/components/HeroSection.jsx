import React, { useState } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"

function HeroSection() {

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{}}
            className='text-center'
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-green-100 text-primary font-medium'>No. 1 Job Hunt Website</span>
                {/* <p>/ your dream job today!</p> */}

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 2 }}
                    className='sm:text-4xl lg:text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-primary hover:text-primary/80 cursor-pointer' onClick={() => navigate("/browse")} >Dream Jobs</span></motion.h1>
                <div className='flex sm:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input type="text"
                        placeholder='Find your dream jobs'
                        className='outline-none border-none w-full'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button onClick={searchJobHandler} className='rounded-r-full bg-primary hover:bg-primary/90 cursor-pointer'>
                        <Search
                            className='h-5 w-5'
                        />
                    </Button>
                </div>
            </motion.div>


        </motion.div>
    )
}

export default HeroSection