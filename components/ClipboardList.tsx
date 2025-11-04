"use client"
import React, { useState } from "react";

const ClipboardList = () => {
  const [clips, setClips] = useState([])
  return (
    <ul className="space-y-2">
      {clips.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Nothing copied yet...
        </p>
      ) : (
        clips.map((clip, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-sm"
          >
            <span className="truncate max-w-[220px]">{clip}</span>
            <div className="flex gap-2">
              <button className="text-sm px-2 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600">
                Copy
              </button>
              <button className="text-sm px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
                🗑️
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default ClipboardList;
