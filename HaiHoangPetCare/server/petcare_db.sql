-- ============================================
-- Database: petcare_db
-- Created: 2025-11-12
-- Description: Database for HaiHoangPetCare project
-- ============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS `petcare_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `petcare_db`;

-- ============================================
-- Bảng USER - Quản lý người dùng
-- ============================================
CREATE TABLE IF NOT EXISTS `user` (
  `User_ID` INT(11) NOT NULL AUTO_INCREMENT,
  `Fullname` VARCHAR(100) NOT NULL,
  `Email` VARCHAR(100) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Birthday` DATE DEFAULT NULL,
  `UserPicture` TEXT DEFAULT NULL,
  `Role` VARCHAR(10) DEFAULT 'KH' COMMENT 'KH = Khách hàng, AD = Admin',
  `Address` TEXT DEFAULT NULL,
  `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`User_ID`),
  KEY `idx_email` (`Email`),
  KEY `idx_role` (`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bảng PRODUCT - Quản lý sản phẩm
-- ============================================
CREATE TABLE IF NOT EXISTS `product` (
  `Product_ID` INT(11) NOT NULL AUTO_INCREMENT,
  `ProductName` VARCHAR(255) NOT NULL,
  `Description` TEXT DEFAULT NULL,
  `Price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `Supplier` VARCHAR(255) DEFAULT NULL,
  `ProductPicture` TEXT DEFAULT NULL,
  `Category` VARCHAR(100) DEFAULT NULL COMMENT 'Danh mục sản phẩm: Thức ăn, Đồ chơi, Phụ kiện, etc.',
  `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Product_ID`),
  KEY `idx_category` (`Category`),
  KEY `idx_price` (`Price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bảng PET - Quản lý thú cưng
-- ============================================
CREATE TABLE IF NOT EXISTS `pet` (
  `Pet_ID` INT(11) NOT NULL AUTO_INCREMENT,
  `PetName` VARCHAR(30) NOT NULL,
  `Species` VARCHAR(50) NOT NULL COMMENT 'Loài: Chó, Mèo, Chim, etc.',
  `Breed` VARCHAR(50) DEFAULT NULL COMMENT 'Giống: Golden, Persian, etc.',
  `Gender` VARCHAR(10) DEFAULT 'Đực' COMMENT 'Đực hoặc Cái',
  `Birthday` DATE DEFAULT NULL,
  `PetPicture` TEXT DEFAULT NULL,
  `User_ID` INT(11) NOT NULL,
  `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Pet_ID`),
  KEY `idx_user_id` (`User_ID`),
  KEY `idx_species` (`Species`),
  CONSTRAINT `fk_pet_user` 
    FOREIGN KEY (`User_ID`) 
    REFERENCES `user` (`User_ID`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bảng WISHLIST - Giỏ hàng/Danh sách yêu thích
-- ============================================
CREATE TABLE IF NOT EXISTS `wishlist` (
  `Wishlist_ID` INT(11) NOT NULL AUTO_INCREMENT,
  `User_ID` INT(11) NOT NULL,
  `Product_ID` INT(11) NOT NULL,
  `Quantity` INT(11) DEFAULT 1,
  `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Wishlist_ID`),
  KEY `idx_user_id` (`User_ID`),
  KEY `idx_product_id` (`Product_ID`),
  UNIQUE KEY `unique_user_product` (`User_ID`, `Product_ID`),
  CONSTRAINT `fk_wishlist_user` 
    FOREIGN KEY (`User_ID`) 
    REFERENCES `user` (`User_ID`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_product` 
    FOREIGN KEY (`Product_ID`) 
    REFERENCES `product` (`Product_ID`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Dữ liệu mẫu cho bảng USER
-- ============================================
-- Mật khẩu mẫu: Admin@123 (đã hash)
INSERT INTO `user` (`Fullname`, `Email`, `Password`, `Phone`, `Birthday`, `Role`, `Address`) VALUES
('Admin System', 'admin@petcare.com', '$2y$10$YGY2OWE3YzNkZTRmNzBhN.rKqXxVzQ5pKZ6YjE8nP9Q3hR7kL2mCO', '0901234567', '1990-01-01', 'AD', 'Hà Nội, Việt Nam'),
('Nguyễn Văn A', 'nguyenvana@gmail.com', '$2y$10$YGY2OWE3YzNkZTRmNzBhN.rKqXxVzQ5pKZ6YjE8nP9Q3hR7kL2mCO', '0912345678', '1995-05-15', 'KH', 'TP. Hồ Chí Minh'),
('Trần Thị B', 'tranthib@gmail.com', '$2y$10$YGY2OWE3YzNkZTRmNzBhN.rKqXxVzQ5pKZ6YjE8nP9Q3hR7kL2mCO', '0923456789', '1998-08-20', 'KH', 'Đà Nẵng');

-- ============================================
-- Dữ liệu mẫu cho bảng PRODUCT
-- ============================================
INSERT INTO `product` (`ProductName`, `Description`, `Price`, `Supplier`, `Category`) VALUES
('Thức ăn cho chó Royal Canin 1kg', 'Thức ăn cao cấp cho chó trưởng thành', 350000.00, 'Royal Canin', 'Thức ăn'),
('Vòng cổ cho chó da thật', 'Vòng cổ bằng da thật cao cấp', 150000.00, 'PetShop VN', 'Phụ kiện'),
('Bóng cao su cho chó', 'Đồ chơi bóng cao su an toàn', 50000.00, 'PetToy', 'Đồ chơi'),
('Thức ăn cho mèo Me-O 1kg', 'Thức ăn hạt cho mèo trưởng thành', 120000.00, 'Me-O', 'Thức ăn'),
('Cát vệ sinh cho mèo 5kg', 'Cát vệ sinh dạng hạt không bụi', 85000.00, 'Cat Litter VN', 'Vệ sinh'),
('Lồng vận chuyển thú cưng', 'Lồng nhựa vận chuyển an toàn', 450000.00, 'Pet Carrier', 'Phụ kiện'),
('Xương gặm sạch răng cho chó', 'Xương gặm giúp làm sạch răng', 75000.00, 'Dental Pet', 'Đồ chơi'),
('Sữa tắm cho chó mèo 500ml', 'Sữa tắm chuyên dụng thơm lâu', 95000.00, 'Pet Shampoo', 'Vệ sinh');

-- ============================================
-- Dữ liệu mẫu cho bảng PET
-- ============================================
INSERT INTO `pet` (`PetName`, `Species`, `Breed`, `Gender`, `Birthday`, `User_ID`) VALUES
('Lucky', 'Chó', 'Golden Retriever', 'Đực', '2020-03-15', 2),
('Mimi', 'Mèo', 'Persian', 'Cái', '2021-06-20', 2),
('Buddy', 'Chó', 'Poodle', 'Đực', '2019-11-10', 3),
('Luna', 'Mèo', 'British Shorthair', 'Cái', '2022-01-05', 3);

-- ============================================
-- Dữ liệu mẫu cho bảng WISHLIST
-- ============================================
INSERT INTO `wishlist` (`User_ID`, `Product_ID`, `Quantity`) VALUES
(2, 1, 2),
(2, 3, 1),
(3, 4, 1),
(3, 5, 3);

-- ============================================
-- VIEWS - Tạo view để dễ dàng truy vấn
-- ============================================

-- View: Wishlist với thông tin chi tiết
CREATE OR REPLACE VIEW `view_wishlist_detail` AS
SELECT 
  w.Wishlist_ID,
  w.User_ID,
  u.Fullname AS UserName,
  u.Email AS UserEmail,
  w.Product_ID,
  p.ProductName,
  p.Price,
  p.ProductPicture,
  p.Category,
  w.Quantity,
  (p.Price * w.Quantity) AS TotalPrice,
  w.CreatedAt
FROM wishlist w
INNER JOIN user u ON w.User_ID = u.User_ID
INNER JOIN product p ON w.Product_ID = p.Product_ID;

-- View: Thú cưng với thông tin chủ nhân
CREATE OR REPLACE VIEW `view_pet_detail` AS
SELECT 
  pet.Pet_ID,
  pet.PetName,
  pet.Species,
  pet.Breed,
  pet.Gender,
  pet.Birthday,
  pet.PetPicture,
  pet.User_ID,
  u.Fullname AS OwnerName,
  u.Email AS OwnerEmail,
  u.Phone AS OwnerPhone,
  pet.CreatedAt
FROM pet
INNER JOIN user u ON pet.User_ID = u.User_ID;

-- ============================================
-- INDEXES - Tối ưu hóa performance
-- ============================================

-- Indexes đã được tạo trong CREATE TABLE statements

-- ============================================
-- NOTES
-- ============================================
-- 1. Mật khẩu mẫu cho tất cả user: Admin@123
-- 2. Role: 'AD' = Admin, 'KH' = Khách hàng
-- 3. Tất cả bảng sử dụng utf8mb4 để hỗ trợ tiếng Việt
-- 4. Foreign keys được thiết lập với ON DELETE CASCADE
-- 5. Timestamps tự động cập nhật
-- 6. Pictures được lưu dưới dạng TEXT (có thể là base64 hoặc URL)

-- ============================================
-- END OF SQL SCRIPT
-- ============================================
