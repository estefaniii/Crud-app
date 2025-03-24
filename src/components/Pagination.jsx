import React from 'react';
import {
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
} from 'react-icons/lu';

function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="pagination">
			<button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
				<LuChevronsLeft />
			</button>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<LuChevronLeft />
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<LuChevronRight />
			</button>
			<button
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
			>
				<LuChevronsRight />
			</button>
		</div>
	);
}

export default Pagination;
