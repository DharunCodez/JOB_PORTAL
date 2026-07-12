import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {


    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);

    useEffect(() => {
        const filteredJobs = allAdminJobs.length >= 0 && allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true
            };
            return job?.company?.companyName?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase())
        })

        setFilterJobs(filteredJobs);

    }, [allAdminJobs, searchJobByText])

    const deleteJobHandler = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job? All associated applications will be permanently deleted.")) {
            return;
        }
        try {
            const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                withCredentials: true
            });
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setAllAdminJobs(allAdminJobs.filter(j => j._id !== jobId)));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
    };


    return (
        <div>
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs && filterJobs?.map((job) => (
                            <tr key={job._id}>
                                <TableCell>{job?.company?.companyName}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger className=" cursor-pointer">
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 flex flex-col gap-1.5 ">
{/*                                             <div onClick={() => navigate(`/admin/jobs/${job._id}`)} className='flex items-center w-fit cursor-pointer gap-2'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div> */}
                                            <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit cursor-pointer gap-2'>
                                                <Eye className='w-4' />
                                                <span>Applicants</span>
                                            </div>
                                            <div onClick={() => deleteJobHandler(job._id)} className='flex items-center w-fit cursor-pointer gap-2 mt-2 text-red-600'>
                                                <Trash2 className='w-4' />
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>


                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }

                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable;
