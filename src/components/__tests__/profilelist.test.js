import React from "react"; 
import { render, waitFor } from "@testing-library/react";
import { useQuery } from 'react-query';
import ProfileList from "../profileList/ProfileList";  

jest.mock('react-query'); 

describe('ProfileList', () => {
    test('render users fetched from the API', async () => {
        const usersList = [
            { id:1, login: "mojombo"},
            { id:2, login: "defunkt"},
        ];
    
        useQuery.mockReturnValueOnce({ users: usersList, isLoading: false });
    
        const { getByTestId } = render(<ProfileList />);
    
        await waitFor(() => {
            const listElement = getByTestId('list-element');

            expect(listElement).toBeInTheDocument();
        });
    });
});