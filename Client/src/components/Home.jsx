import { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import useGetSavedJobs from '@/hooks/useGetSavedJobs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const Home = () => {

  const navigate = useNavigate();
  useGetAllJobs();
  useGetSavedJobs();
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }



  }, [user, navigate])


  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />

    </div>
  )
}

export default Home
