"use client";

export default function FormGrid({ columns = 2, children }) {
  if (columns === 2) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-6 last:mb-0">
        {children}
      </div>
    );
  } else if (columns === 3) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-6 last:mb-0">
        {children}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 gap-3 mb-6 last:mb-0">
        {children}
      </div>
    );
  }
}
