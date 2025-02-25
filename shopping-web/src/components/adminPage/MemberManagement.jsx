import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid"; // 테이블 라이브러리
import toast from "react-hot-toast";
import moment from "moment";
import { Link, useNavigate,  } from "react-router-dom";
import { MdOutlineEmail, MdDateRange } from "react-icons/md";
import { Blocks } from "react-loader-spinner";
import { FaUser } from "react-icons/fa";
import Search from "../search/Search.jsx";
import { useMyContext } from "../../store/ContextApi.jsx";

// 컬럼 정의 (DataGrid용)
const userListsColumns = [
  {
    field: "id",
    headerName: "userId",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>유저 번호</span>,
  },
  {
    field: "username",
    headerName: "userName",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>유저 아이디</span>,
  },
  {
    field: "name",
    headerName: "userName",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>이름</span>,
  },
  {
    field: "phoneNumber",
    headerName: "phoneNumber",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>휴대폰번호</span>,
  },
  {
    field: "email",
    headerName: "Email",
    headerAlign: "center",
    width: 220,
    align: "center",
    renderHeader: () => <span>이메일</span>,
    renderCell: (params) => (
      <div className="flex items-center gap-1">
        <MdOutlineEmail className="text-lg flex-shrink-0" />
        <span>{params.row.email}</span>
      </div>
    ),
  },
  {
    field: "created",
    headerName: "Created At",
    width: 220,
    align: "center",
    headerAlign: "center",
    renderHeader: () => <span>생성 시간</span>,
    renderCell: (params) => (
      <div className="flex items-center gap-1">
        <MdDateRange className="text-lg" />
        <span>{params.row.created}</span>
      </div>
    ),
  },
  {
    field: "postcode",
    headerName: "postcode",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>우편 번호</span>,
  },
  {
    field: "address",
    headerName: "address",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>도로명 주소</span>,
  },
  {
    field: "detailAddress",
    headerName: "detailAddress",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>상세 주소</span>,
  },
  {
    field: "extraAddress",
    headerName: "extraAddress",
    headerAlign: "center",
    minWidth: 200,
    align: "center",
    renderHeader: () => <span>추가 도로명 주소</span>,
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    width: 200,
    align: "center",
    renderHeader: () => <span>상태</span>,
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    width: 200,
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => (
      <Link to={`/admin/users/${params.id}`}>
        <button className="bg-btnColor text-white px-4 rounded-md">View</button>
      </Link>
    ),
  },
];

// 회원 관리 페이지 컴포넌트
const MemberManagement = () => {
  
  const navigate = useNavigate();
  
  const handleRowClick = (params) => {
    console.log("이동할 URL:", `/admin/members/${params.row.id}`); 
    navigate(`/admin/members/${params.row.id}`);
  };

  // Context에서 필요한 데이터와 함수 가져오기
  const {
    users,
    filteredUsers,
    setFilteredUsers,
    loading,
    error,
    setError,
    fetchUsers,
  } = useMyContext(); 

  const [searchTerm, setSearchTerm] = useState(""); 

  // 페이지 로드 시 유저 데이터 가져오기
  useEffect(() => {
    fetchUsers(); // Context에서 제공하는 fetchUsers 호출
  }, [fetchUsers]);

  useEffect(() => {
    const filtered = (users || []).filter((user) =>
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const rows = filteredUsers.map((item) => ({
    id: item.userId,
    username: item.userName,
    name: item.name,
    email: item.email,
    phoneNumber: item.phoneNumber,
    postcode: item.addresses?.length > 0 ? item.addresses[0].postcode : "등록된 주소 없음",  
    address: item.addresses?.length > 0 ? item.addresses[0].address : "등록된 주소 없음",
    detailAddress: item.addresses?.length > 0 ? item.addresses[0].detailAddress : "등록된 주소 없음",
    extraAddress: item.addresses?.length > 0 ? item.addresses[0].extraAddress : "등록된 주소 없음",
    created: moment(item.createdDate).format("YYYY/MM/DD hh:mm:ss a"),
    status: item?.enabled ? "Active" : "Inactive",
  }));

  return (
    <div className="p-4">
      <div className="relative flex items-center justify-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaUser className="text-primary" />
          전체 사용자
        </h1>
        <div className="absolute right-0">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      <div className="overflow-x-auto w-full mx-auto mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <Blocks height="70" width="70" color="#4fa94d" visible />
            <span>Loading...</span>
          </div>
        ) : (
          <DataGrid
            className="w-fit mx-auto"
            rows={rows}
            columns={userListsColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,  // 기본 사이즈 페이지 10개씩
                },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50, 100]} 
            disableColumnResize
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default MemberManagement;
