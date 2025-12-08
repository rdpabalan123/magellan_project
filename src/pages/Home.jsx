import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  MapPinIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  // -----------------------------
  // CAR CATEGORIES + VEHICLES
  // -----------------------------
  const categories = ["SUV", "Sedan", "MPV", "Pickup"]

  const carData = {
    SUV: [
      { name: "Nissan Terra", img: "/images/nissan-terra.jpg", description: "A robust SUV with premium features and excellent off-road capabilities." },
      { name: "Jeep Wrangler", img: "/images/jeep-wrangler.jpg", description: "Iconic rugged design built for adventure and durability." },
      { name: "Hyundai Storia", img: "/images/hyundai-storia.jpg", description: "Spacious and modern SUV with advanced tech features." },
      { name: "Suzuki Ignis", img: "/images/suzuki-ignis.jpg", description: "Compact yet versatile, perfect for urban driving." }
    ],
    Sedan: [
      { name: "Suzuki Ciaz", img: "/images/suzuki-ciaz.jpg", description: "Elegant sedan with excellent fuel efficiency and comfort." },
      { name: "Suzuki Dzire", img: "/images/suzuki-dzire.jpg", description: "Reliable and affordable sedan with modern styling." },
      { name: "Nissan Almera", img: "/images/nissan-almera.jpg", description: "Spacious interior and smooth ride for daily driving." },
      { name: "Suzuki Swift", img: "/images/suzuki-swift.jpg", description: "Sporty compact sedan with peppy performance." }
    ],
    MPV: [
      { name: "Toyota Avanza (Sample)", img: "/images/toyota-avanza.jpg", description: "Practical MPV with seating for the whole family." },
      { name: "Suzuki Ertiga (Sample)", img: "/images/suzuki-ertiga.jpg", description: "Comfortable and spacious with advanced safety features." }
    ],
    Pickup: [
      { name: "Toyota Hilux", img: "/images/toyota-hilux.jpg", description: "Powerful pickup with great payload and towing capacity." },
      { name: "Nissan Navara", img: "/images/nissan-navara.jpg", description: "Durable and efficient pickup designed for tough jobs." }
    ]
  }

  // -----------------------------
  // HERO BANNER SLIDESHOW
  // -----------------------------
  const carouselImages = [
    "/images/carbanner_1.jpg",
    "/images/carbanner_2.jpg",
    "/images/carbanner_3.jpg"
  ]

  // States
  const [banner, setBanner] = useState(0)
  const [fadeBanner, setFadeBanner] = useState(false)
  const [activeCategory, setActiveCategory] = useState("SUV")
  const [modalCar, setModalCar] = useState(null)
  const [textFade, setTextFade] = useState(false)

  const intervalRef = useRef(null)

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

  const selectSlide = (index) => {
    if (index === banner) return
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
          <section className="relative w-full max-w-[900px] h-[320px] rounded-xl overflow-hidden shadow-lg select-none mx-auto">
            <img
              src={carouselImages[banner]}
              alt="Car Banner"
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                fadeBanner ? "opacity-0" : "opacity-100"
              }`}
              onError={(e) => (e.target.src = "/images/placeholder_banner.png")}
              draggable={false}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div
              className={`absolute bottom-5 left-6 max-w-xl ${
                textFade ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"
              } transition-all duration-700 ease-in-out`}
            >
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                Let Magellan Finance Help you Own your Dream Car
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Wide Choices • Trusted by Clients • Fast and Easy Financing
              </p>
            </div>

            {/* LEFT / RIGHT CONTROLS */}
            <button
              aria-label="Previous Slide"
              onClick={() => {
                slidePrev()
                startInterval()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              &#10094;
            </button>
            <button
              aria-label="Next Slide"
              onClick={() => {
                slideNext()
                startInterval()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              &#10095;
            </button>

            {/* BULLETS */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === banner ? "bg-white" : "bg-white/40 hover:bg-white"
                  }`}
                  onClick={() => {
                    selectSlide(i)
                    startInterval()
                  }}
                />
              ))}
            </div>
          </section>

          {/* ==========================
              UPDATED ABOUT US (2-COLUMN, ANIMATED)
          =========================== */}
          <section className="max-w-[900px] mx-auto mt-10 px-4 select-text">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-lg animate-fade-in">

              <h2 className="text-2xl font-extrabold mb-6 text-white drop-shadow">
                About Us
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* LEFT COLUMN */}
                <div className="space-y-4 text-slate-300 leading-relaxed text-sm">

                  <p className="font-semibold text-white text-lg">
                    About Magellan Financial Services
                  </p>

                  <p>
                    <strong>Our Vision: Fueling Prosperity in the Turks and Caicos Islands</strong><br />
                    At Magellan Financial Services, we believe that the vibrant economy of the Turks and Caicos Islands (TCI) 
                    deserves financial solutions that are as dynamic and forward-thinking as its people.
                  </p>

                  <p>
                    We are a locally focused financial services provider committed to supporting the growth of businesses 
                    and individuals across Providenciales, Grand Turk, and all the islands of the TCI.
                  </p>

                  <p className="font-semibold text-white">Why Choose Leasing with Magellan?</p>

                  <p>
                    We remove the large upfront capital barrier, enabling businesses and individuals to acquire needed assets sooner.
                  </p>

                  <p>
                    Magellan specializes in structured leasing & financing solutions for vehicles, fleets, and equipment.
                  </p>
                </div>

                {/* RIGHT COLUMN - COMMITMENT BOXES */}
                <div className="space-y-4">

                  {[
                    {
                      icon: MapPinIcon,
                      title: "Local Focus",
                      text: "We understand local regulations, markets, and the unique business environment of TCI."
                    },
                    {
                      icon: BoltIcon,
                      title: "Speed",
                      text: "Fast approvals and a streamlined process to get your assets delivered quickly."
                    },
                    {
                      icon: ShieldCheckIcon,
                      title: "Transparency",
                      text: "Clear terms, simple documentation, and no hidden fees—trust is our foundation."
                    },
                    {
                      icon: UserCircleIcon,
                      title: "Flexibility",
                      text: "Leasing structured around your seasonal cash flow and business cycle."
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-4 rounded-lg border border-white/10 flex gap-4 items-start 
                                 transform opacity-0 translate-y-4 animate-fade-slide"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-slate-300 text-sm">{item.text}</p>
                      </div>
                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* ANIMATION KEYFRAMES */}
            <style>{`
              @keyframes fadeSlide {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-slide {
                animation: fadeSlide 0.6s ease-out forwards;
              }
              @keyframes fadeInCenter {
                0% { opacity: 0; transform: scale(0.98); }
                100% { opacity: 1; transform: scale(1); }
              }
              .animate-fade-in {
                animation: fadeInCenter 0.6s ease-out forwards;
              }
            `}</style>
          </section>

          {/* CATEGORY TABS */}
          <section>
            <div className="flex gap-4 border-b border-white/20 pb-2 select-none max-w-[900px] mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? "text-white-400 border-b-2 border-white-400"
                      : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveCategory(cat)
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
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none max-w-[900px] mx-auto">
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
          <section className="p-6 mt-10 select-text max-w-[900px] mx-auto">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-sm mt-2">
              Address: Magellan Financial Services, Ltd. <br />
              1063 Leeward Highway, Providenciales <br />
              Turks and Caicos Islands, TKCA1ZZ <br />
              Email: customerservice@magellanfinancialservices.tc | Phone: +1649 232 6211
            </p>
          </section>

        </div>
      </DashboardLayout>

      {/* CAR DETAILS MODAL */}
      {modalCar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setModalCar(null)}
          role="dialog"
          aria-modal="true"
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
            />
            <div className="p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
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
