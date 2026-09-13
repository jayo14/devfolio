export function resolveImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const apiBase = import.meta.env.VITE_API_URL || "";
  if (trimmed.startsWith("/")) {
    return apiBase ? `${apiBase.replace(/\/+$/, "")}${trimmed}` : trimmed;
  }
  return trimmed;
}
