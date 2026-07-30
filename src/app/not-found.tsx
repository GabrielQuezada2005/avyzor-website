import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Seite nicht gefunden
        </h1>
        <p className="text-white/50 mb-8">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link href="/">
          <Button size="lg">
            <ArrowLeft size={18} />
            Zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
}
