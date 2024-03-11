import { FocusZone, FocusZoneDirection, Label, List, MessageBar, MessageBarType, Spinner, SpinnerSize, Stack } from "@fluentui/react";
import { Suspense, lazy, memo, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import Repository from "../repository/Repository";
import { useInView } from "react-intersection-observer";

const fetchRepos = async (repos_url, pageParam) => {
    const response = await fetch(`${repos_url}?page=${pageParam}&per_page=10`);
    const repos = await response.json();
    return repos; 
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

const listStyles = {
    height: '700px',
    overflowY: 'auto',
}

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps.repos_url === nextProps.repos_url;
};

const RepositoryList = ({repos_url}) => {
    const [nextId, setNextPage] = useState(1);

    const { 
        data: userRepos, 
        isError, 
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(
        'user-repos', 
        ({ pageParam = 1 }) => fetchRepos(repos_url, pageParam),
        {
            getNextPageParam: () => nextId+1 ?? undefined
        }    
    );

    const pages = userRepos?.pages.flatMap((page) => page);
    
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

    const onRenderCell = (repo) => {
        return (
            <div style={{paddingTop: 10}} key={repo.id}>
                <Repository {...repo}/>
            </div>
        );
    }; 

    return (
        <FocusZone direction={FocusZoneDirection.vertical}>
            <div className="list-container" style={listStyles}>
                {/* <List items={pages} onRenderCell={onRenderCell}/> */}

                {userRepos?.pages.flat().map((repo) => (
                    <div style={{paddingTop: 10}} key={repo.id}>
                        <Repository {...repo}/>
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
        </FocusZone>
    )
};

export default memo(RepositoryList, arePropsEqual);