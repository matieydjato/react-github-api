import { SearchBox } from "@fluentui/react";
import { memo } from "react";

const Search = ({setSearchTerm}) => {
    // Search handler function
    const handleSearch = e => {
        // Set search term state
        setSearchTerm(e.target.value);
    };

    return (
        <SearchBox placeholder="Search" onChange={handleSearch}/>
    )
}

export default memo(Search);