import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="frame">
      <div classNameName="box"></div> {/* 사이드바 오른쪽에 라인 추가 */}
      <div className="div">
        <a href="/best" className="text-wrapper">
          BEST
        </a>
        <img className="drop-down" src="/dropdown.png" />
      </div>
      <div className="div-2">
        <a href="/new" className="text-wrapper">
          NEW
        </a>
        <img className="drop-down" src="/dropdown.png" />
      </div>
      <a href="/outer" className="text-wrapper-2">
        아우터
      </a>
      <a href="/onepiece" className="text-wrapper-2">
        원피스
      </a>
      <a href="/knit" className="text-wrapper-2">
        니트
      </a>
      <a href="/tee" className="text-wrapper-2">
        티셔츠
      </a>
      <a href="/blouse" className="text-wrapper-2">
        블라우스
      </a>
      <a href="/skirt" className="text-wrapper-2">
        스커트
      </a>
      <a href="/pants" className="text-wrapper-2">
        팬츠
      </a>
    </div>
  );
};

export default Sidebar;
