import axios from 'axios'
import React, { useState } from 'react'
import { base_url } from '../../utils/constant'

const useUserDetail = () => {
    const [user,setUser] = useState("")

    const fetchUserProfile = (userId)=>{
        axios
        .get(`${base_url}/api/v1/users/c/${usename}`)
    }
  return
}

export default useUserDetail