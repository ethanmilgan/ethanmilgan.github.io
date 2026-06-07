import { redirect } from "next/navigation";
import { getCurrentSession, isCustomer } from "@/app/lib/auth";
import { getOrdersForUser } from "@/app/lib/orders";

export const dynamic = "force-dynamic";

function formatCurrency(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export default async function AccountPage() {
  const session = await getCurrentSession();

  if (!isCustomer(session)) {
    redirect("/login");
  }

  const orders = await getOrdersForUser(session.id);

  return (
    <main className="bg-[#fffaf6] px-4 py-16 text-[#171413] sm:px-8 sm:py-20 lg:px-14 lg:py-28">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-normal text-[#b92e4d]">Account</p>
          <h1 className="serif text-4xl font-bold leading-none sm:text-6xl">Past orders</h1>
          <p className="mt-5 max-w-2xl leading-7 text-[#655e58]">
            Signed in as {session.email}. Customers can view order history here. CMS access is reserved for administrators.
          </p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-lg border border-[#ded3ca] bg-white px-5 py-3 text-sm font-black" type="submit">
            Sign out
          </button>
        </form>
      </div>

      {orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article className="rounded-lg border border-[#ded3ca] bg-white p-5" key={order.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-normal text-[#b92e4d]">Order #{order.id}</p>
                  <h2 className="mt-2 text-xl font-black">{formatCurrency(order.totalCents)}</h2>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black capitalize">{order.status}</p>
                  <p className="text-sm text-[#655e58]">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-lg border border-[#ded3ca] bg-white p-6">
          <h2 className="text-xl font-black">No orders yet</h2>
          <p className="mt-3 leading-7 text-[#655e58]">
            Once you place an order, your order history will appear here.
          </p>
        </section>
      )}
    </main>
  );
}
