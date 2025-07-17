import React, {useState, useEffect } from "react";
import axios from "axios";

const useSubscription = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const fetchSubscribedChannel = () => {
    axios
      .get(
        `http://localhost:8000/api/v1/subscriptions/u/${localStorage.getItem(
          "userId"
        )}`,
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

  useEffect(()=>{
    fetchSubscribedChannel()
  })

  return {subscribedChannels}
};

export default useSubscription;
