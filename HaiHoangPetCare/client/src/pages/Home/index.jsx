import { Outlet } from "react-router-dom";
import Header from "./_Components/Header";
export default function Home() {
  return (
    <div>   
      <Header />
      <Outlet />  
    </div>
  )
  
}