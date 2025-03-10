import { toast } from "react-hot-toast";
import api from "../../services/Api";


export const handleAddToCart = async (product, quantity, selectedOption, navigate, updateCart) => {
    const token = localStorage.getItem("JWT_TOKEN"); 

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
  }

  

    console.log("🔑 현재 JWT 토큰:", token); // 토큰 값 확인

    //  CartDTO
    const requestData = {
      cartId: product.cartId,
      productId: product.productId,  
      productName: product.name || "상품명 없음",  
      productImageUrl: product.images?.length > 0 ? product.images[0].imageUrl : "기본 이미지 URL",
      productPrice: product.price || 0,
      quantity: quantity,
      categoryName: product.category?.name || "기본 카테고리",
      color: selectedOption?.color || "기본 색상",
     size: selectedOption?.size,
  };
  

    console.log("🛒 장바구니 추가 요청 데이터:", requestData); 

    try {
        const response = await api.post(`/cart/add`, requestData, {  
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        if (response.status === 200) {
            toast.success("장바구니에 추가되었습니다!");
            setTimeout(() => navigate("/cart"), 1000); //1초 후 장바구니 페이지로 감
        }
    } catch (error) {
      console.error("🚨 장바구니 추가 실패:", error);
      toast.error("장바구니에 추가에 실패했습니다.");
        console.error("🚨 장바구니 추가 실패:", error);
        toast.error("장바구니 추가에 실패했습니다.");
    }
};
