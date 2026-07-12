import { redirect } from "next/navigation";
import { getImageAssets } from "@/app/lib/assets";
import { getProducts } from "@/app/lib/catalog";
import { getCurrentSession, isAdmin } from "@/app/lib/auth";
import AdminProductManager from "./product-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (!isAdmin(session)) {
    redirect("/account");
  }

  const products = await getProducts();
  const assets = await getImageAssets();

  return (
    <main className="bg-[#fff7f1] px-4 py-16 text-[#5b1725] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#9f5f6f]">CMS</p>
          <h1 className="serif text-4xl font-bold leading-none sm:text-6xl">Shop content manager</h1>
          <p className="mt-5 max-w-2xl leading-7 text-[#6f5d55]">
            Signed in as {session.email}. Product changes are written to MongoDB and shown on the public Shop page.
          </p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-lg border border-[#d8c1b4] bg-white px-5 py-3 text-sm font-black" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <AdminProductManager initialAssets={assets} initialProducts={products} />
    </main>
  );
}
