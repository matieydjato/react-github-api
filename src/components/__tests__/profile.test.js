import React from "react";
import Profile from "../profile/Profile";   
import { fireEvent, render } from "@testing-library/react";

describe('Profile', () => {
    // describe('render', () => {
        it('should render a persona component', () => {
            const { getByTestId } = render(
                <Profile avatar_url="avatat.png" login="mojombo" onUserClick={() => {}}/>
            );
            const personaComponent = getByTestId('persona-component');
            expect(personaComponent).toHaveTextContent('mojombo');
            fireEvent.click(personaComponent);
        });
    // });
});