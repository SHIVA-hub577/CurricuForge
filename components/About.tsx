
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          The Future of Curriculum Design
        </h1>
        <p className="text-xl text-slate-400">
          CurricuForge leverages cutting-edge AI to build structured, industry-aligned learning pathways in seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-colors group">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Instant Generation</h3>
          <p className="text-slate-400 leading-relaxed">
            Forget spending weeks mapping out courses. Our AI analyzes industry requirements and generates a full OBE-compliant curriculum in under 30 seconds.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/30 transition-colors group">
          <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">OBE Alignment</h3>
          <p className="text-slate-400 leading-relaxed">
            Every curriculum is generated with Outcome Based Education principles at its core, ensuring students meet specific industry competencies.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-colors group">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Industry Ready</h3>
          <p className="text-slate-400 leading-relaxed">
            We map topics to real-world job roles and capstone projects, bridging the gap between academic theory and professional practice.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/30 transition-colors group">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Privacy First</h3>
          <p className="text-slate-400 leading-relaxed">
            CurricuForge respects your data. Our design is optimized for efficiency and can be adapted for local inference models.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
