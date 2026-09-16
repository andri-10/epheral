import Image from "next/image";

export function BrandLogo({ priority = false, darkText = false }: { priority?: boolean; darkText?: boolean }) {
  return <span className="brand-logo" aria-label="Epheral">
    <Image className="brand-logo__base" src={darkText ? "/brand/epheral_black_text.png" : "/brand/epheral_dark_background.png"} alt="Epheral" width={1274} height={637} priority={priority} />
    {!darkText && <span className="brand-logo__reveal" aria-hidden="true"><Image src="/brand/epheral_blue_text.png" alt="" width={1274} height={637} priority={priority} /></span>}
  </span>;
}
