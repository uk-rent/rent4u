
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="py-16 bg-alternate">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
            Find answers to commonly asked questions about renting in London
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                How do I schedule a viewing for a property?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Once you find a property you're interested in, simply click the "View Details" button to access the full listing. 
                From there, you can click "Schedule Viewing" or directly contact the landlord/agent through the provided contact information. 
                They will then coordinate with you to find a suitable time for the viewing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                Are utilities included in the rental price?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                This varies by property. Each listing will specify whether utilities (electricity, gas, water, internet) 
                are included in the monthly rent or need to be paid separately. This information can be found in the 
                detailed property description under the "Included Amenities" section.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                How long does the application process take?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                The application process typically takes between 3-7 business days, depending on the landlord's requirements. 
                This includes reference checks, credit checks, and verification of your employment and income. 
                For international applicants, the process may take slightly longer due to additional verification steps.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                Is a security deposit required?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Yes, most properties require a security deposit before moving in. Under current UK regulations, 
                the maximum security deposit is capped at 5 weeks' rent for annual rental values under £50,000, or 
                6 weeks' rent for annual rental values of £50,000 or above. The deposit must be protected in a 
                government-approved tenancy deposit scheme.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                Can I rent a property if I'm moving from overseas?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Yes, international tenants can rent properties through our platform. However, you may need to provide 
                additional documentation such as a visa, passport, and proof of funds. Some landlords may require a 
                UK-based guarantor or additional months of rent in advance. We recommend starting your search well 
                in advance of your move date.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border border-gray-100">
              <AccordionTrigger className="px-6 py-4 text-left">
                How do I list my property on rentinlondon?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                To list your property, click on "Publish Property" in the navigation bar. You'll need to create a 
                landlord account if you don't already have one. Then follow the step-by-step listing process, where 
                you'll provide property details, upload photos, set your rental price, and specify your tenant requirements. 
                Our team will review your listing before it goes live on the platform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
