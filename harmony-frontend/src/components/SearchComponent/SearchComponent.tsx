import {useEffect, useState} from "react";

function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // console.log(searchTerm)
            onSearch(searchTerm);
        }, 2000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    return (
        <input
            autoFocus
            type="text"
            autoComplete='off'
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search here..."
            className="py-1 px-6 border mt-3 mb-3 border-fuchsia-900 rounded-full"
        />
    )
}

export default Search;