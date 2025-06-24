import React, { useState } from 'react';

const ReportButtons = () => {
    const [showButtons, setShowButtons] = useState(false);

    const toggleButtons = () => setShowButtons(!showButtons);

    const buttonList = [
        { label: "Today's Data", color: "text-green-600" },
        { label: "Early Leave", color: "text-green-600" },
        { label: "Late In", color: "text-green-600" },
        { label: "Full Report", color: "text-green-600" },
        { label: "Excel Summary", color: "text-green-600" },
        { label: "Absent", color: "text-red-600" }
    ];

    return (
        <div className="relative">
            <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-all"
                onClick={toggleButtons}
            >
                Get Report &gt;
            </button>

            <div
                className={`absolute top-full left-0 mt-2 flex gap-3 transition-all duration-500 ${showButtons ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
                    }`}
            >
                {buttonList.map((btn, i) => (
                    <button
                        key={i}
                        className={`bg-green-50 ${btn.color} px-3 py-2 rounded shadow transition-all hover:scale-105`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReportButtons;
