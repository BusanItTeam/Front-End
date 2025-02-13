import React from "react";
import { Link } from "react-router-dom";

function BoardList() {
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">MY BOARD</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <label className="text-sm text-gray-600">분류 선택</label>
          <select className="border p-1 text-sm">
            <option>작성 일자별</option>
            <option>분류별</option>
          </select>
        </div>
      </div>

      <table className="w-full border-t text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-2">번호</th>
            <th className="py-2">분류</th>
            <th className="py-2">제목</th>
            <th className="py-2">작성자</th>
            <th className="py-2">작성일</th>
            <th className="py-2">답변</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" className="py-4 text-gray-500">
              게시물이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex items-center">
        <div className="flex-grow flex justify-center space-x-2">
          <select className="border p-1 text-sm">
            <option>제목</option>
            <option>내용</option>
            <option>작성자</option>
          </select>
          <input type="text" className="border p-1 text-sm w-48" placeholder="검색어 입력" />
          <button className="bg-gray-400 text-white px-4 py-1 text-sm rounded">찾기</button>
        </div>
        <div>
          <Link to="/myPage/inquiryForm">
            <button className="bg-gray-400 text-white px-4 py-1 text-sm rounded">글쓰기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BoardList;
