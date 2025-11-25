import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Home() {
  // -----------------------------
  // CAR CATEGORIES + VEHICLES
  // -----------------------------
  const categories = ["SUV", "Sedan", "MPV", "Pickup"]

  const carData = {
    SUV: [
      { name: "Nissan Terra", img: "https://img.philkotse.com/2021/12/22/xjKXoNhA/nissan-terra-2022-philippines-3a22.jpg", description: "A robust SUV with premium features and excellent off-road capabilities." },
      { name: "Jeep Wrangler", img: "https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2023/wrangler/gallery/exterior/2023-jeep-wrangler-gallery-exterior-1.jpg", description: "Iconic rugged design built for adventure and durability." },
      { name: "Hyundai Storia", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/50727/staria-exterior-right-front-three-quarter.jpeg", description: "Spacious and modern SUV with advanced tech features." },
      { name: "Suzuki Ignis", img: "https://www.suzuki.co.za/hubfs/Ignis%20-%20Glistening%20Grey%20Metallic.png", description: "Compact yet versatile, perfect for urban driving." }
    ],
    Sedan: [
      { name: "Suzuki Ciaz", img: "https://www.autodeal.com.ph/custom/car-model-photo/original/2022-suzuki-ciaz-front-quarter-philippines-60e7cc4701283.jpg", description: "Elegant sedan with excellent fuel efficiency and comfort." },
      { name: "Suzuki Dzire", img: "https://www.autodeal.com.ph/custom/car-model-photo/original/suzuki-dzire-637b2efcc7f9b.jpg", description: "Reliable and affordable sedan with modern styling." },
      { name: "Nissan Almera", img: "https://www-nissan-cdn.net/content/dam/Nissan/th/vehicles/VLP/almera-my23/new/spec/vl-spec.jpg", description: "Spacious interior and smooth ride for daily driving." },
      { name: "Suzuki Swift", img: "https://img.philkotse.com/2019/04/23/f8koe8lq/suzuki-swift-2019-ra-philippines-29bd.jpg", description: "Sporty compact sedan with peppy performance." }
    ],
    MPV: [
      { name: "Toyota Avanza (Sample)", img: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/145259/avanza-exterior-right-front-three-quarter.jpeg", description: "Practical MPV with seating for the whole family." },
      { name: "Suzuki Ertiga (Sample)", img: "https://images.suzuki.co.id/storage/index/ertiga/5.png", description: "Comfortable and spacious with advanced safety features." }
    ],
    Pickup: [
      { name: "Toyota Hilux", img: "https://www.toyota.com/imgix/responsive/images/gallery/photos-v2/2025/hilux/2025-toyota-hilux-001.jpg", description: "Powerful pickup with great payload and towing capacity." },
      { name: "Nissan Navara", img: "https://www.nissan.ph/content/dam/Nissan/asia/philippines/vehicles/navara/overview/2021/navara-hero.png", description: "Durable and efficient pickup designed for tough jobs." }
    ]
  }

  // -----------------------------
  // HERO BANNER SLIDESHOW
  // -----------------------------
  const carouselImages = [
    "https://global.toyota/pages/models/fortuner/grade/fortuner.png",
    "https://global.honda/content/dam/central/cars/city/og_image.jpg",
    "https://imgd.aeplcdn.com/0x0/n/cw/ec/142695/innova-hycross-exterior-right-front-three-quarter.jpeg"
  ]

  // States
  const [banner, setBanner] = useState(0)
  const [fadeBanner, setFadeBanner] = useState(false)
  const [activeCategory, setActiveCategory] = useState("SUV")
  const [modalCar, setModalCar] = useState(null)
  const [textFade, setTextFade] = useState(false)

//   const categories = ["SUV", "Sedan", "MPV", "Pickup"]

  // For managing auto slide interval & manual controls
  const intervalRef = useRef(null)

  // Function to start the slideshow interval
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      slideNext()
    }, 4000)
  }

  useEffect(() => {
    startInterval()
    return () => clearInterval(intervalRef.current)
  }, [banner, activeCategory])

  // Slide next function with fade effect
  const slideNext = () => {
    setFadeBanner(true)
    setTextFade(true)
    setTimeout(() => {
      setBanner((prev) => (prev + 1) % carouselImages.length)
      setActiveCategory((prev) => {
        const index = categories.indexOf(prev)
        return categories[(index + 1) % categories.length]
      })
      setFadeBanner(false)
      setTextFade(false)
    }, 600)
  }

  // Slide prev function with fade effect
  const slidePrev = () => {
    setFadeBanner(true)
    setTextFade(true)
    setTimeout(() => {
      setBanner((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
      setActiveCategory((prev) => {
        const index = categories.indexOf(prev)
        return categories[(index - 1 + categories.length) % categories.length]
      })
      setFadeBanner(false)
      setTextFade(false)
    }, 600)
  }

  // Manually select bullet slide
  const selectSlide = (index) => {
    if(index === banner) return
    setFadeBanner(true)
    setTextFade(true)
    setTimeout(() => {
      setBanner(index)
      setActiveCategory(categories[index % categories.length])
      setFadeBanner(false)
      setTextFade(false)
    }, 600)
  }

  return (
    <>
      <DashboardLayout>
        <div className="space-y-10 relative">

          {/* HERO CAROUSEL */}
          <section className="relative w-full h-72 rounded-xl overflow-hidden shadow-lg select-none">
            <img
              src={carouselImages[banner]}
              alt="Car Banner"
              className={`w-full h-full object-contain transition-opacity duration-700 ${
                fadeBanner ? "opacity-0" : "opacity-100"
              }`}
              onError={(e) => (e.target.src = "https://via.placeholder.com/1200x400?text=Car+Banner")}
              draggable={false}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div
              className={`absolute bottom-5 left-6 max-w-xl ${
                textFade ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"
              } transition-all duration-700 ease-in-out`}
            >
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                Find Your Dream Car
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Fast Approval • Easy Financing • Trusted by Clients
              </p>
            </div>

            {/* Left/Right Controls */}
            <button
              aria-label="Previous Slide"
              onClick={() => {
                slidePrev()
                startInterval()
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              &#10094;
            </button>
            <button
              aria-label="Next Slide"
              onClick={() => {
                slideNext()
                startInterval()
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              &#10095;
            </button>

            {/* Bullet Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === banner ? "bg-blue-400" : "bg-white/40 hover:bg-white"
                  }`}
                  onClick={() => {
                    selectSlide(i)
                    startInterval()
                  }}
                />
              ))}
            </div>
          </section>

          {/* CATEGORY TABS */}
          <section>
            <div className="flex gap-4 border-b border-white/20 pb-2 select-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveCategory(cat)
                    // Sync banner with category selected (for bullets)
                    const catIndex = categories.indexOf(cat)
                    setBanner(catIndex)
                    startInterval()
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* CAR GRID */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none">
            {carData[activeCategory].map((car, i) => (
              <div
                key={i}
                className={`bg-white/5 rounded-xl shadow-md p-3 cursor-pointer transition-opacity duration-700 ${
                  fadeBanner ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => setModalCar(car)}
                title={`Click for details: ${car.name}`}
              >
                <img
                  src={car.img}
                  className="w-full h-32 object-cover rounded-lg"
                  alt={car.name}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/300x200?text=Car+Unavailable")
                  }
                  draggable={false}
                />
                <h3 className="mt-2 text-center text-sm font-semibold text-white">
                  {car.name}
                </h3>
              </div>
            ))}
          </section>

          {/* CONTACT */}
          <section className="card p-6 mt-10 select-text">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-sm mt-2">
              Email: info@magellan.com | Phone: (02) 1234-5678
            </p>
          </section>
        </div>
      </DashboardLayout>

      {/* ===============================
          CAR DETAILS MODAL POPUP
      ================================ */}
      {modalCar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setModalCar(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-bg rounded-lg max-w-lg w-full shadow-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close modal"
              onClick={() => setModalCar(null)}
              className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-600 transition"
            >
              &times;
            </button>

            <img
              src={modalCar.img}
              alt={modalCar.name}
              className="w-full h-64 object-cover rounded-t-lg"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/600x400?text=Car+Unavailable")
              }
              draggable={false}
            />
            <div className="p-6 text-white">
              <h3 id="modal-title" className="text-2xl font-bold mb-2">
                {modalCar.name}
              </h3>
              <p>{modalCar.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
