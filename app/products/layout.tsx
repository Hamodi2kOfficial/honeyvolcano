import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Raw honey in 500 g and 1 kg, honeycomb, honey delicacies in four flavours, multicoloured honey, bee pollen and bee bread. Prices in ISK — call to taste before you buy.",
  alternates: { canonical: "/products/" },
};

export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return children;
}
