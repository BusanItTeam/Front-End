import axios from "axios";

console.log("API URL:", import.meta.env.VITE_APP_API_URL);

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ✅ 애플리케이션 시작 시 CSRF 토큰을 미리 가져오기
export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/csrf-token`,
      { withCredentials: true }
    );
    const csrfToken = response.data.token;
    localStorage.setItem("CSRF_TOKEN", csrfToken);
    console.log("Fetched CSRF Token:", csrfToken);
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// Axios 인터셉터로 JWT 토큰 및 CSRF 토큰을 헤더에 설정
Api.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 로컬스토리지에서 CSRF 토큰 가져오기
    const csrfToken = localStorage.getItem("CSRF_TOKEN");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken; // ✅ 필요하면 백엔드에서 요구하는 키 확인
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;
