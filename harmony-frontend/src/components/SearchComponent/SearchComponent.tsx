import {useEffect, useState} from "react";

function Search({ onSearch, setSearchEntities }) {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            console.log(searchTerm)
            if (searchTerm === "" || searchTerm.length == 0) {
                setSearchEntities([])
            }
            if (searchTerm.length >= 2) {
                onSearch(searchTerm);
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    return (
        <input
            type="text"
            autoComplete='off'
            onBlur={() => setSearchEntities([])}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search here..."
            className="py-1 px-6 border mt-3 mb-3 border-fuchsia-900 rounded-full"
        />
    )
}

export default Search;