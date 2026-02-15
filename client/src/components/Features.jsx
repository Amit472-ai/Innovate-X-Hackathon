
import React from 'react';
// Force update
const features = [
  {
    icon: '🤖',
    title: 'AI Symptom Checker',
    desc: 'Get instant, AI-powered analysis of your symptoms and possible conditions.'
  },
  {
    icon: '🏥',
    title: 'Doctor Locator',
    desc: 'Find nearby healthcare professionals and facilities quickly and easily.'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Your health data is private, secure, and never shared without your consent.'
  },
  {
    icon: '📊',
    title: 'BMI Calculator',
    desc: 'Easily calculate your Body Mass Index and understand your health status.'
  },
  {
    icon: '🌐',
    title: 'Multilingual Support',
    desc: 'Interact in your preferred language for a more comfortable experience.'
  },
  {
    icon: '💧',
    title: 'Smart Hydration',
    desc: 'Track your daily water intake and stay hydrated with visual progress goals.'
  },
  {
    icon: '🔥',
    title: 'Calorie Tracking',
    desc: 'Monitor your daily calories and log food intake to maintain your diet.'
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    desc: 'Access the platform seamlessly from any device, anywhere, anytime.'
  },
];

const Features = () => (
  <section className="container mx-auto px-4 py-12">
    <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Platform Features</h2>
    <div className="relative overflow-x-hidden">
      <div
        className="flex gap-8 whitespace-nowrap animate-features-scroll hover:[animation-play-state:paused]"
        style={{
          animation: 'features-scroll 30s linear infinite',
        }}
      >
        {[...features, ...features].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6 text-center min-w-[320px] max-w-sm mx-4 transition-transform duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
            style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      @keyframes features-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default Features;
