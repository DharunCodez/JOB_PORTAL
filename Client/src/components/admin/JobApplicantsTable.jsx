import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Mail, Contact } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICANT_API_END_POINT } from '@/utils/constant';
import { updateApplicantStatus } from '@/redux/applicationSlice';


const shortListingStatus = ["Accepted", "Rejected"];

const statusStyles = {
    pending: "bg-gray-100 text-gray-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
}

const JobApplicantsTable = () => {

    const dispatch = useDispatch();
    const { allApplicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            const response = await axios.post(`${APPLICANT_API_END_POINT}/status/${id}/update`,
                { status }, {
                withCredentials: true
            })

            if (response.data.success) {
                // Optimistically update the status in Redux without a page refresh
                dispatch(updateApplicantStatus({ id, status }));
                toast.success(response.data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }


    return (
        <div>
            <Table>
                <TableCaption>A list of your recently applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        allApplicants && allApplicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <span className="text-blue-600 hover:underline cursor-pointer">{item?.applicant?.fullname}</span>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Applicant Profile</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-4 items-center mt-2">
                                                <Avatar className="w-16 h-16">
                                                    <AvatarImage src={item?.applicant?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                                </Avatar>
                                                <div>
                                                    <h2 className="text-lg font-bold">{item?.applicant?.fullname}</h2>
                                                    <p className="text-sm text-gray-500 max-h-24 overflow-y-auto">{item?.applicant?.profile?.bio || "No bio provided"}</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-2 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <span>{item?.applicant?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Contact className="w-4 h-4 text-gray-500" />
                                                    <span>{item?.applicant?.phoneNumber}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold mb-2 mt-2">Skills</h3>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {item?.applicant?.profile?.skills?.length > 0 ? (
                                                            item.applicant.profile.skills.map((skill, index) => (
                                                                <Badge key={index}>{skill}</Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">NA</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="font-bold mb-1">Resume</h3>
                                                    {item?.applicant?.profile?.resume ? (
                                                        <a target="_blank" rel="noreferrer" href={item.applicant.profile.resume} className="text-blue-600 hover:underline">
                                                            {item.applicant.profile.resumeOriginalName || "Download Resume"}
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">NA</span>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume
                                            ?
                                            <a
                                                className="hover:text-blue-600 cursor-pointer"
                                                href={item.applicant?.profile?.resume}
                                                target='_blank'>
                                                {item.applicant?.profile?.resumeOriginalName}
                                            </a>
                                            :
                                            <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[item?.status] || statusStyles.pending}`}>
                                        {item?.status || 'pending'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className='cursor-pointer' />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortListingStatus?.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:text-primary transition-colors'>
                                                            <span className='cursor-pointer'>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
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

export default JobApplicantsTable
