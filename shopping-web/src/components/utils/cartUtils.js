import { toast } from "react-hot-toast";
import api from "../../services/Api";

/**
 * 장바구니에 상품 추가 (단일 상품 또는 여러 개 상품)
  @param {Array | Object} products - 상품 객체 또는 상품 배열
  @param {number} quantity - 추가할 수량
  @param {Function} navigate - 페이지 이동 함수PC에서 공동인증서를 선택하고 비밀번호 입력	스마트
  @param {Function} updateCart - 장바구니 업데이트 함수
 */
export const handleAddToCart = async (products, quantity, navigate, updateCart) => {
    const token = localStorage.getItem("JWT_TOKEN"); 
    if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
    }

    console.log( "현재 JWT 토큰:", token); // 토큰 값 확인

    // `products`가 배열인지 확인 (단일 추가 vs 전체 추가)
    const productList = Array.isArray(products) ? products : [products];

    for (const product of productList) {
        // 옵션(색상, 사이즈) 추출
        let color = "기본 색상";
        let size = "기본 사이즈";

        if (product.option) {
            const optionParts = product.option.split(", ");
            optionParts.forEach(part => {
                if (part.includes("Color:")) {
                    color = part.replace("Color: ", "").trim();
                }
                if (part.includes("Size:")) {
                    size = part.replace("Size: ", "").trim();
                }
            });
        }

       

        const requestData = {
            cartId: product.cartId,
            productId: product.productId,  
            productName: product.productName || "상품명 없음",  
            productImageUrl: product.images?.length > 0 ? product.images[0].imageUrl : "기본 이미지 URL",
            productPrice: product.price || 0,
            quantity: quantity,
            categoryName: product.category?.name || "기본 카테고리",
            optionId: product.optionId || 0,
        };

        console.log("장바구니 추가 요청 데이터:", requestData);
       

        try {
            const response = await api.post(`/cart/add`, requestData, {  
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
            });

            if (response.status === 200) {
                toast.success(`${product.productName} 장바구니에 추가됨!`);
            }
        } catch (error) {
            console.error(` ${product.productName} 장바구니 추가 실패:`, error);
            toast.error(`${product.name} 추가 실패`);
        }
    }

    // 장바구니 업데이트 후 이동
    if (updateCart) updateCart();
    setTimeout(() => navigate("/cart"), 1000);
};
