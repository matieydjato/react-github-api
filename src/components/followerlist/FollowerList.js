import { FocusZone, FocusZoneDirection, Label, List, MessageBar, MessageBarType, Spinner, SpinnerSize, Stack, getFocusStyle, getTheme, mergeStyleSets } from "@fluentui/react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Suspense, lazy, memo, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Profile from "../profile/Profile";

const fetchFollowers = async (followers_url, pageParam) => {
    const response = await fetch(`${followers_url}?page=${pageParam}&per_page=10`);
    const users = await response.json();
    return users; 
};

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

const listStyles = {
    height: '700px',
    overflowY: 'auto',
}

const onRenderCell = (follower) => {
    return (
        <div style={{paddingTop: 15}} key={follower.id}>
            <Profile {...follower}/>
        </div>
    );
}; 

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.followers_url === nextProps.followers_url;
};

const FollowerList = ({followers_url}) => {
    const [nextId, setNextPage] = useState(1);
    const [previousId, setPreviousPage] = useState(1);

    const { 
        data: userFollowers, 
        isError, 
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(
        'user-followers', 
        ({ pageParam = 1 }) => fetchFollowers(followers_url, pageParam),
        {
            getNextPageParam: () => nextId+1 ?? undefined
        }    
    );

    const pages = userFollowers?.pages.flatMap((page) => page);
    
    const { ref: observerRef, inView } = useInView();
    
        useEffect(() => {
            if (inView) {
                setNextPage(nextId+1)
                fetchNextPage()
            }
        }, [inView, fetchNextPage])

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

    return (
        // <FocusZone direction={FocusZoneDirection.vertical}>
            <div className="list-container" style={listStyles}>
                {/* <List items={userFollowers?.pages.flat()} onRenderCell={onRenderCell}/> */}

                {userFollowers?.pages.flat().map((user) => (
                    <div key={user.id} className={`${classNames.itemCell}`}>
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
                    </button>
                </div>

                <div>
                    {isFetching && !isFetchingNextPage
                        ? 'Background Updating...'
                        : null}
                </div>
            </div>
        // </FocusZone>
    )
}

export default FollowerList;