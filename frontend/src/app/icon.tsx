import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Favicon size — Next.js will generate it at build time
export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

/**
 * Dynamic favicon generated from the logo PNG.
 * Centers the rectangular logo in a square canvas, preserving aspect ratio.
 */
export default async function Icon() {
  // Read logo from public directory
  const logoPath = join(process.cwd(), "public", "images", "logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoBase64}
        alt="logo"
        width={42}
        height={64}
        style={{
          objectFit: "contain",
        }}
      />
    </div>,
    { ...size },
  );
}
