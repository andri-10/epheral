import Image from "next/image";
import bstudio from "@/public/works/bstudio.png";
import joiCafe from "@/public/works/joicafe.png";
import leadJustice from "@/public/works/leadjustice.png";

const websites = [
  { name: "B-Studio Pilates & Fitness", image: bstudio },
  { name: "Joi Café & Kuchen", image: joiCafe },
  { name: "Lead the Justice Academy", image: leadJustice },
];

export function WorksGallery() {
  return (
    <section className="works-gallery" id="work" aria-labelledby="works-title">
      {websites.map((website) => (
        <figure className="works-gallery__card" key={website.name}>
          <div className="works-gallery__image">
            <Image src={website.image} alt={`${website.name} website preview`} sizes="(min-width: 1200px) 28vw, (min-width: 700px) 30vw, 90vw" />
          </div>
          <figcaption className="works-gallery__caption">
            <span className="works-gallery__name">{website.name}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
