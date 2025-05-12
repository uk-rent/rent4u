
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">How It Works</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Our simple process makes finding your perfect London home quick and easy
            </p>
          </div>
        </div>
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
