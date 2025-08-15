import { createContext, useContext } from "react";

export const VideoContext = createContext();

export const useUserVideos = () => useContext(VideoContext);

export const useRandomVideos = () => useContext(VideoContext);

// export const useUserPlaylist = () => useContext(VideoContext);

export const useSubscription = () => useContext(VideoContext);

export const useHistory = () => useContext(VideoContext);
