import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "secondary"; className?: string };

export function ArrowLink({ href, children, variant = "primary", className = "" }: Props) {
  return (
    <Link className={`button button--${variant} ${className}`} href={href}>
      <span>{children}</span><ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
    </Link>
  );
}
