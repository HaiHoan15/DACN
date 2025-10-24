import { Outlet } from "react-router-dom";
import Header from "./_Components/Header";
export default function Home() {
  return (
    <div
      // className="min-h-screen bg-cover bg-center"
      // style={{ backgroundImage: "url('/images/background2.jpg')" }} 
    >
      <Header />
      <Outlet />
    </div>
  );
}