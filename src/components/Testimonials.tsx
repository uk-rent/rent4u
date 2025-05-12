
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Young Professional",
    rating: 5,
    text: "rentinlondon made finding my flat so easy! The search filters are incredibly helpful, and I was able to schedule viewings within hours. I found my perfect apartment in just one week."
  },
  {
    id: 2,
    name: "David Chen",
    role: "Student",
    rating: 5,
    text: "As an international student, I was worried about finding accommodation in London. This platform connected me with trustworthy landlords and I found a great room in a shared house near my university."
  },
  {
    id: 3,
    name: "Olivia and James",
    role: "Young Family",
    rating: 4,
    text: "We needed to find a family-friendly apartment quickly after relocating to London for work. The detailed listings and responsive landlords made our transition smooth and stress-free."
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">What Our Users Say</h2>
          <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
            Hear from people who have found their perfect London home through our platform
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-alternate rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                    {/* Placeholder for user avatar */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-secondary">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="bg-alternate rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  {/* Placeholder for user avatar */}
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    {testimonials[activeIndex].name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-secondary">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-gray-500">{testimonials[activeIndex].role}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[activeIndex].rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 italic">"{testimonials[activeIndex].text}"</p>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeIndex === index ? "bg-primary" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
