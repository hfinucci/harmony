import { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';

function ItemComponent({ item }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col bg-white hover:bg-gray-200 rounded pl-3 pr-3 pb-2 pt-2 transition-colors duration-100 cursor-pointer relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center">
                <h1 className={"text-lg"}>{item.name}</h1>
                {isHovered && <FaAngleRight className="text-gray-600 transition-transform duration-100" />}
            </div>
            <h1 className={"text-sm text-gray-600"}>{item.category}</h1>
        </div>
    );
}

export default ItemComponent;
