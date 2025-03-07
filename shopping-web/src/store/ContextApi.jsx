import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/Api";
import toast from "react-hot-toast";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  //로컬스토리지에 있는 토큰을 가져온다
  const getToken = localStorage.getItem("JWT_TOKEN")
    ? JSON.stringify(localStorage.getItem("JWT_TOKEN"))
    : null;
  //로컬스토리지 유저가 관리자 인지 가져옴
  const isADmin = localStorage.getItem("IS_ADMIN")
    ? JSON.parse(localStorage.getItem("IS_ADMIN")) // JSON.parse 추가
    : false;

  //토큰 상태관리
  const [token, setToken] = useState(getToken);
  //장바구니
  const [cartItems, setCartItems] = useState([]);
  //현재 로그인 유저 관리
  const [currentUser, setCurrentUser] = useState(null);
  //관리자 패널 관리
  const [openSidebar, setOpenSidebar] = useState(true);
  //관리자 인지 확인
  const [isAdmin, setIsAdmin] = useState(isADmin);

  // 상품 목록 상태 추가
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
 const backendURL = "http://localhost:8080";
  const [error, setError] = useState(null);
 
  // 상태 관리 추가
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 사용자 목록 상태

  // 상품 목록을 가져오는 함수
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products"); // 백엔드 API 엔드포인트
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("상품 목록을 가져오는데 실패했습니다.");
    }
  };

  // useEffect(() => {
  //   const sampleItems = [
  //     {
  //       id: 1,
  //       name: "Product 1",
  //       price: 25000,
  //       image: "/woman-2799490_1280.jpg",
  //       quantity: 1,
  //     },
  //     {
  //       id: 2,
  //       name: "Product 2",
  //       price: 19000,
  //       image: "/khaki-2723896_1280.jpg",
  //       quantity: 1,
  //     },
  //     {
  //       id: 3,
  //       name: "Product 3",
  //       price: 15000,
  //       image: "/shirts-1184914_1280.jpg",
  //       quantity: 1,
  //     },
  //   ].map((item) => ({
  //     ...item,
  //     points: Math.floor(item.price * 0.1), // 10% of price as integer
  //   }));

  //   setCartItems(sampleItems);
  // }, []);

  //유저 정보 가져오기
  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("USER"));

    if (user?.username) {
      try {
        //서버에 유저정보를 요청
        const { data } = await api.get(`/auths/user`);
        const roles = data.roles;

        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", JSON.stringify(true));
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user", error);
        toast.error("Error fetching current user");
      }
    }
  };
  //처음 시작시 또는 토큰이 바뀔때마다 유저정보를 가져옴
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUsers = async () => {
    const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN"));
    if (isAdmin) {
      try {
        const response = await api.get("/admin/getusers")
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response data");
        }
        setUsers(response.data);
        setFilteredUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response) {
          console.error("Error response:", error.response); // 응답 오류 로그
          setError(error.response.data.message || "Failed to fetch users");
        } else {
          setError(error.message || "Failed to fetch users");
        }
        toast.error(error.message || "로그인 후 시도해주세요");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token && isADmin) {
      fetchUsers();
    }
  }, [token, isADmin]);

  // localstorage 에 user 데이터가 있으면 자동으로 currentuser를 설정
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 상품 목록을 가져옵니다.
    fetchProducts();
  }, []);

  //컨텍스트 프로바이더가 value의 모든 정보를 모든 컴포넌트에 제공함
  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
        cartItems,
        setCartItems,
        products,
        setProducts,
        fetchProducts, // fetchProducts 함수를 value에 추가
        fetchUsers,
        setLoading,
        filteredUsers,
        backendURL,
        setFilteredUsers,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

//useMyContext() 로 이 컨텍스트를 사용함
export const useMyContext = () => {
  const context = useContext(ContextApi);
  return context;
};
