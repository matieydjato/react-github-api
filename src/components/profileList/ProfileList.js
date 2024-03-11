import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useInfiniteQuery } from "react-query";
import ProfileDetails from "../profiledetails/ProfileDetails";
import { Label, MessageBar, MessageBarType, Spinner, SpinnerSize, Stack, getFocusStyle, getTheme, mergeStyleSets } from "@fluentui/react";
import Search from "../search/Search";
import { useInView } from 'react-intersection-observer';

const fetchUsers = async (pageParam) => {
    const response = await fetch(`https://api.github.com/users?since=${pageParam}&per_page=10`);
    const users = await response.json();
    return users; 
};

// Lazy loading profile component
const Profile = lazy(() => import('../profile/Profile'))

// Styles
const rowProps = { horizontal: true, verticalAlign: 'center' };

const tokens = {
    sectionStack: {
        childrenGap: 10,
    },
    spinnerStack: {
        childrenGap: 20,
    },
};

const theme = getTheme();

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            padding: 10,
            boxSizing: 'border-box',
            display: 'flex',
            selectors: {
            '&:hover': { background: '#faf9f8' },
            },
        },
    ],
    itemCellClick: {
        background: '#d7e9f3'
    }
});

const leftStyles = {
    // borderRight: '1px solid #eee',
}

const listStyles = {
    height: '895px',
    overflowY: 'auto',
    paddingTop: '15px'
}

const rightStyles = {
    padding: '35px',
    paddingTop: '25px'
}

// Declaring ProfileList functional component
const ProfileList = () => {
    // Get users from github api using React Query
    const { 
        data: users, 
        isError, 
        isLoading,   
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteQuery(
        'users',
        async ({ pageParam = 0 }) => fetchUsers(pageParam),
        {
            getNextPageParam: (lastPage) => lastPage.length >= 5 ? lastPage[lastPage.length-1]?.id : undefined,
        }
    );

    // States
    const [selectedUserLogin, setSelectedUserLogin] = useState(); // Selected user state
    const [searchTerm, setSearchTerm] = useState(''); // Search  state
    const { ref: observerRef, inView } = useInView();

    // Users list filtered by search term
    const filteredUsers = users?.pages.flatMap((page) => page).filter(user =>
        user.login?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    useEffect(() => {
        if (inView || searchTerm) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage])

    

    // User click handler function
    const onUserClick = (userLogin) => {
        setSelectedUserLogin(userLogin);
    };

    // When users list is loading
    if(isLoading) {
        return (
            <Stack {...rowProps} tokens={tokens.spinnerStack}>
                <Label>Wait for loading</Label>
                <Spinner size={SpinnerSize.large} />
            </Stack>
        )
    }

    // If error when getting users from api
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

    return (
        <div className="ms-Grid" dir="ltr" data-testid="list-element">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3" style={leftStyles}>
                    <Search setSearchTerm={setSearchTerm}/>

                    <div className="list-container" style={listStyles}>
                        {filteredUsers.map((user) => (
                            <div key={user.id} className={`${classNames.itemCell} ${selectedUserLogin === user.login ? classNames.itemCellClick : ''}`} onClick={() => onUserClick(user.login)}>
                                <Suspense fallback={<Spinner size={SpinnerSize.small} />}>
                                    <Profile {...user}/>
                                </Suspense>
                            </div>
                        ))}

                        <div>
                            <button
                                ref={observerRef}
                                onClick={() => fetchNextPage()}
                                disabled={!hasNextPage || isFetchingNextPage}
                            >
                                Load more...
                            </button>
                        </div>

                        <div>
                            {isFetching && !isFetchingNextPage
                            ? 'Background Updating...'
                            : null}
                        </div>
                    </div>
                </div>

                <div className="ms-Grid-col ms-lg9" style={rightStyles}>
                    {/* User details component call here if an user is clicked */}
                    {selectedUserLogin ? <ProfileDetails userLogin={selectedUserLogin}/> : ''}
                </div>
            </div>
        </div>
    )
};

// Export ProfileList component
export default ProfileList