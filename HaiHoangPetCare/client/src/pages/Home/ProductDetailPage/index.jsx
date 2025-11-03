import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../../API/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      // Gọi API với query param
      const res = await api.get("/products", {
        params: { Product_ID: id },
      });

      console.log("Kết quả API:", res.data);

      // Trường hợp backend trả về mảng (thường gặp)
      const productData = Array.isArray(res.data) ? res.data[0] : res.data;
      setProduct(productData);
    } catch (error) {
      console.error("Không thể tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);


  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const handleBuy = () => {
    const isLoggedIn = localStorage.getItem("user");
    if (!isLoggedIn) {
      navigate("/dang-nhap");
    } else {
      navigate("/san-pham"); 
    }
  };

  return (
    <Wrapper>
      <Card>
        <ImageBox>
          <img src={product.ProductPicture} alt={product.ProductName} />
        </ImageBox>
        <Info>
          <h2>{product.ProductName}</h2>
          <p className="desc">{product.Description}</p>
          <p className="price">
            <span>Giá:</span> {Number(product.Price).toLocaleString("vi-VN")}đ
          </p>
          <p className="supplier">
            <span>Nhà sản xuất:</span> {product.Supplier}
          </p>

          <div className="buttons">
            <button className="buy" onClick={handleBuy}>
              Mua ngay
            </button>
            <button className="back" onClick={() => navigate("/san-pham")}>
              Quay lại
            </button>
          </div>
        </Info>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Card = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ImageBox = styled.div`
  flex: 1;
  min-width: 300px;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    object-fit: contain;
    max-height: 400px;
  }
`;

const Info = styled.div`
  flex: 1;
  padding: 30px;
  text-align: left;

  h2 {
    font-size: 1.6rem;
    color: #2563eb;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 1rem;
    color: #374151;
    margin-bottom: 20px;
  }

  .price,
  .supplier {
    font-size: 1rem;
    margin-bottom: 10px;

    span {
      font-weight: 600;
      color: #111827;
    }
  }

  .price {
    color: #dd6b20;
    font-weight: 700;
  }

  .buttons {
    margin-top: 25px;
    display: flex;
    gap: 10px;
  }

  button {
    flex: 1;
    border: none;
    border-radius: 8px;
    padding: 10px 0;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .buy {
    background: #2563eb;
    color: white;
  }

  .back {
    background: #dd6b20;
    color: white;
  }

  button:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }
`;
