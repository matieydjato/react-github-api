import React from "react"; 
import { render, waitFor } from "@testing-library/react";
import { useQuery } from 'react-query';
import FollowerList from "../followerlist/FollowerList";  

jest.mock('react-query'); 

describe('FollowerList', () => {
    test('render the content fetched from the API', async () => {
        const followersList = [
            { id:2, login: "defunkt"},
            { id:3, login: "pjhyett"},
        ];
    
        useQuery.mockReturnValueOnce({ data: followersList, isLoading: false });
    
        const url = 'https://api.github.com/users/mojombo/followers';
        const { getAllByText } = render(<FollowerList followers_url={url} />);
    
        await waitFor(() => {
            followersList.forEach(follower => {
                const elements = getAllByText(follower.login);
        
                expect(elements.length).toBeGreaterThan(0);
            });
        });
    });
});