import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useState } from "react";

const Sidebar = () => {
  const [manDropdown, setManDropdown] = useState(false);
  const [womanDropdown, setWomanDropdown] = useState(false);

  return (
    <div className="frame p-4 w-48 bg-gray-100">
      {/* MAN Section */}
      <div>
        <Link
          to="/category/pants"
          className="text-wrapper block w-full text-left p-2 bg-white rounded-md shadow"
          onClick={() => setManDropdown(!manDropdown)}
        >
          MAN
        </Link>

        {manDropdown && (
          <ul className="mt-2 bg-white shadow rounded-md">
            <li>
              <Link
                to="/category/pants/short"
                className="block p-2 hover:bg-gray-200"
              >
                반바지
              </Link>
            </li>
            <li>
              <Link
                to="/category/pants/long"
                className="block p-2 hover:bg-gray-200"
              >
                긴바지
              </Link>
            </li>
            <li>
              <Link
                to="/category/pants/jeans"
                className="block p-2 hover:bg-gray-200"
              >
                청바지
              </Link>
            </li>
          </ul>
        )}
      </div>

      <div className="frame">
        <div className="box"></div> {/* 사이드바 오른쪽에 라인 추가 */}
        <div className="div">
          <a href="/best" className="text-wrapper">
            BEST
          </a>
          <img className="drop-down" src="/dropdown.png" />
        </div>
        {/* WOMAN Section */}
        <div>
          <Link
            to="/category/pants"
            className="text-wrapper block w-full text-left p-2 bg-white rounded-md shadow"
            onClick={() => setWomanDropdown(!womanDropdown)}
          >
            WOMAN
          </Link>

          {womanDropdown && (
            <ul className="mt-2 bg-white shadow rounded-md">
              <li>
                <Link
                  to="/category/pants/short"
                  className="block p-2 hover:bg-gray-200"
                >
                  반바지
                </Link>
              </li>
              <li>
                <Link
                  to="/category/pants/long"
                  className="block p-2 hover:bg-gray-200"
                >
                  긴바지
                </Link>
              </li>
              <li>
                <Link
                  to="/category/pants/jeans"
                  className="block p-2 hover:bg-gray-200"
                >
                  청바지
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
