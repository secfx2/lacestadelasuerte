"use client";
import { store } from "@/lib/client";

/** Acción extra «Foto con modelo»: lleva un flat lay a Prenda concreta. */
export function modelShotAction(router) {
  return function ModelShot(job, out, close) {
    if (job.meta?.shot === "model" || job.role?.startsWith("logo")) return null;
    return (
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => {
          store.set("prenda.prefill", {
            base: { url: out.url, jobId: out.hfJobId || null },
            text: job.meta?.description || "",
            garment: job.meta?.garment || "",
            pose: job.meta?.pose || "",
            name: job.meta?.title || "",
            category: job.meta?.category || "",
            kind: job.meta?.kind || "garment",
            price: job.meta?.price || null,
            details: job.meta?.details || [],
          });
          close?.();
          router.push("/prenda");
        }}
      >
        Foto con modelo
      </button>
    );
  };
}
