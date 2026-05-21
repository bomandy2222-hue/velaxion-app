import React from "react";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white overflow-x-hidden">
      <Header />
      <Hero />
      <Experience />
      <CompanyIntro />
      <UserChanges />
      <FuturePlan />
      <ServicePreview />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">VELAXION</h1>
        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          <a href="#about" className="hover:text-white">소개</a>
          <a href="#change" className="hover:text-white">변화</a>
          <a href="#future" className="hover:text-white">계획</a>
          <a href="#service" className="hover:text-white">서비스</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-white/50 mb-4">생각을 행동으로, 행동을 변화로</p>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            꿈은 행동할 때<br />현실이 됩니다.
          </h2>
          <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-xl">
            VELAXION은 목표와 꿈을 단순한 생각에 머무르게 하지 않고,
            오늘 실행 가능한 행동으로 바꾸는 실행 중심 서비스입니다.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-video">
          <video
            className="w-full h-full object-cover"
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="about" className="py-24 px-6 bg-[#10161d]">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">Customer Experience</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          사람들은 생각보다<br />행동이 필요했습니다.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "막연했던 목표가 오늘 해야 할 행동으로 바뀌었습니다.",
            "혼자서는 미뤘던 일을 결국 시작하게 됐습니다.",
            "작은 행동이 쌓이면서 변화가 보이기 시작했습니다.",
          ].map((text, i) => (
            <div key={i} className="rounded-3xl bg-white/5 border border-white/10 p-7">
              <div className="h-56 rounded-2xl bg-white/10 mb-6 overflow-hidden">
                <img
                  src={`/reviews/review${i + 1}.jpg`}
                  alt="사용자 경험"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xl font-semibold leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyIntro() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          함께 실천하고 경험하고 이끌어나갑니다.
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
          VELAXION은 단순히 답을 주는 서비스가 아닙니다.
          사용자가 직접 행동하고, 경험하고, 변화하도록 돕는 실행 플랫폼입니다.
        </p>

        <div className="mt-14 rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-video">
          <video
            className="w-full h-full object-cover"
            src="/videos/company.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}

function UserChanges() {
  return (
    <section id="change" className="py-24 px-6 bg-[#10161d]">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">Real Change</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          실제 사용자들의 변화
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            "막연한 생각이 실행 계획으로 바뀌었습니다.",
            "작은 행동이 반복되며 자신감이 생겼습니다.",
            "혼자 멈춰 있던 시간이 움직이기 시작했습니다.",
            "목표가 더 이상 먼 이야기가 아니게 됐습니다.",
          ].map((text, i) => (
            <div key={i} className="rounded-3xl bg-white/5 border border-white/10 p-8">
              <p className="text-2xl font-bold leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FuturePlan() {
  return (
    <section id="future" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">Future Plan</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-14">
          앞으로의 계획
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          <PlanCard
            title="미래는 실행입니다"
            text="아무리 큰 꿈도 행동하지 않으면 현실이 되지 않습니다. VELAXION은 사용자의 생각을 오늘 실행 가능한 행동으로 바꾸고, 작은 시작이 실제 변화로 이어지도록 돕습니다."
          />
          <PlanCard
            title="하루 하나면 충분합니다"
            text="완벽한 계획보다 중요한 것은 지속 가능한 한 걸음입니다. 하루 하나의 행동이 쌓이면 방향이 생기고, 그 방향은 결국 삶의 변화를 만들어냅니다."
          />
          <PlanCard
            title="변화는 증명됩니다"
            text="변화는 말이 아니라 반복된 행동으로 증명됩니다. VELAXION은 사용자의 실행과 성장을 기록하고, 스스로 변화하고 있다는 사실을 확인하게 만듭니다."
          />
        </div>

        <div className="mt-14 rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-video">
          <video
            className="w-full h-full object-cover"
            src="/videos/future.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({ title, text }) {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/60 leading-relaxed">{text}</p>
    </div>
  );
}

function ServicePreview() {
  return (
    <section id="service" className="py-24 px-6 bg-[#10161d]">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">Service</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          서비스는 다시 설계 중입니다.
        </h2>
        <p className="text-white/60 max-w-2xl leading-relaxed">
          기존 7일 체험, 컨설팅룸, 커뮤니티 기능은 제거되었습니다.
          이제 VELAXION은 목표와 꿈을 행동으로 바꾸는 핵심 구조부터
          다시 설계됩니다.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto text-sm text-white/40">
        © VELAXION. All rights reserved.
      </div>
    </footer>
  );
}
