import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  color?: "whiteDark" | "lightDark";
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  active = false,
  color = "whiteDark",
  small = false,
}) => {
  const baseClasses = "rounded font-medium transition-colors";
  const sizeClasses = small ? "px-3 py-1 text-sm" : "px-4 py-2";
  
  const colorClasses = {
    whiteDark: "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700",
    lightDark: "bg-gray-100 dark:bg-slate-700"
  };

  const activeClasses = active
    ? "text-primary-600 dark:text-primary-400"
    : "text-gray-700 dark:text-gray-200";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${colorClasses[color]}
        ${activeClasses}
        ${disabledClasses}
      `}
    >
      {label}
    </button>
  );
};

interface PaginationProps {
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  numPages,
  currentPage,
  setCurrentPage,
}) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If the number of pages is less than the total page numbers we want to show
    if (numPages <= totalPageNumbers) {
      return Array.from({ length: numPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, numPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < numPages - 2;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", numPages];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => numPages - rightItemCount + i + 1
      );
      return [1, "...", ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "...", ...middleRange, "...", numPages];
    }

    return pageNumbers;
  };

  return (
    <div className="p-3 border-t border-gray-100 dark:border-slate-800 flex justify-center items-center gap-2">
      <Button
        label="<"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        color="whiteDark"
        small
      />

      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span key={`dots-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            label={page.toString()}
            active={page === currentPage}
            color={page === currentPage ? "lightDark" : "whiteDark"}
            small
            onClick={() => setCurrentPage(page)}
          />
        )
      )}

      <Button
        label=">"
        disabled={currentPage === numPages}
        onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
        color="whiteDark"
        small
      />
    </div>
  );
};

export default Pagination;