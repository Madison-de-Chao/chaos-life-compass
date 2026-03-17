import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
