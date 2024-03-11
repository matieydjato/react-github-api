import { useInfiniteQuery } from "react-query";

const fetchUsers = async (pageParam) => {
    const response = await fetch(`https://api.github.com/users?since=${pageParam}&per_page=10`);
    const users = await response.json();
    return users; 
};

const useUsersList = () => {
    return useInfiniteQuery(
        'users',
        async ({ pageParam = 0 }) => fetchUsers(pageParam),
        {
            getNextPageParam: (lastPage) => lastPage.length >= 5 ? lastPage[lastPage.length-1]?.id : undefined,
        }
    );
}

export default useUsersList;