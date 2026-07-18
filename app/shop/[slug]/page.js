import { redirect } from "next/navigation";

export default async function ShopDetailRedirectPage({ params }) {
  const { slug } = await params;
  redirect(`/services/${slug}`);
}
