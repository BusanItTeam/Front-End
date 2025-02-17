import React, { useState, useEffect } from "react";
import api from "../../services/Api";

function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberLevel, setMemberLevel] = useState("");
  const [memberPoint, setMemberPoint] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // const response = await api.get("/members");
      // setMembers(response.data);

      // 더미 데이터 추가
      const dummyData = [
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          joinDate: "2024-05-01",
          lastLogin: "2024-05-15",
          memberLevel: "일반",
          memberPoint: 1000,
        },
        {
          id: 2,
          name: "김철수",
          email: "kim@example.com",
          joinDate: "2024-04-20",
          lastLogin: "2024-05-10",
          memberLevel: "VIP",
          memberPoint: 2500,
        },
        {
          id: 3,
          name: "이영희",
          email: "lee@example.com",
          joinDate: "2024-03-15",
          lastLogin: "2024-05-05",
          memberLevel: "VVIP",
          memberPoint: 5000,
        },
        {
          id: 4,
          name: "박민지",
          email: "park@example.com",
          joinDate: "2024-02-28",
          lastLogin: "2024-05-01",
          memberLevel: "일반",
          memberPoint: 500,
        },
        {
          id: 5,
          name: "최준호",
          email: "choi@example.com",
          joinDate: "2024-01-10",
          lastLogin: "2024-04-25",
          memberLevel: "VIP",
          memberPoint: 3000,
        },
      ];
      setMembers(dummyData);
    } catch (error) {
      console.error("회원 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setMemberLevel(member.memberLevel);
    setMemberPoint(member.memberPoint);
  };

  const handleMemberLevelChange = (e) => {
    setMemberLevel(e.target.value);
  };
  const handleMemberPointChange = (e) => {
    setMemberPoint(e.target.value);
  };

  const updateMemberInfo = async () => {
    if (!selectedMember) return;

    try {
      // await api.put(`/members/${selectedMember.id}`, {
      //   memberLevel,
      //   memberPoint,
      // });
      // fetchMembers();
      setSelectedMember(null);
      alert("회원 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("회원 정보 업데이트에 실패했습니다.", error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      // await api.delete(`/members/${memberId}`);
      // fetchMembers();
      const newMembersList = members.filter((member) => member.id !== memberId);
      setMembers(newMembersList);

      alert("회원 정보가 삭제되었습니다.");
    } catch (error) {
      console.error("회원 정보 삭제에 실패했습니다.", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">회원 관리</h2>

      {/* 회원 목록 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">회원 목록</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">회원 ID</th>
              <th className="border p-2">이름</th>
              <th className="border p-2">이메일</th>
              <th className="border p-2">등급</th>
              <th className="border p-2">포인트</th>
              <th className="border p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="border p-2">{member.id}</td>
                <td className="border p-2">{member.name}</td>
                <td className="border p-2">{member.email}</td>
                <td className="border p-2">{member.memberLevel}</td>
                <td className="border p-2">{member.memberPoint}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 회원 상세 정보 및 수정 */}
      {selectedMember && (
        <div>
          <h3 className="text-xl font-semibold mb-2">회원 상세 정보</h3>
          <div className="mb-4">
            <p>회원 ID: {selectedMember.id}</p>
            <p>이름: {selectedMember.name}</p>
            <p>이메일: {selectedMember.email}</p>
            <p>가입일: {selectedMember.joinDate}</p>
            <p>최근 접속일: {selectedMember.lastLogin}</p>
          </div>

          {/* 회원 등급 설정 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">회원 등급 변경:</label>
            <select
              value={memberLevel}
              onChange={handleMemberLevelChange}
              className="border p-2 rounded"
            >
              <option value="일반">일반</option>
              <option value="VIP">VIP</option>
              <option value="VVIP">VVIP</option>
            </select>
          </div>
          {/* 회원 포인트 설정 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              회원 포인트 변경:
            </label>
            <input
              type="number"
              value={memberPoint}
              onChange={handleMemberPointChange}
              className="border p-2 rounded"
            />
          </div>

          {/* 정보 업데이트 */}
          <div>
            <button
              onClick={updateMemberInfo}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              회원 정보 업데이트
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberManagement;
