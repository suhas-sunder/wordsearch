import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/word-search-maker", destination: "/word-search-generator", permanent: true },
      { source: "/make-your-own-word-search", destination: "/word-search-generator", permanent: true },
      { source: "/create-a-word-search", destination: "/word-search-generator", permanent: true },
      { source: "/word-search-printable", destination: "/free-printable-word-searches", permanent: true },
      { source: "/printable-word-search", destination: "/free-printable-word-searches", permanent: true },
      { source: "/free-word-search-printable", destination: "/free-printable-word-searches", permanent: true },
      { source: "/word-search-online-free", destination: "/online-word-search", permanent: true },
      { source: "/free-online-word-search", destination: "/online-word-search", permanent: true },
      { source: "/free-word-search-pdf", destination: "/word-search-pdf", permanent: true },
      { source: "/printable-word-search-pdf", destination: "/word-search-pdf", permanent: true },
      { source: "/word-search-worksheet", destination: "/word-search-worksheets", permanent: true },
      { source: "/free-large-print-word-search", destination: "/large-print-word-searches", permanent: true },
      { source: "/word-search-large-print-free", destination: "/large-print-word-searches", permanent: true }
    ];
  }
};

export default nextConfig;
