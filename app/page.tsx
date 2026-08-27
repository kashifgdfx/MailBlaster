import DashboardPreview from "@/components/landing/DashboardPreview";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import { redirect } from "next/navigation";

export default function Home() {
  return(
   <>
     <Navbar/>
     <Hero/>
     <Features/>
     <DashboardPreview/>
     <Pricing/>
     <FAQ/>
     <Footer/>
   </>
  )
}