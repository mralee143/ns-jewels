import { AdminProductForm } from "@/components/admin/admin-product-form";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">New product</h1>
        <p className="mt-2 max-w-xl text-sm text-[#6E6E6E]">
          Create a product stored in the database. Use the same category slugs as the storefront (bracelets, rings,
          etc.).
        </p>
      </div>
      <AdminProductForm mode="create" />
    </div>
  );
}
