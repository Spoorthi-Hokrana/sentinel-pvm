import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">
      <nav className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          SENTINEL-PVM
        </h1>
        <div className="flex gap-6 italic text-gray-400">
          <span>Landing</span>
          <span>Dashboard</span>
          <span>Benchmark</span>
          <span>Stats</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-extrabold mb-6 leading-tight">
            Cryptographic Coprocessing <br/> for the <span className="text-pink-500">DePIN Era</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Offload ed25519 batch verification and Bulletproofs to PolkaVM. 
            Blazing fast execution with Solidity composability.
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
              Launch Dashboard
            </button>
            <button className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-full font-bold transition-all">
              View Specs
            </button>
          </div>
        </motion.div>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Scalable", desc: "Verify 1000+ signatures per block." },
            { title: "Native Rust", desc: "Full access to no_std Rust crates." },
            { title: "Cross-VM", desc: "Direct calls from Solidity via pallet-revive." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#161b22] border border-gray-800 hover:border-pink-500/50 transition-colors">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
