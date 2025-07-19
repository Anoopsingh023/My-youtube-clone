import React, { useState } from 'react'

const useFilteredSortedPlaylist = (playlists, searchQuery) => {
    const [sortKey, setSortKey] = useState("createdAt");
      const [sortOrder, setSortOrder] = useState("desc");
    
      const handleSort = (key) => {
        if (sortKey === key) {
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
          setSortKey(key);
          setSortOrder("asc");
        }
      };
    
      const filteredPlaylists = useMemo(() => {
        const filtered = playlists.filter((playlist) =>
          playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
    
        filtered.sort((a, b) => {
          const valA = sortKey === "likes" ? a.totalLikes || 0 : a[sortKey];
          const valB = sortKey === "likes" ? b.totalLikes || 0 : b[sortKey];
    
          if (sortOrder === "asc") return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        });
    
        return filtered;
      }, [playlists, searchQuery, sortKey, sortOrder]);
    
      return { filteredPlaylists, handleSort, sortKey, sortOrder };
}

export default useFilteredSortedPlaylist