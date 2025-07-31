import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";

const useChannel = (username) => {
  // console.log("usename", username)
  const [user, setUser] = useState("");

  const getChannelProfile = async () => {
  try {
    const res = await axios.get(`${base_url}/api/v1/users/c/${username}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log("channel profile",res.data)
    setUser(res.data.data);
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


  useEffect(() => {
    if (username) {
      getChannelProfile();
    }
  }, [username]);
  return { user, getChannelProfile: getChannelProfile };
};

export default useChannel;
