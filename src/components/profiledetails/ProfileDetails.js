import { Label, MessageBar, MessageBarType, Persona, PersonaPresence, PersonaSize, Pivot, PivotItem, PrimaryButton, Spinner, SpinnerSize, Stack, StackItem } from "@fluentui/react";
import { Icon } from '@fluentui/react';
import { useQuery } from "react-query";
import RepositoryList from "../repositorylist/RepositoryList";
import FollowerList from "../followerlist/FollowerList";
import { memo } from "react";
import { formatNumber } from "../../functions/FormatNumber";

const rowProps = { horizontal: true, verticalAlign: 'center' };

const tokens = {
    sectionStack: {
        childrenGap: 10,
    },
    spinnerStack: {
        childrenGap: 20,
    },
};

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.userLogin === nextProps.userLogin;
};

const ProfileDetails = ({userLogin}) => {
    const { data: userDetails, isError, isLoading } = useQuery(['user', userLogin], async () => {
        const response = await fetch(`https://api.github.com/users/${userLogin}`);
        const user = await response.json();
        return user;    
    });

    if(isLoading) {
        return (
            <Stack {...rowProps} tokens={tokens.spinnerStack}>
                <Label>Wait for loading</Label>
                <Spinner size={SpinnerSize.large} />
            </Stack>
        )
    }

    if(isError) {
        return (
            <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
            >
                Sorry, can't access this page, check your internet connection.
            </MessageBar>
        )
    }

    const personaProperties = {
        imageUrl: userDetails.avatar_url,
        imageInitials: userDetails.login,
        text: userDetails.name,
        secondaryText: userDetails.company ,
        optionalText: userDetails.followers,
    };

    const renderSecondaryText = () => {
        if(userDetails.blog !== '') {
            return (
                <div style={{paddingTop: 2}}>
                     {userDetails.login}
                </div>
            );
        }
    };

    const renderTertiaryText = () => {
        return (
            <div style={{paddingTop: 5}}>
                <Icon iconName="People"/> {formatNumber(userDetails.followers)} followers . {formatNumber(userDetails.following)} following
            </div>
        );
    };

    const renderOptionalText = () => {
        return (
            <div style={{paddingTop: 7}}>
                <PrimaryButton
                    href={userDetails.blog}
                    text="Open blog"
                />
            </div>
        );
    };

    return (
        <Stack data-testid="detailsDocument">
            <StackItem >
                <Persona
                    {...personaProperties}
                    size={PersonaSize.size100}
                    presence={PersonaPresence.away}
                    onRenderSecondaryText={renderSecondaryText}
                    onRenderTertiaryText={renderTertiaryText}
                    onRenderOptionalText={userDetails.blog ? renderOptionalText: ''}
                />  
            </StackItem>

            <StackItem style={{paddingTop: 15}}>
                <Pivot aria-label="User details pivot" data-testid="pivot-element">
                    <PivotItem headerText="About">
                        <div style={{marginTop: 20}}>
                            {userDetails.bio ? userDetails.bio : 'No description available'}
                        </div>

                        {userDetails.company ? <div style={{marginTop: 20}}>
                            <Icon iconName="CityNext2"/> {userDetails.company}
                        </div> : ''}

                        {userDetails.location ? <div style={{marginTop: 5}}>
                            <Icon iconName="POISolid"/> {userDetails.location}
                        </div> : ''}
                    </PivotItem>

                    <PivotItem headerText={"Repositories ("+formatNumber(userDetails.public_repos)+')'}>
                        <RepositoryList repos_url={userDetails.repos_url}/>
                    </PivotItem>

                    <PivotItem headerText={"Followers ("+formatNumber(userDetails.followers)+')'}>
                        <FollowerList followers_url={userDetails.followers_url}/>
                    </PivotItem>
                </Pivot>
            </StackItem>
        </Stack>
    )
};

export default memo(ProfileDetails, arePropsEqual);