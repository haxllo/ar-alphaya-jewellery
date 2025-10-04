'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  { src: '/images/001.jpg', alt: 'Jewellery piece 001' },
  { src: '/images/002.jpg', alt: 'Jewellery piece 002' },
]

export default function DynamicHeroImage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-full w-full">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover object-center rounded-3xl"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
