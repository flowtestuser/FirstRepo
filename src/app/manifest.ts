import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Addition, plainly",
    short_name: "Addition",
    description: "A simple, clear calculator for adding two numbers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e5",
    theme_color: "#f5f0e5",
  };
}
