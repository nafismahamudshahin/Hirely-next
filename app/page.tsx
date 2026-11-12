import CallToAction from "@/components/home/CallToAction";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import HeroBanner from "@/components/home/HeroBanner";
import JobCards from "@/components/home/JobCards";
import JobMarketStats from "@/components/home/JobMarketStats";
import PricingCards from "@/components/home/PricingCards";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";


export default function HomePage() {
  return (
    <main className="bg-black">
      <Navbar></Navbar>
      <HeroBanner />
      <JobMarketStats></JobMarketStats>
      <JobCards />
      <FeaturesGrid />
      <PricingCards />
      <CallToAction />
      <Footer></Footer>
    </main>
  );
}