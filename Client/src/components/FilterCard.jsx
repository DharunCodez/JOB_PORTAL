import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bengluru", "Mumbai", "Hyderabad", "Ranchi", "Patna"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Machine Learning"]
    },
    {
        filterType: "Salary",
        array: ["6-10 LPA", "10-40 LPA", "40-100 LPA", "100+"]
    }
]


const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState("");
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    const clearFilters = () => {
        setSelectedValue("");
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue))
    }, [selectedValue])

    return (
        <div className='w-full bg-white py-3 rounded-md'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                {selectedValue && (
                    <button
                        onClick={clearFilters}
                        className='text-sm text-primary hover:text-primary/80 font-medium cursor-pointer'
                    >
                        Clear
                    </button>
                )}
            </div>
            <hr className='mt-3' />

            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={index}>
                            <h1 className='font-bold text-lg mt-2'>{data.filterType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    // Fix: use index_idx to guarantee unique IDs across all groups
                                    const itemId = `filter-${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 gap-1 my-2' key={itemId}>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label className="text-base/5 cursor-pointer" htmlFor={itemId}>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>



        </div>
    )
}

export default FilterCard
