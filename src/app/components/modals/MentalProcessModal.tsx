import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { useState } from 'react'

export default function MentalProcessModal() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className="absolute top-10 left-1/2" onClick={() => setIsOpen(true)}>Open dialog</button>
      <Transition
        show={isOpen}
        enter="duration-200 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="duration-300 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50 transition">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 text-black">
            <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
              <DialogTitle className="font-bold">What is a Mental Process?</DialogTitle>
              <Description>
              Imagine your soul as a busy mind, constantly processing information and responding to the world around it. It's not just a passive receiver of information, but an active participant with its own unique way of thinking and behaving.

              </Description>
              <p>Mental Processes are like different modes your soul can switch between, each representing a unique way of thinking and acting. Think of them like gears in a machine, each performing a specific function.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsOpen(false)}>Skip</button>
                <button onClick={() => setIsOpen(false)}>Tell me more!</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}