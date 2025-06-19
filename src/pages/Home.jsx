import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* banner */}
      <div 
        className="bg-cover bg-no-repeat bg-center py-28 md:py-40 relative" 
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')"
        }}
      >
        <div className="container relative z-20">
          {/* banner content */}
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 leading-tight">
              Elevate Your <br className="hidden sm:block" /><span className="text-yellow-400">Style</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 font-light">
              Discover our curated collection of premium fashion that defines elegance and sophistication.
            </p>
            {/* banner button */}
            <div className="flex gap-4">
              <Link
                to="/products/shop" 
                className="bg-white text-primary px-8 py-4 font-semibold rounded-lg uppercase hover:bg-primary hover:text-white transition duration-300 transform hover:scale-105"
              >
                Explore Collection
              </Link>
              <Link
                to="/products/shop?sortBy=createdAt&sortOrder=desc" 
                className="border-2 border-white text-white px-8 py-4 font-semibold rounded-lg uppercase hover:bg-white hover:text-primary transition duration-300"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* banner end */}

      {/* categories */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trending Categories</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/one-trendy.webp" 
              alt="Suits" 
              className="w-full h-[400px] object-top object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Ethnic Suits</h3>
                <Link 
                  to="/products/shop?query=suit" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/two-trendy.jpg" 
              alt="Sarees" 
              className="w-full h-[400px] object-top object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Regular Sarees</h3>
                <Link 
                  to="/products/shop?query=saree" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/three-trendy.jpg" 
              alt="Formal" 
              className="w-full h-[400px] object-top object-cover transform scale-110 group-hover:scale-125 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Short Kurti</h3>
                <Link 
                  to="/products/shop?query=Formal" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/four-trendy.webp" 
              alt="Wedding" 
              className="w-full h-[400px] object-top object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Lehanga</h3>
                <Link 
                  to="/products/shop?query=Wedding" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  Discover More
                </Link>
              </div>
            </div>
          </div>
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/five-trendy.jpg"
              alt="Cotton" 
              className="w-full h-[400px] object-top object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Leggings</h3>
                <Link 
                  to="/products/shop?query=Cotton" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  Browse Collection
                </Link>
              </div>
            </div>
          </div>
          {/* single category */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/images/products/six-trendy.jpg" 
              alt="Casual" 
              className="w-full h-[400px] object-top object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">PartyWear Suit</h3>
                <Link 
                  to="/products/shop?query=Casual" 
                  className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white hover:text-primary transition"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* categories end */}

      {/* flash sale section */}
      <div className="container pb-16">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            {/* sale content */}
            <div className="w-full md:w-1/2 p-12 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Summer Sale</h2>
              <p className="text-xl mb-8 text-white/90">Up to 70% off on selected items</p>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold block">24</span>
                  <span className="text-sm">Days</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold block">12</span>
                  <span className="text-sm">Hours</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold block">35</span>
                  <span className="text-sm">Minutes</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold block">59</span>
                  <span className="text-sm">Seconds</span>
                </div>
              </div>
              <Link 
                to="/products/shop" 
                className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition duration-300 transform hover:scale-105"
              >
                Shop the Sale
              </Link>
            </div>
            {/* sale image */}
            <div className="w-full md:w-1/2">
              <img 
                src="/images/products/bottom-landing.avif" 
                alt="Sale Banner" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* flash sale section end */}

      {/* features */}
      <div className="container py-10">
        <div className="lg:w-10/12 grid md:grid-cols-3 gap-6 lg:gap-8 mx-auto">
          {/* single feature */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <img src="/images/icons/delivery-van.svg" className="w-8 h-8" alt="Free Shipping" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800">Free Shipping</h4>
                <p className="text-gray-600">On orders over ₹999</p>
              </div>
            </div>
          </div>
          {/* single feature */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <img src="/images/icons/money-back.svg" className="w-8 h-8" alt="Money Back" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800">Money Back</h4>
                <p className="text-gray-600">30 Days Guarantee</p>
              </div>
            </div>
          </div>
          {/* single feature */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <img src="/images/icons/service-hours.svg" className="w-8 h-8" alt="24/7 Support" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800">24/7 Support</h4>
                <p className="text-gray-600">Expert Assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* features end */}
    </>
  );
}

export default Home; 