import React, { useState, useEffect } from "react";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";
import Notification from "../../_Components/Notification";
import TabSwitch from "../../_Components/TabSwitch/TabSwitch";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [mainTab, setMainTab] = useState("company");
  const [companySubTab, setCompanySubTab] = useState("doctors");
  const [listSubTab, setListSubTab] = useState("users");
  const [revenueSubTab, setRevenueSubTab] = useState("orders");
  const [searchUser, setSearchUser] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await api.get("get_statistics.php");
      if (res.data.error) {
        setNotification({ type: "error", message: res.data.error });
      } else {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
      setNotification({ type: "error", message: "Không thể tải dữ liệu thống kê" });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const mainTabs = [
    { id: "company", label: "Công ty" },
    { id: "list", label: "Danh sách" },
    { id: "revenue", label: "Thu nhập" },
  ];

  const companyTabs = [
    { id: "doctors", label: "Bác sĩ" },
    { id: "branches", label: "Chi nhánh" },
    { id: "rooms", label: "Phòng khám" },
  ];

  const listTabs = [
    { id: "users", label: "Khách hàng" },
    { id: "pets", label: "Thú cưng" },
    { id: "products", label: "Sản phẩm" },
    { id: "news", label: "Tin tức" },
  ];

  const revenueTabs = [
    { id: "orders", label: "Đơn hàng đã giao" },
    { id: "soldProducts", label: "Sản phẩm đã bán" },
  ];

  // Filter orders by user name
  const filteredOrders = stats?.deliveredOrderList?.filter(order => 
    order.UserName.toLowerCase().includes(searchUser.toLowerCase())
  ) || [];

  // Get unique categories from sold products
  const categories = stats?.soldProductList ? 
    ["all", ...new Set(stats.soldProductList.map(p => p.Category).filter(Boolean))] : ["all"];

  // Filter products by category
  const filteredProducts = stats?.soldProductList?.filter(product => 
    selectedCategory === "all" || product.Category === selectedCategory
  ) || [];

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl mt-6">
      {/* Header với nút làm mới */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">Thống kê tổng quan</h2>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-rotate-right"></i>
          Làm mới
        </button>
      </div>

      <Notification type={notification.type} message={notification.message} />

      {stats && (
        <>
          {/* Main Tabs */}
          <div className="mb-6">
            <TabSwitch tabs={mainTabs} activeTab={mainTab} onTabChange={setMainTab} />
          </div>

          {/* Company Tab Content */}
          {mainTab === "company" && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🥼</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Bác sĩ</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalDoctors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🏢</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Chi nhánh</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalBranches}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🚪</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Phòng khám</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalRooms}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="mb-4">
                <TabSwitch
                  tabs={companyTabs}
                  activeTab={companySubTab}
                  onTabChange={setCompanySubTab}
                />
              </div>

              {/* Company Lists */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 max-h-96 overflow-y-auto border-2 border-gray-200 shadow-inner">
                {companySubTab === "doctors" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-user-doctor text-green-600"></i>
                      Danh sách bác sĩ
                    </h3>
                    {stats.doctorList && stats.doctorList.length > 0 ? (
                      stats.doctorList.map((doctor, idx) => (
                        <div
                          key={doctor.Doctor_ID}
                          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg hover:scale-[1.02] transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                                #{idx + 1}
                              </span>
                              <span className="text-gray-800 font-semibold group-hover:text-green-600 transition-colors">
                                {doctor.DoctorName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {doctor.Doctor_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có bác sĩ nào</p>
                    )}
                  </div>
                )}

                {companySubTab === "branches" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-building text-purple-600"></i>
                      Danh sách chi nhánh
                    </h3>
                    {stats.branchList && stats.branchList.length > 0 ? (
                      stats.branchList.map((branch, idx) => (
                        <div
                          key={branch.Branch_ID}
                          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg hover:scale-[1.02] transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                                #{idx + 1}
                              </span>
                              <span className="text-gray-800 font-semibold group-hover:text-purple-600 transition-colors">
                                {branch.BranchName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {branch.Branch_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có chi nhánh nào</p>
                    )}
                  </div>
                )}

                {companySubTab === "rooms" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-door-open text-pink-600"></i>
                      Danh sách phòng khám
                    </h3>
                    {stats.roomList && stats.roomList.length > 0 ? (
                      stats.roomList.map((room, idx) => (
                        <div
                          key={room.Room_ID}
                          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-pink-500 hover:shadow-lg hover:scale-[1.02] transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="bg-pink-100 text-pink-700 font-bold px-3 py-1 rounded-full text-sm">
                                #{idx + 1}
                              </span>
                              <span className="text-gray-800 font-semibold group-hover:text-pink-600 transition-colors">
                                {room.RoomName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {room.Room_ID}</span>
                          </div>
                          {room.BranchName && (
                            <p className="text-sm text-gray-600 ml-16">
                              <i className="fas fa-building text-purple-500 mr-2"></i>
                              Chi nhánh: <span className="font-medium">{room.BranchName}</span>
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có phòng khám nào</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* List Tab Content */}
          {mainTab === "list" && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">👥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Khách hàng</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🐾</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Thú cưng</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalPets}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Sản phẩm</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">📰</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Tin tức</p>
                      <p className="text-4xl font-bold mt-1">{stats.totalNews}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="mb-4">
                <TabSwitch tabs={listTabs} activeTab={listSubTab} onTabChange={setListSubTab} />
              </div>

              {/* Lists */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 max-h-96 overflow-y-auto">
                {listSubTab === "users" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fas fa-users text-blue-500 text-xl"></i>
                      <h3 className="font-semibold text-gray-800 text-lg">Danh sách khách hàng</h3>
                    </div>
                    {stats.userList && stats.userList.length > 0 ? (
                      stats.userList.map((user, index) => (
                        <div
                          key={user.User_ID}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <span className="text-gray-700 font-medium">
                                {user.Fullname}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {user.User_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có khách hàng nào</p>
                    )}
                  </div>
                )}

                {listSubTab === "pets" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fas fa-paw text-teal-500 text-xl"></i>
                      <h3 className="font-semibold text-gray-800 text-lg">Danh sách thú cưng</h3>
                    </div>
                    {stats.petList && stats.petList.length > 0 ? (
                      stats.petList.map((pet, index) => (
                        <div
                          key={pet.Pet_ID}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500 hover:shadow-md transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <span className="text-gray-700 font-medium">
                                {pet.PetName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {pet.Pet_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có thú cưng nào</p>
                    )}
                  </div>
                )}

                {listSubTab === "products" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fas fa-box text-orange-500 text-xl"></i>
                      <h3 className="font-semibold text-gray-800 text-lg">Danh sách sản phẩm</h3>
                    </div>
                    {stats.productList && stats.productList.length > 0 ? (
                      stats.productList.map((product, index) => (
                        <div
                          key={product.Product_ID}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <span className="text-gray-700 font-medium">
                                {product.ProductName}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {product.Product_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có sản phẩm nào</p>
                    )}
                  </div>
                )}

                {listSubTab === "news" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fas fa-newspaper text-red-500 text-xl"></i>
                      <h3 className="font-semibold text-gray-800 text-lg">Danh sách tin tức</h3>
                    </div>
                    {stats.newsList && stats.newsList.length > 0 ? (
                      stats.newsList.map((news, index) => (
                        <div
                          key={news.News_ID}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500 hover:shadow-md transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <span className="text-gray-700 font-medium">
                                {news.Title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {news.News_ID}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">Chưa có tin tức nào</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Revenue Tab Content */}
          {mainTab === "revenue" && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">✅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Đơn hàng đã giao</p>
                      <p className="text-4xl font-bold mt-1">{stats.deliveredOrders}</p>
                      <p className="text-xs opacity-90 mt-1">
                        Tổng: {stats.totalOrders} đơn
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-4xl">💲</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">Tổng thu nhập</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-xs opacity-90 mt-1">
                        Từ {stats.deliveredOrders} đơn đã giao
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="mb-4">
                <TabSwitch
                  tabs={revenueTabs}
                  activeTab={revenueSubTab}
                  onTabChange={setRevenueSubTab}
                />
              </div>

              {/* Revenue Lists */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 max-h-96 overflow-y-auto">
                {revenueSubTab === "orders" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-box-open text-emerald-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Danh sách đơn hàng đã giao
                        </h3>
                      </div>
                      <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          placeholder="Tìm theo tên khách hàng..."
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
                        />
                      </div>
                    </div>
                    {filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <div
                          key={order.Order_ID}
                          className="bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-all"
                        >
                          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleOrderDetails(order.Order_ID)}>
                            <div className="flex items-center gap-3 flex-1">
                              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <div className="flex-1">
                                <span className="text-gray-700 font-medium">
                                  ĐH #{order.Order_ID} - {order.UserName}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(order.CreatedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-green-600 font-bold text-lg">
                                {formatCurrency(order.TotalAmount)}
                              </span>
                              <i className={`fas fa-chevron-down text-gray-400 transition-transform ${expandedOrders[order.Order_ID] ? 'rotate-180' : ''}`}></i>
                            </div>
                          </div>
                          {expandedOrders[order.Order_ID] && order.items && (
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-2">Chi tiết đơn hàng:</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">{idx + 1}</span>
                                      <span className="text-gray-700 text-sm">{item.ProductName}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-gray-500">SL: <span className="font-semibold text-blue-600">{item.Quantity}</span></span>
                                      <span className="text-sm font-medium text-gray-700">{formatCurrency(item.Price)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">
                        {searchUser ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng đã giao"}
                      </p>
                    )}
                  </div>
                )}

                {revenueSubTab === "soldProducts" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-shopping-cart text-green-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Sản phẩm đã bán
                        </h3>
                      </div>
                      <div className="relative">
                        <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer w-48"
                        >
                          <option value="all">Tất cả thể loại</option>
                          {categories.filter(c => c !== "all").map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                      </div>
                    </div>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <div
                          key={product.Product_ID || product.ProductName}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">#{index + 1}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700 font-medium">
                                    {product.ProductName}
                                  </span>
                                  {product.Category && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                      {product.Category}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Số lượng: <span className="font-semibold text-blue-600">{product.TotalSold}</span> | 
                                  Thu nhập: <span className="font-semibold text-green-600">{formatCurrency(product.TotalRevenue)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8 bg-white rounded-lg">
                        {selectedCategory !== "all" ? "Không có sản phẩm nào trong thể loại này" : "Chưa có sản phẩm nào được bán"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

