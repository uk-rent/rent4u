
const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">How It Works</h2>
          <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
            Our simple 3-step process makes finding and renting your ideal London home 
            quick and stress-free
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <h3 className="text-4xl font-bold text-secondary mb-3">1</h3>
            <h4 className="text-xl font-semibold text-secondary mb-3">Search & Filter</h4>
            <p className="text-gray-600">
              Use our advanced search to find the perfect property by location, price, and features
            </p>
            
            {/* Connector (hidden on mobile) */}
            <div className="hidden md:block absolute top-16 left-full w-[calc(100%-2rem)] h-[2px] bg-gray-200 transform -translate-x-1/2">
              <div className="absolute right-0 top-1/2 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="text-4xl font-bold text-secondary mb-3">2</h3>
            <h4 className="text-xl font-semibold text-secondary mb-3">Contact & Schedule</h4>
            <p className="text-gray-600">
              Directly contact landlords or agents to schedule viewings at your convenience
            </p>
            
            {/* Connector (hidden on mobile) */}
            <div className="hidden md:block absolute top-16 left-full w-[calc(100%-2rem)] h-[2px] bg-gray-200 transform -translate-x-1/2">
              <div className="absolute right-0 top-1/2 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            
            <h3 className="text-4xl font-bold text-secondary mb-3">3</h3>
            <h4 className="text-xl font-semibold text-secondary mb-3">Move In</h4>
            <p className="text-gray-600">
              Complete the verification process, sign your contract, and move into your new home
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
