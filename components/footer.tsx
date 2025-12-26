import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12">
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Disclaimer text */}
          <p className="text-xs text-slate-500 text-center">
            This is a health awareness tool. It does not diagnose disease or
            prescribe treatment.
            <br />
            Healthy Life Campaign © {new Date().getFullYear()}
          </p>

          {/* Logo and GitHub link */}
          <div className="flex items-center gap-3">
            <Link
              href="https://ohc.network?utm_source=healthylife&utm_medium=footer"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/ohc-logo.svg"
                alt="Open Healthcare Network"
                width={80}
                height={30}
                priority={false}
              />
            </Link>
            <Link
              href="https://github.com/ohcnetwork/healthylife?utm_source=healthylife&utm_medium=footer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="View source on GitHub"
            >
              <Github className="size-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
