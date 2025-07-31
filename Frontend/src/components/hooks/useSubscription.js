import React, {useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";

const useSubscription = (userId) => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const fetchSubscribedChannel = () => {
    axios
      .get(
        `${base_url}/api/v1/subscriptions/u/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("subscribed channels by user", res.data);
        const userData = res.data?.data?.[0]; // null-safe access
        const channels = userData?.subscribedChannel || []; // fallback to empty array
        setSubscribedChannels(channels);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSubscription = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/api/v1/subscriptions/c/${userId}`, {}, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log("toggle subscription",res.data)
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


  useEffect(()=>{
    fetchSubscribedChannel()
  },[])

  return {subscribedChannels, toggleSubscription:toggleSubscription}
};

export default useSubscription;
