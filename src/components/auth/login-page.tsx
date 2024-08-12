"use client";
import Navbar from "./navbar";
import HeroSection from "./hero-section";
import FeatureSection from "./feature-section";
import Workflow from "./workflow";
import Footer from "./footer";
import Testimonials from "./testimonials";

const LoginPage = () => {

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;