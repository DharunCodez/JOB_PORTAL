import { setSavedJobs } from '@/redux/jobSlice';
import { SAVED_JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user || user.role !== 'student') return;

        const fetchSavedJobs = async () => {
            try {
                const response = await axios.get(`${SAVED_JOB_API_END_POINT}/get`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    dispatch(setSavedJobs(response.data.savedJobs));
                }
            } catch (error) {
                console.error("useGetSavedJobs error:", error);
            }
        };

        fetchSavedJobs();
    }, [dispatch, user]);
};

export default useGetSavedJobs;
