import Carousel from "./Carousel";
import AboutUs from "./AboutUs";
import StatsSection from "./StatsSection";
import TeamSection from "./TeamSection";
import ContactSection from "./ContactSection";
export default function AboutPage() {
  return (
    <div>
      {/* Phần gioi thiệu về website */}
      <Carousel />
      {/* Phần giới thiệu về chúng tôi */}
      <AboutUs />
      {/* Phần số liệu thống kê */}
      <StatsSection />
      {/* Phần đội ngũ phát triển */}
      <TeamSection />
      {/* Phần liên hệ */}
      <ContactSection />
    </div>
  );
}