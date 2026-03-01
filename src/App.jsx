import NavBar from "../componet/NavBar";
import WebVideo from "../componet/WebVideo";
import { LightRays } from "@/components/ui/light-rays";

function App() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden max-w-screen">

      {/* Background Effect */}
      <LightRays />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-8 max-w-full">

        {/* Navbar */}
        <div className="pt-6">
          <NavBar />
        </div>

        {/* Centered Camera Section */}
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full flex items-center justify-center">
            <WebVideo />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;