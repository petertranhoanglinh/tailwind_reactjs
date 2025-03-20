

"use client";
export default function FormGrid({ columns = 2, children }) {
    return (
        <div className={`grid grid-cols-1 gap-3 md:grid-cols-${columns} mb-6 last:mb-0`}>
          {children}
        </div>
      );
};

 

