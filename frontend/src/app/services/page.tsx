import { StaticSchema } from "@/components/seo/JsonLd";
import Content from "./content";
import { staticMetadata } from "@/lib/seo";

export const generateMetadata = staticMetadata("/services", { title: "Юридические услуги в Астрахани" });

export default function Page() {
  return <><StaticSchema path="/services" /><Content /></>;
}
