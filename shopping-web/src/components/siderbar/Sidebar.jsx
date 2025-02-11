// import React from "react";
// import "./Sidebar.css";

// const Sidebar = () => {
//   return (
//     <div className="frame">
//       <div classNameName="box"></div> {/* 사이드바 오른쪽에 라인 추가 */}
//       <div className="div">
//         <a href="/productcategory" className="text-wrapper">
//           ALL
//         </a>
//       </div>
//       <a href="/category/pants" className="text-wrapper-2">
//         바지
//       </a>
//       <a href="/category/tops" className="text-wrapper-2">
//         상의
//       </a>
//       <a href="/category/outerwear" className="text-wrapper-2">
//         아우터
//       </a>
//       <a href="/category/dresses" className="text-wrapper-2">
//         원피스s
//       </a>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="frame">
      <div className="div">
        <Link to="/productcategory" className="text-wrapper">
          ALL
        </Link>
      </div>
      <Link to="/category/tops" className="text-wrapper-2">
        바지
      </Link>
      <Link to="/category/pants" className="text-wrapper-2">
        상의
      </Link>
      <Link to="/category/outerwear" className="text-wrapper-2">
        아우터
      </Link>
      <Link to="/category/dresses" className="text-wrapper-2">
        원피스
      </Link>
    </div>
  );
};

export default Sidebar;
