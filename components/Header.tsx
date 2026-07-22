import { Yuji_Syuku } from 'next/font/google';

const yujiSyuku = Yuji_Syuku({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center">
      <div className="w-full max-w-[720px] mx-auto px-4">
        <h1
          className={`${yujiSyuku.className} text-xl md:text-2xl text-[#1e3a5f]`}
        >
          代書屋の角さん
        </h1>
      </div>
    </header>
  );
}
