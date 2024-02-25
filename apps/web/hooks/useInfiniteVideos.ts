import { useInfiniteQuery } from '@tanstack/react-query';

const fetchVideos = async ({ pageParam = 1 }) => {
    const res = await fetch(`/api/videos?page=${pageParam}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const nextPage = data.nextPage; // Adjust based on your API response
    return { data: data.items, nextPage };
};

export function useInfiniteVideos() {
    return useInfiniteQuery({
        queryKey: ['videos'],
        queryFn: fetchVideos,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: undefined, // Explicitly set to undefined
    });
}