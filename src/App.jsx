import React from "react";

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
        <h1 className="text-xl font-bold tracking-wide">
          VELAXION
        </h1>

        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          <a href="#about" className="hover:text-white transition">
            소개
          </a>
          <a href="#change" className="hover:text-white transition">
            변화
          </a>
          <a href="#future" className="hover:text-white transition">
            계획
          </a>
          <a href="#service" className="hover:text-white transition">
            서비스
          </a>
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
          <p className="text-white/50 mb-4">
            생각을 행동으로, 행동을 변화로
          </p>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            꿈은 행동할 때
            <br />
            현실이 됩니다.
          </h2>

          <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-xl">
            VELAXION은 목표와 꿈을 단순한 생각에 머무르게 하지 않고,
            오늘 실행 가능한 행동으로 바꾸는 실행 중심 서비스입니다.
          </p>
        </div>

        <div className="rounded-[32px] overflow-hidden border border-white/10 bg-white/5 aspect-video">
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
  const reviews = [
    {
      image: "/reviews/review1.jpg",
      text: "막연했던 목표가 오늘 해야 할 행동으로 바뀌었습니다.",
    },
    {
      image: "/reviews/review2.jpg",
      text: "혼자서는 미뤘던 일을 결국 시작하게 됐습니다.",
    },
    {
      image: "/reviews/review3.jpg",
      text: "작은 행동이 쌓이면서 변화가 보이기 시작했습니다.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-[#10161d]">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">
          Customer Experience
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          사람들은 생각보다
          <br />
          행동이 필요했습니다.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-[32px] bg-white/5 border border-white/10 overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={review.image}
                  alt="후기"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-7">
                <p className="text-xl font-semibold leading-relaxed">
                  {review.text}
                </p>
              </div>
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

        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          함께 실천하고 경험하고
          <br />
          이끌어나갑니다.
        </h2>

        <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
          VELAXION은 단순한 조언 서비스가 아닙니다.
          직접 행동하고 경험하며 변화를 만들어갈 수 있도록
          함께 실행하는 플랫폼입니다.
        </p>

        <div className="mt-14 rounded-[32px] overflow-hidden border border-white/10 bg-white/5 aspect-video">
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
  const changes = [
    "막연한 생각이 실행 계획으로 바뀌었습니다.",
    "작은 행동이 반복되며 자신감이 생겼습니다.",
    "혼자 멈춰 있던 시간이 움직이기 시작했습니다.",
    "목표가 더 이상 먼 이야기가 아니게 됐습니다.",
  ];

  return (
    <section
      id="change"
      className="py-24 px-6 bg-[#10161d]"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-white/50 mb-3">
          Real Change
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          실제 사용자들의 변화
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {changes.map((item, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-white/10 bg-white/5 p-8"
            >
              <p className="text-2xl font-bold leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FuturePlan() {
  const plans = [
    {
      title: "미래는 실행입니다",
      text: "아무리 큰 꿈도 행동하지 않으면 현실이 되지 않습니다. 오늘 실행 가능한 작은 행동 하나가 결국 미래를 만듭니다.",
    },
    {
      title: "하루 하나면 충분합니다",
      text: "완벽함보다 중요한 것은 지속입니다. 하루 하나의 행동이 반복되면 결국 방향이 생기고 변화가 시작됩니다.",
    },
    {
      title: "변화는 증명됩니다",
      text: "변화는 말이 아니라 반복된 행동으로 증명됩니다. 행동은 기록되고 결국 성장으로 이어집니다.",
    },
  ];

  return (
    <section id="future" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        <p className="text-white/50 mb-3">
          Future Plan
        </p>

        <h2 className="text-4xl md:text-6xl font-bold mb-14">
          앞으로의 계획
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="rounded-[32px] bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-2xl font-bold mb-4">
                {plan.title}
              </h3>

              <p className="text-white/60 leading-relaxed">
                {plan.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[32px] overflow-hidden border border-white/10 bg-white/5 aspect-video">
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

function ServicePreview() {
  return (
    <section
      id="service"
      className="py-24 px-6 bg-[#10161d]"
    >
      <div className="max-w-7xl mx-auto">

        <p className="text-white/50 mb-3">
          Service
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          서비스는 다시 설계 중입니다.
        </h2>

        <p className="text-white/60 max-w-2xl leading-relaxed">
          기존 기능은 모두 제거되었습니다.
          이제 VELAXION은 목표와 꿈을 행동하게 만드는
          핵심 구조부터 처음부터 다시 설계됩니다.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-7xl mx-auto text-sm text-white/40">
        © 2026 VELAXION. All rights reserved.
      </div>
    </footer>
  );
}
