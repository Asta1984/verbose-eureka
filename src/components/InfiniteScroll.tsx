import { useEffect, useRef } from "react"

interface LogoItem {
  id: number
  name: string
  image: string
}

const logos: LogoItem[] = [
  {
    id: 1,
    name: "Cointelegraph",
    image: "https://catzilla.meme/_next/static/media/cointelegraph.ccbeb603.svg",
  },
  {
    id: 2,
    name: "Coinmarketcap",
    image: "https://catzilla.meme/_next/static/media/coinmarketcap.ed433820.svg",
  },
  {
    id: 3,
    name: "Techbullion",
    image: "https://catzilla.meme/_next/static/media/techbullion.faf80993.webp",
  },
  {
    id: 4,
    name: "Benginga",
    image: "https://catzilla.meme/_next/static/media/benzinga.f2b45f53.svg",
  },
  {
    id: 5,
    name: "Cryptodaily",
    image: "https://catzilla.meme/_next/static/media/cryptoDaily.52a1e996.webp",
  },
  {
    id: 6,
    name: "Binancesquare",
    image: "https://catzilla.meme/_next/static/media/binance.cb57624e.svg",
  },
  
]

export function InfiniteScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollWidth = scrollContainer.scrollWidth
    const animationDuration = scrollWidth * 0.01 // Adjust speed based on content width

    scrollContainer.style.setProperty("--scroll-width", `-${scrollWidth}px`)
    scrollContainer.style.setProperty("--animation-duration", `${animationDuration}s`)
  }, [])

  return (
    <div className="w-full overflow-hidden py-8 -mb-8">
      <div
        ref={scrollRef}
        className="flex animate-scroll gap-8"
        style={{
          "--scroll-width": "0px",
          "--animation-duration": "0s",
        } as React.CSSProperties}
      >
        {/* Original logos */}
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="relative flex h-[20px] min-w-[200px] items-center justify-center rounded-lg px-6"
          >
            <img src={logo.image} alt={logo.name} className="h-9 w-auto" />
          </div>
        ))}
        {/* Duplicated logos for seamless loop */}
        {logos.map((logo) => (
          <div
            key={`${logo.id}-duplicate`}
            className="relative flex h-[20px] min-w-[200px] items-center justify-center rounded-lg px-6"
          >
            <img src={logo.image} alt={logo.name} className="h-8 w-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

