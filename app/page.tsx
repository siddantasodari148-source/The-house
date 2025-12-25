import Header from '@/components/Header';
import DynamicMenu from '@/components/DynamicMenu';
import InstallPrompt from '@/components/InstallPrompt';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] flex flex-col">
      <Header />
      {/* DynamicMenu handles the floating tabs and the paper card internally */}
      <DynamicMenu /> 
      <InstallPrompt />
    </main>
  );
}