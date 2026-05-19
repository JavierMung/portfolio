
import { Analytics } from '@vercel/analytics/react'
import Footer from './components/Footer/Footer'
import Terminal from './components/Terminal/Terminal'

function App() {

  return (
    <div className="w-screen h-screen bg-mist-950">
      <Terminal />
      <Footer />
      <Analytics />
    </div>
  )
}

export default App
