import React from "react"; 
import { render, waitFor } from "@testing-library/react";
import { useQuery } from 'react-query';
import RepositoryList from "../repositorylist/RepositoryList";  

jest.mock('react-query'); 

describe('RepositoryList', () => {
    test('render the content fetched from the API', async () => {
        const repoList = [
            { id:26899533, name: "30daysoflaptops.github.io"},
            { id:17358646, name: "asteroids"},
        ];
    
        useQuery.mockReturnValueOnce({ data: repoList, isLoading: false });
    
        const url = 'https://api.github.com/users/mojombo/repos';
        const { getAllByText } = render(<RepositoryList repos_url={url} />);
    
        await waitFor(() => {
            repoList.forEach(follower => {
                const elements = getAllByText(follower.name);
        
                expect(elements.length).toBeGreaterThan(0);
            });
        });
    });
});