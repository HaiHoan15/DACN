import { Outlet } from "react-router-dom";
import Header from "./_Components/Header";
import Footer from "./_Components/Footer";
import AIChatbotButton from "../Home/AdvisePage/AIChatbotButton.jsx";
export default function Home() {
  return (
    <div
      // className="min-h-screen bg-cover bg-center"
      // style={{ backgroundImage: "url('/images/background2.jpg')" }} 
    >
      <Header />
      <Outlet />
      <AIChatbotButton />
      <Footer />
    </div>
  );
}