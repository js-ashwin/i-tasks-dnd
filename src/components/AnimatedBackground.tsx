import React from "react";

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-slate-50">
      <style>{`
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10vw, -10vh) scale(1.1); }
          66% { transform: translate(-5vw, 15vh) scale(0.9); }
        }
        @keyframes blob-float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10vw, 10vh) scale(0.95); }
          66% { transform: translate(15vw, -5vh) scale(1.1); }
        }
        @keyframes blob-drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10%, 10%) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .animate-blob {
          animation: blob-float 20s ease-in-out infinite;
        }
        .animate-blob-reverse {
          animation: blob-float-reverse 25s ease-in-out infinite;
        }
        .animate-blob-drift {
          animation: blob-drift 30s linear infinite;
        }
      `}</style>

      {/* Layer 1: Animated Blobs */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none overflow-hidden">
        {/* Top Left Blob */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] animate-blob" />

        {/* Top Right Blob */}
        <div
          className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-200 rounded-full blur-[120px] animate-blob-reverse"
          style={{ animationDelay: "2s" }}
        />

        {/* Large Bottom Blob */}
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-pink-100 rounded-full blur-[130px] animate-blob-drift" />

        <div
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-teal-100 rounded-full blur-[100px] animate-blob"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100 rounded-full blur-[120px] animate-blob"
          style={{ animationDuration: "10s" }}
        />

        {/* Orange Accent Blob */}
        <div
          className="absolute top-1/2 left-1/5 w-[400px] h-[600px] bg-orange-100 rounded-full blur-[120px] animate-blob-reverse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Layer 2: The Grid */}
      <div className="fixed inset-0 z-10 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Layer 3: Content */}
      <div className="relative z-20 w-full min-h-screen text-slate-900">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
