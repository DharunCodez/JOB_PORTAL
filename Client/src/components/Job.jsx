import React from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import { toggleSavedJobLocal } from '@/redux/jobSlice'

const Job = ({ job }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { savedJobs } = useSelector(store => store.job);

    const isSaved = savedJobs.some(j => (j._id || j) === job?._id);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - createdAt.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return Math.floor(differenceInDays);
    }

    const handleSaveToggle = async () => {
        if (!user || user.role !== 'student') {
            toast.error("Only students can save jobs");
            return;
        }
        try {
            const response = await axios.post(`${SAVED_JOB_API_END_POINT}/toggle/${job._id}`, {}, {
                withCredentials: true,
            });
            if (response.data.success) {
                dispatch(toggleSavedJobLocal(job._id));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save job");
        }
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 hover:scale-105 transition-all duration-500 h-full flex flex-col'>
            <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button
                    onClick={handleSaveToggle}
                    variant="outline"
                    className={`rounded-full ${isSaved ? 'text-primary border-primary' : ''}`}
                    size="icon"
                    title={isSaved ? "Remove from saved" : "Save for later"}
                >
                    {isSaved ? <BookmarkCheck className="fill-primary text-primary" /> : <Bookmark />}
                </Button>
            </div>

            <div className='flex gap-2 items-center my-2'>
                <Button variant="outline" size="icon" className="p-6" >
                    <Avatar>
                        <AvatarImage
                            src={job?.company?.logo || "https://th.bing.com/th/id/OIP.NU9zscMHAn83CpLA9fDjrgHaHa?rs=1&pid=ImgDetMain"}
                        />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg md:text-xl'>{job?.company?.companyName}</h1>
                    <p className='text-sm text-gray-600'>India</p>
                </div>
            </div>

            <div className=''>
                <h1 className='font-bold text-lg my-2 '>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>

            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className="text-primary font-bold" variant="ghost">
                    {job?.position} positions
                </Badge>
                <Badge className="text-primary font-bold" variant="ghost">
                    {job?.jobType}
                </Badge>
                <Badge className="text-primary font-bold" variant="ghost">
                    {job?.salary} LPA
                </Badge>

            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button className="cursor-pointer" onClick={() => navigate(`/description/${job._id}`)} variant="outline">Details</Button>
                <Button
                    onClick={handleSaveToggle}
                    className={`cursor-pointer ${isSaved ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary hover:bg-primary/90'}`}
                >
                    {isSaved ? "Saved ✓" : "Save For Later"}
                </Button>
            </div>

        </div>
    )
}

export default Job
