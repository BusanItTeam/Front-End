import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/Api.jsx";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegCalendarAlt, FaUserShield } from "react-icons/fa";
import { Button } from "@mui/material";
import { MdDateRange, MdOutlineEmail } from "react-icons/md";

// 역할명을 한글로 변환
const getRoleDisplayName = (roleName) => {
  switch (roleName) {
    case "ROLE_ADMIN":
      return <span className="font-medium">관리자</span>;
    case "ROLE_USER":
      return <span className="font-medium">일반 사용자</span>;
    default:
      return <span className="text-gray-400">알 수 없음</span>;
  }
};

const MemberManagementDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const[filteredUsers,setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userId) {
      console.error("userId가 없습니다.");
      toast.error("유효한 사용자 ID가 필요합니다.");
      return;
    }

    let isMounted = true;

    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("JWT_TOKEN");
        if (!token) {
          console.error("❌ 토큰이 없습니다.");
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          return;
        }

        console.log(`API 확인: /admin/user/${userId}`);

        const response = await api.get(`/admin/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          console.log("API 응답 데이터:", response.data);
          setUser(response.data);
        }
      } catch (err) {
        console.error("❌ API 요청 실패:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

 

  
  if (loading)
    return <p className="text-center text-lg font-medium text-gray-600">🔄 로딩 중...</p>;
  if (error)
    return <p className="text-center text-red-500 font-medium">❌ {error}</p>;
  
  const handleDeleteUser = async () => {
    if (!window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) return;
  
    try {
      const token = localStorage.getItem("JWT_TOKEN"); // ✅ JWT 토큰 가져오기
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }
  
      console.log("📢 삭제 요청 토큰:", token); // ✅ 콘솔에서 확인
  
      await api.delete(`/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT 토큰 추가
          "Content-Type": "application/json",
        },
      });
  
      toast.success("사용자가 삭제되었습니다.");
      navigate("/admin/members"); // ✅ 삭제 후 사용자 목록으로 이동
    } catch (error) {
      console.error("❌ 사용자 삭제 실패:", error.response ? error.response.data : error);
      toast.error("사용자를 삭제하는데 실패했습니다.");
    }
  };
  
  return user ? (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10 border border-gray-200">
      {/* 헤더 */}
    
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{user.name} 님의 정보</h2>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-20 border-b pb-4 mb-4">
        <p className="text-lg text-gray-700 flex items-center gap-2">
          <FaUser />
          유저 번호: <span className="text-gray-900">{user.userId || "없음"}</span>
        </p>
        <p className="text-lg text-gray-700 flex items-center gap-2">
          <FaUser />
          유저 아이디: <span className="text-gray-900">{user.userName || "없음"}</span>
        </p>
      </div>

      {/* 연락처 정보 */}
      <div className="grid grid-cols-2 gap-20 border-b pb-4 mb-4">
        <p className="text-lg text-gray-700 flex items-center gap-2">
          <MdOutlineEmail />
          이메일: <span className="text-gray-900">{user.email || "없음"}</span>
        </p>
        <p className="text-lg text-gray-700 flex items-center gap-2">
          <FaPhone />
          전화번호: <span className="text-gray-900">{user.phoneNumber || "없음"}</span>
        </p>
      </div>

      {/* 계정 정보 */}
      <div className="grid grid-cols-2 gap-20 border-b pb-4 mb-4">
        <p className="text-lg text-gray-700 flex items-center gap-2">
          <MdDateRange />
          계정 생성일: <span className="text-gray-900">{user.accountExpiryDate || "없음"}</span>
        </p>
        <p className="text-lg text-gray-700 flex items-center gap-2">
            <FaUserShield />
          권한: {user.role ? getRoleDisplayName(user.role.roleName) : "없음"}
        </p>
      </div>

      {/* 계정 상태 */}
      <div className="text-lg text-center mb-4">
        <span className={`px-4 py-2 rounded-md font-semibold ${user.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {user.enabled ? "✅ 활성화됨" : "❌ 비활성화됨"}
        </span>
      </div>

      {/* 주소 정보 */}
      {user.addresses?.length > 0 ? (
        <div className="border-t pt-4">
          <p className="text-lg text-gray-700 flex items-center gap-2">
            <FaMapMarkerAlt />
            우편번호: <span className="text-gray-900">{user.addresses[0].postcode || "없음"}</span>
          </p>
          <p className="text-lg text-gray-700">
            도로명 주소: <span className="text-gray-900">{user.addresses[0].address || "없음"}</span>
          </p>
          <p className="text-lg text-gray-700">
            상세 주소: <span className="text-gray-900">{user.addresses[0].detailAddress || "없음"}</span>
          </p>
          <p className="text-lg text-gray-700">
            추가 도로명 주소: <span className="text-gray-900">{user.addresses[0].extraAddress || "없음"}</span>
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 text-center mt-4">🏠 주소 정보 없음</p>
      )}

      {/* 관리 버튼 추가 (회원 수정, 삭제 등) */}
      <div className="flex justify-end mt-6">
        <Button variant="outlined" color="secondary" onClick={handleDeleteUser}>삭제</Button>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600 text-lg">사용자 정보를 찾을 수 없습니다.</p>
  );
};

export default MemberManagementDetails;
