import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("user");

  const handleBuy = () => {
    if (!isLoggedIn) {
      navigate("/dang-nhap");
    } else {
      navigate("/san-pham");
    }
  };

  const handleDetail = () => {
    navigate(`/san-pham/${product.id || product.Product_ID}`);
  };

  return (
    <StyledCard>
      <div className="card-inner">
        {/* Mặt trước */}
        <div className="card-front">
          <img
            src={product.ProductPicture}
            alt={product.ProductName}
            className="product-image"
          />
        </div>

        {/* Mặt sau */}
        <div className="card-back">
          <h3 className="name">{product.ProductName}</h3>
          <p className="desc">{product.Description}</p>
          <p className="price">
            {Number(product.Price).toLocaleString("vi-VN")}đ
          </p>
          <p className="supplier">{product.Supplier}</p>

          <div className="button-group">
            <button className="buy" onClick={handleBuy}>
              Mua ngay
            </button>
            <button className="detail" onClick={handleDetail}>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </StyledCard>
  );
};

export default ProductCard;

const StyledCard = styled.div`
  width: 240px;
  height: 330px;
  perspective: 1000px;
  font-family: "Poppins", sans-serif;
  margin: 16px;
  border-radius: 16px;

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s ease;
    transform-style: preserve-3d;
  }

  &:hover .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    backface-visibility: hidden;
  }

  /* ---------- Mặt trước ---------- */
  .card-front {
    background: #fff;
    border: 2px solid #2563eb;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ---------- Mặt sau ---------- */
  .card-back {
    background: #ffffff;
    border: 2px solid #2563eb;
    padding: 16px;
    transform: rotateY(180deg);
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #1f2937;
  }

  .card-back .name {
    font-size: 1rem;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 6px;
  }

  .card-back .desc {
    font-size: 0.9rem;
    color: #374151;
    opacity: 0.95;
    margin-bottom: 8px;
  }

  .card-back .price {
    font-weight: 600;
    font-size: 0.95rem;
    color: #dd6b20;
    margin-bottom: 4px;
  }

  .card-back .price::before {
    content: "Giá: ";
    font-weight: 500;
    color: #374151;
  }

  .card-back .supplier {
    font-size: 0.85rem;
    color: #4b5563;
    margin-bottom: 10px;
  }

  .card-back .supplier::before {
    content: "Nhà sản xuất: ";
    font-weight: 500;
    color: #374151;
  }

  /* ---------- Nút ---------- */
  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 4px;
  }

  .button-group button {
    flex: 1;
    border: none;
    padding: 8px 0;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button-group .buy {
    background-color: #2563eb;
    color: white;
  }

  .button-group .detail {
    background-color: #dd6b20;
    color: white;
  }

  .button-group button:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }

  /* ---------- Hiệu ứng hover tổng thể ---------- */
  &:hover {
    transform: scale(1.03);
    transition: transform 0.3s ease;
  }
`;