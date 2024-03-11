import React from "react";
import { render } from "@testing-library/react";
import Repository from "../repository/Repository";

describe('Repository', () => {
    // describe('render', () => {
        it('should always render content for repository', () => {
            const { getByTestId, getByRole } = render(
                <Repository html_url="repo.github.org" name="repo" language="css" description="description"/>
            );

            const linkElement = getByRole('link', { href: 'repo.github.org'})
            const contentElement = getByTestId('contentElement');

            expect(linkElement).toBeInTheDocument();
            expect(contentElement).toHaveTextContent(/repo|css|description/);
        })
    // });
});