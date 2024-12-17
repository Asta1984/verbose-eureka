import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { About, Tokenomics, Airdrop, FAQ } from "@/components/Hero"
import Footer from '@/components/Footer'
import { TokenPresaleModal } from '@/components/TokenPresaleModal'

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <section className="py-28 px-6 text-center ">
        <h1 className="text-4xl sm:text-5xl font-OnlinePrivileges mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-600 mt-10">
          Revolution in Decentralization
        </h1>
        <p className="font-Type_writer text-sm mb-4 max-w-2xl mx-auto text-muted-foreground">
          Discover the power of V4Fluffy. Transform your business through smart innovation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={openModal}>
            Get Started
          </Button>
          <Button variant="outline">
            <Link to="/#features">Learn More</Link>
          </Button>
        </div>
      </section>

      <About />
      <Tokenomics />
      <Airdrop />
      <FAQ />
      <Footer />
      <TokenPresaleModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

