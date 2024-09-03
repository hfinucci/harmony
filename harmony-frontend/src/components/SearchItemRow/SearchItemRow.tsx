import {useEffect, useState} from 'react';
import { FaAngleRight } from 'react-icons/fa';

export interface ItemView {
    name: string;
    category: string;
    id: number;
}

function SearchItemRow({ item, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col bg-white hover:bg-gray-200 rounded pl-3 pr-3 pb-2 pt-2 transition-colors duration-100 cursor-pointer relative z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(item)}
        >
            <div className="flex justify-between items-center">
                <h1 className={"text-lg"}>{item.name}</h1>
                {isHovered && <FaAngleRight className="text-gray-600 transition-transform duration-100" />}
            </div>
            <h1 className={"text-sm text-gray-600"}>{item.category}</h1>
        </div>
    );
}

export default SearchItemRow;
