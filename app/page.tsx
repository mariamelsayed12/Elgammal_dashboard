import { getProductsListAction } from "@/app/actions/products.actions";
import { Navbar } from "@/app/components/Navbar";
import { ProductCard } from "@/app/components/ProductCard";
import { EmptyState } from "@/app/components/EmptyState";

export default async function Home() {
  const products = await getProductsListAction();

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#eff1f4]">
      {/* Top Navbar */}
      <Navbar title="Products" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-[24px] p-[32px] w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-[8px] w-full">
          <div className="flex gap-[12px] items-center w-full">
            <h2 className="font-poppins font-semibold text-[28px] text-[#141414] leading-none">
              Products
            </h2>
            <div className="bg-[#d4d5d8] flex items-center px-[8px] py-[4px] rounded-[9999px] shrink-0">
              <span className="font-poppins font-semibold text-[11px] text-[#464646] leading-none">
                {products.length}
              </span>
            </div>
          </div>
          <p className="font-poppins font-normal text-[14px] text-[#464646] leading-none">
            Manage your product line
          </p>
        </div>

        {/* Product Cards List */}
        <div className="flex flex-col gap-[16px] w-full">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  // Ensure correct typing since MongoDB returns Date objects for createdAt/updatedAt
                  createdAt: new Date(product.createdAt),
                  updatedAt: new Date(product.updatedAt),
                }}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Bottom statistics */}
        {products.length > 0 && (
          <div className="flex flex-col items-center pt-[8px] w-full">
            <p className="font-poppins font-normal text-[14px] text-[#464646] text-center leading-none">
              Showing 1 to {products.length} of {products.length} products
            </p>
          </div>
        )}
      </main>
    </div>
  );
}