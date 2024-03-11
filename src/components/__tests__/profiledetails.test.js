import React from "react";
import { render, waitFor } from "@testing-library/react";
import ProfileDetails from '../profiledetails/ProfileDetails'
import { QueryClientProvider, QueryClient } from 'react-query';

describe('ProfileDetails', () => {
    // describe('render', () => {
        let queryClient;

        beforeAll(() => {
            queryClient = new QueryClient();
        });

        it('should render Pivot', async () => {
            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <ProfileDetails userLogin={'mojombo'}/>
                </QueryClientProvider>
            );

            // Wait for the loading state to change
            await waitFor(() => {
                // Verify after loading state changes
                const pivotElement  = getByTestId('pivot-element')
                expect(pivotElement).toHaveTextContent('Repositories');
                expect(pivotElement).toHaveTextContent('Followers');
            });
        });
    // });
});