import { useState } from 'react'
import { TokenPresaleModal } from '@/components/TokenPresaleModal'
import { InteractiveCheckout } from '@/components/ui/interactive-checkout'



export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <section className="py-28 px-6 text-center overflow-x-hidden ">
        <InteractiveCheckout/>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 m">
        </div>
      </section>
      <TokenPresaleModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

