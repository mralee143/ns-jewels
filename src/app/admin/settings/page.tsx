import { AdminSettingsActions } from "@/components/admin/admin-settings-actions";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-3xl border border-[#F0D3DA] bg-white p-6 shadow-[0_18px_40px_rgba(216,92,108,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cta">Admin Settings</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">Settings</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6E6E6E]">
          Use these quick actions to return to the storefront home page or safely log out of the admin panel.
        </p>
        <div className="mt-6">
          <AdminSettingsActions />
        </div>
      </section>
    </div>
  );
}
