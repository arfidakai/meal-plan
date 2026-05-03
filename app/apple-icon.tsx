import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#4E7251",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#EDE8DC",
            fontFamily: "Georgia, serif",
            letterSpacing: -2,
          }}
        >
          CE
        </div>
      </div>
    ),
    { ...size }
  );
}
