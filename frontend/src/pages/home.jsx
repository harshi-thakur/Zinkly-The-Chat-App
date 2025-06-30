import { Link } from "react-router-dom";
import { useState,useEffect, useRef } from "react";
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);




export default function Home() {
  const elementRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const handleMouseMove = (event) => {
  if (elementRef.current) {
    const rect = elementRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left-150).toFixed()/40;
    const y = (event.clientY - rect.top-150).toFixed()/20;
    if(x>0){
      setMousePosition({x:-x*8,y:y*3});
    }else{
      setMousePosition({x:-x*2,y:y*3});
       
    }
  }
};

  return (
    <div className="bg-white shadow-2xl overflow-hidden">
      {/* Hero Section */}
      <section className="px-8 py-16 bg-gray-50" onMouseMove={handleMouseMove}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1B0036] leading-tight">
              Stay Connected,
              <br />
              Anytime, Anywhere
            </h1>
            <p className="text-gray-600 text-lg">
              Chat effortlessly with friends and family
              <br />— no matter the distance.
            </p>
            <Link to="/signup">
              <Button className="bg-[#1B0036] text-white hover:bg-gray-800 rounded-full px-8 py-3 text-lg">
               FEEL THE CONNECTION
              </Button>
            </Link>
          </div>

          <div className={"flex justify-center"} >
               
            <div className="relative">
              {/* Main character illustration */}
              <div ref={elementRef} className="relative w-80 h-80 rounded-full shadow-[0_0_100px_20px_rgba(170,255,120,1)] transition-shadow duration-300" style={{transform: ` rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) `,
    transformStyle: 'preserve-3d',
    }} >
          
                {/* Background circle */}
                <div className="absolute inset-0 bg-red-500 rounded-full"></div>

                {/* Character body */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-yellow-400 rounded-t-full  overflow-hidden ">
                  {/* Polka dots pattern */}
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-white rounded-full"
                        style={{
                          left: `${(i % 5) * 20 + 10}%`,
                          top: `${Math.floor(i / 5) * 25 + 10}%`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Character head */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-18 bg-[#1B0036] rounded-full">
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="absolute -top-4 -left-8 w-20 h-12 bg-[#1B0036] rounded-2xl flex items-center justify-center">
                  <div className="w-12 h-1 bg-white rounded-full"></div>
                </div>
                <div className="absolute -top-4 -right-8 w-20 h-12 bg-[#1B0036] rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid lg:grid-cols-2">
        {/* Real-Time Messaging */}
        <div className="bg-[#D8EDC2] p-12 flex items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1B0036]">
              Real-Time Messaging
            </h2>
            <p className="text-[#1B0036] text-lg leading-relaxed">
              Experience instant communication with real-time messaging. Send
              and receive messages instantly, share photos and videos, and never
              miss a moment. Stay in the loop, whether you're at home or on the
              go.
            </p>
          </div>

          <div className="ml-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-[#1B0036] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Chats Made Easy */}
        <div className="bg-[#1B0036] p-12 flex items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Group Chats Made Easy
            </h2>
            <p className="text-white text-lg leading-relaxed">
              Create group chats to keep everyone in the conversation. Organize
              your chats by topics, events, share updates, and make plans
              together. It's never been easier to coordinate with friends or
              collaborate with teammates!
            </p>
          </div>

          <div className="ml-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-[#D8EDC2] rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#1B0036] rounded-full"></div>
                </div>
              </div>
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-2 bg-white rounded-lg px-2 py-1 text-xs text-[#1B0036] font-medium">
                Hello!
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
  );
}
