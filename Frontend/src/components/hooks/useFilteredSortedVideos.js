import { useMemo, useState } from "react";

const useFilteredSortedVideos = (videos, searchQuery, ) => {
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

  const filteredVideos = useMemo(() => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const valA = sortKey === "likes" ? a.totalLikes || 0 : a[sortKey];
      const valB = sortKey === "likes" ? b.totalLikes || 0 : b[sortKey];

      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return filtered;
  }, [videos, searchQuery, sortKey, sortOrder]);

 

  return { filteredVideos, handleSort, sortKey, sortOrder };
};

export default useFilteredSortedVideos;
