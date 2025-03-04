import React from 'react'
import { useMyContext } from '../../store/ContextApi'

const PointHistory = () => {
    const {currentUser} = useMyContext();
    console.log("커런트 유저 정보:", currentUser);

  return (
    <div>PointHistewqewqeqeqeory {currentUser?.username}</div>
  )
}

export default PointHistory