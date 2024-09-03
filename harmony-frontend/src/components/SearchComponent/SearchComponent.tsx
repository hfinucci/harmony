import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

function Search({ onSearch, setSearchEntities }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length == 0 || searchTerm.trim() === "") {
                setSearchEntities([])
            }
            if (searchTerm.length >= 2) {
                onSearch(searchTerm);
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    // Si entendes lo que estoy haciendo aca ignoralo y segui con tu vida
    function cleanContent() {
        setTimeout(function(){
            setSearchEntities([])
            setSearchTerm('')
        }, 500);
    }

    return (
        <input
            type="text"
            autoComplete="off"
            value={searchTerm}
            onBlur={cleanContent}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("pages.search.placeholder")}
            className="py-1 px-6 mt-3 mb-3 rounded-full ring-1 ring-gray-300 focus:ring-violet-500"
        />
    )
}

export default Search;