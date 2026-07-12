import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import { toggleSavedJobLocal } from '@/redux/jobSlice'

const SavedJobsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { savedJobs } = useSelector(store => store.job);

    const handleRemove = async (jobId) => {
        try {
            const response = await axios.post(`${SAVED_JOB_API_END_POINT}/toggle/${jobId}`, {}, {
                withCredentials: true,
            });
            if (response.data.success) {
                dispatch(toggleSavedJobLocal(jobId));
                toast.success("Job removed from saved list");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to remove job");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>Your saved jobs — click a title to view details.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {savedJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-6">
                                No saved jobs yet. Click "Save For Later" on any job card!
                            </TableCell>
                        </TableRow>
                    ) : (
                        savedJobs.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell
                                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                                    onClick={() => navigate(`/description/${job._id}`)}
                                >
                                    {job?.title || 'N/A'}
                                </TableCell>
                                <TableCell>{job?.company?.companyName || 'N/A'}</TableCell>
                                <TableCell>{job?.location || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant="ghost" className="text-primary font-semibold">{job?.jobType || 'N/A'}</Badge>
                                </TableCell>
                                <TableCell>{job?.salary ? `${job.salary} LPA` : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemove(job._id)}
                                        title="Remove from saved"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default SavedJobsTable
