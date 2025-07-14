"use client"

import Navbar from "./navbar"

export default function ToiletAnimation() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200  flex items-center justify-center">
      <div className="toilet-container relative">
        <div id="toilet-leg" className="toilet-leg"></div>
        <div id="toilet-tank" className="toilet-tank"></div>
        <div id="toilet-tank-lid" className="toilet-tank-lid"></div>
        <div id="flush-lever" className="flush-lever"></div>
        <div id="toilet-bowl" className="toilet-bowl"></div>
        <div id="toilet-lid" className="toilet-lid"></div>
        <div id="water" className="water"></div>
        <div id="generating-text" className="generating-text">
          <span>Generating</span>
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
        <div id="toilet-bowl-overlay" className="toilet-bowl-overlay"></div>
      </div>

      <style jsx>{`
        .toilet-container {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .toilet-container div {
          background: white;
        }

        .toilet-lid {
          height: 15px;
          width: 200px;
          border-radius: 6px;
          position: absolute;
          left: calc((100% - 350px) / 2);
          top: calc((100% - 210px) / 2);
          transform-origin: 192.5px 7.5px;
          animation: lid-opening 6s infinite ease-out;
        }

        .toilet-bowl {
          height: 80px;
          width: 200px;
          border-radius: 6px 6px 100px 100px;
          position: absolute;
          left: calc((100% - 350px) / 2);
          top: calc((100% - 165px) / 2);
          box-shadow: 0 0 0 9px #ADD8E6;
        }

        .toilet-leg {
          height: 190px;
          width: 200px;
          border-radius: 6px;
          position: absolute;
          left: calc((100% - 200px) / 2);
          top: calc((100% - 165px) / 2);
        }

        .toilet-tank {
          height: 200px;
          width: 100px;
          border-radius: 6px;
          position: absolute;
          left: calc((100% + 68px) / 2);
          top: calc((100% - 400px) / 2);
        }

        .toilet-tank-lid {
          height: 15px;
          width: 100px;
          border-radius: 6px 6px 0 0;
          position: absolute;
          left: calc((100% + 68px) / 2);
          top: calc((100% - 440px) / 2);
        }

        .flush-lever {
          height: 15px;
          width: 50px;
          background-color: #ccc;
          border-radius: 6px;
          position: absolute;
          left: calc((100% + 120px) / 2);
          top: calc((100% - 360px) / 2);
          transform-origin: 8px 8px;
          animation: lever-rotation 6s infinite;
        }

        .toilet-bowl-overlay {
          height: 80px;
          width: 200px;
          border-radius: 6px 6px 100px 100px;
          position: absolute;
          left: calc((100% - 350px) / 2);
          top: calc((100% - 165px) / 2);
        }

        .water {
          position: absolute;
          left: calc((100% - 200px) / 2 - 1px);
          top: calc((100% - 205px) / 2 + 55px);
          background-color: #3882ff;
          height: 40px;
          width: 27px;
          animation: water 6s infinite;
        }

        .water:after {
          background-color: transparent;
          content: "";
          border-radius: 50%;
          position: absolute;
          width: 25px;
          height: 25px;
          border: 25px solid #3882ff;
          border-color: #3882ff transparent transparent #3882ff;
          transform: rotate(45deg);
          top: -22px;
          animation: water-right 6s infinite;
        }

        .water:before {
          background-color: transparent;
          content: "";
          border-radius: 50%;
          position: absolute;
          width: 25px;
          height: 25px;
          border: 25px solid #3882ff;
          border-color: #3882ff transparent transparent #3882ff;
          transform: rotate(45deg);
          top: -22px;
          right: 0px;
          animation: water-left 6s infinite;
        }

        @keyframes lever-rotation {
          10% {
            transform: rotate(0);
          }
          17% {
            transform: rotate(60deg);
          }
          24% {
            transform: rotate(0);
          }
        }

        @keyframes lid-opening {
          30% {
            transform: rotate(0);
          }
          40% {
            transform: rotate(90deg);
          }
          80% {
            transform: rotate(90deg);
          }
          90% {
            transform: rotate(0);
          }
        }

        @keyframes water {
          30% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-60px);
          }
          45% {
            transform: translateY(-70px);
          }
          50% {
            transform: translateY(-60px);
          }
          55% {
            transform: translateY(-75px);
          }
          57% {
            transform: translateY(-60px);
          }
          60% {
            transform: translateY(-75px);
          }
          65% {
            transform: translateY(-65px);
          }
          70% {
            transform: translateY(-75px);
          }
          75% {
            transform: translateY(-60px);
          }
          80% {
            transform: translateY(-75px);
          }
          90% {
            transform: translateY(0);
          }
        }

        @keyframes water-right {
          30% {
            transform: rotate(45deg);
          }
          40% {
            transform: rotate(30deg);
          }
          45% {
            transform: rotate(65deg);
          }
          50% {
            transform: rotate(30deg);
          }
          55% {
            transform: rotate(65deg);
          }
          57% {
            transform: rotate(30deg);
          }
          60% {
            transform: rotate(65deg);
          }
          65% {
            transform: rotate(30deg);
          }
          70% {
            transform: rotate(65deg);
          }
          75% {
            transform: rotate(30deg);
          }
          80% {
            transform: rotate(65deg);
          }
          90% {
            transform: rotate(45deg);
          }
        }

        @keyframes water-left {
          30% {
            transform: rotate(45deg);
          }
          40% {
            transform: rotate(65deg);
          }
          45% {
            transform: rotate(30deg);
          }
          50% {
            transform: rotate(65deg);
          }
          55% {
            transform: rotate(30deg);
          }
          57% {
            transform: rotate(65deg);
          }
          60% {
            transform: rotate(30deg);
          }
          65% {
            transform: rotate(65deg);
          }
          70% {
            transform: rotate(30deg);
          }
          75% {
            transform: rotate(65deg);
          }
          80% {
            transform: rotate(30deg);
          }
          90% {
            transform: rotate(45deg);
          }
        }

        .generating-text {
          position: absolute;
          left: calc((100% - 350px) / 2 + 50px);
          top: calc((100% - 165px) / 2 + 30px);
          font-size: 16px;
          font-weight: bold;
          color: black;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 2px;
          z-index: 10;
          animation: text-float 6s infinite;
        }

        .dots span {
          animation: dot-blink 1.5s infinite;
        }

        .dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .dots span:nth-child(2) {
          animation-delay: 0.3s;
        }

        .dots span:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes dot-blink {
          0%, 60%, 100% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
        }

        @keyframes text-float {
          0%, 30% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
          80% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
          90%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
    </>
  )
}
