import React from 'react';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import "./Pagination.css"
import {useTranslation} from "react-i18next";

const Pagination = ({ page, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="pagination">
            <button className="bg-fuchsia-200 text-fuchsia-950 rounded-full text-xl hover:bg-fuchsia-400" onClick={handlePrevious} disabled={page === 1}>
                <MdNavigateBefore />
            </button>
            <span>
                {t("components.pagination.page")} {page} {t("components.pagination.of")} {totalPages}
            </span>
            <button className="bg-fuchsia-200 text-fuchsia-950 rounded-full text-xl hover:bg-fuchsia-400" onClick={handleNext} disabled={page === totalPages}>
                <MdNavigateNext />
            </button>
        </div>
    );
};

export default Pagination;
