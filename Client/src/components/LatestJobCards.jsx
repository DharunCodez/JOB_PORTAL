import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import { toggleSavedJobLocal } from '@/redux/jobSlice'

function LatestJobCards({ job }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { savedJobs } = useSelector(store => store.job);

  const isSaved = savedJobs.some(j => (j._id || j) === job?._id);

  const handleSaveToggle = async (e) => {
    e.stopPropagation(); // Don't navigate to job description
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
    <div onClick={() => navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-lg bg-white border border-gray-100 cursor-pointer hover:scale-110 transition-all duration-600 '>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.companyName}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
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
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge className="text-primary font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-primary font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-primary font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  )
}

export default LatestJobCards