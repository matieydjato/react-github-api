import { Persona, PersonaSize } from "@fluentui/react";
import { memo } from "react";

// Condition to memoize component
const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.avatar_url === nextProps.avatar_url && 
    prevProps.login === nextProps.login 
};

// Profile component declaration
const Profile = ({avatar_url, login}) => {
    const personaProperties = {
        imageUrl: avatar_url,
        imageInitials: login,
        text: login,
    };

    return (
        <Persona
            {...personaProperties}
            size={PersonaSize.size40}
            imageAlt={login}
            style={{root:{cursor:'pointer'}}}
            data-testid="persona-component"
        />
    )
};

// Export Profile memoized component with condition
export default memo(Profile, arePropsEqual);