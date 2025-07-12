import Navbar from "./navbar"

export default function Spinner() {
    return (<>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-yellow-400 rounded-full animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          ></div>
        </div>

        {/* Text */}
        <p className="text-black text-xl font-bold">Loading your rizz...</p>
        <p className="text-black/70 text-sm mt-2">💀 Please wait 💀</p>
      </div>
    </div>
    </>
  )
}

