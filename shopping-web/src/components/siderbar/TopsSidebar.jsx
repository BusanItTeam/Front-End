import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopsSidebar = () => {
  const [manDropdown, setManDropdown] = useState(false);
  const [womanDropdown, setWomanDropdown] = useState(false);

  return (
    <div className="w-48 bg-gray-100 p-4 border-r border-gray-200">
      {/* MAN Section */}
      <div className="mb-4">
        <button
          className="text-wrapper block w-full text-left p-2 bg-white rounded-md shadow hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-center"
          onClick={() => setManDropdown(!manDropdown)}
        >
          MAN
          <img className="w-4 h-4" src="/dropdown.png" alt="dropdown" />
        </button>

        {manDropdown && (
          <ul className="mt-2 bg-white shadow rounded-md">
            <li>
              <Link
                to="/category/tops/topsshort"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                반팔
              </Link>
            </li>
            <li>
              <Link
                to="/category/tops/topslong"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                긴팔
              </Link>
            </li>
            <li>
              <Link
                to="/category/tops/shirts"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                셔츠
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* BEST Section */}
      <div className="mb-4">
        <Link
          to="/best"
          className="text-wrapper block w-full text-left p-2 bg-white rounded-md shadow hover:bg-gray-50 transition duration-150 ease-in-out"
        >
          BEST
        </Link>
      </div>

      {/* WOMAN Section */}
      <div>
        <button
          className="text-wrapper block w-full text-left p-2 bg-white rounded-md shadow hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-center"
          onClick={() => setWomanDropdown(!womanDropdown)}
        >
          WOMAN
          <img className="w-4 h-4" src="/dropdown.png" alt="dropdown" />
        </button>

        {womanDropdown && (
          <ul className="mt-2 bg-white shadow rounded-md">
            <li>
              <Link
                to="/category/tops/wtopshort"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                반팔
              </Link>
            </li>
            <li>
              <Link
                to="/category/tops/wtoplong"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                긴팔
              </Link>
            </li>
            <li>
              <Link
                to="/category/tops/wshirts"
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                셔츠
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopsSidebar;
