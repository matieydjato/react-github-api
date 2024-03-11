import React, { useState } from "react";
import { render } from "@testing-library/react";
import Search from '../search/Search';

describe('Search', () => {
    // describe('render', () => {
        it('should render a persona component', () => {
            const { getByRole } = render(
                <Search setSearchTerm={() => {}}/>
            );
            const searchboxElement = getByRole('searchbox')
            expect(searchboxElement).toBeInTheDocument();
        });
    // });
});