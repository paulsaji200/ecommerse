import React from 'react'
import Homecomp from '../../components/user/Homecomp'
import Nav from '../../components/global/Nav'
import FilterComponent from '../../components/user/sorting'
const Homepage = () => {
  return (
    <div className='flex'>
      <FilterComponent/>
      <Homecomp/>
    </div>
  )
}

export default Homepage
