import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const svgDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiPjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjciIGZpbGw9IiM0RTcyNTEiLz48cGF0aCBkPSJNMTYgNkMxNiA2IDggMTEgOCAxOEM4IDIyLjQgMTEuNiAyNiAxNiAyNkMyMC40IDI2IDI0IDIyLjQgMjQgMThDMjQgMTEgMTYgNiAxNiA2WiIgZmlsbD0iI0VERThEQyIvPjxwYXRoIGQ9Ik0xNiAxM1YyNCIgc3Ryb2tlPSIjNEU3MjUxIiBzdHJva2Utd2lkdGg9IjEuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTE2IDE2TDEyLjUgMTkiIHN0cm9rZT0iIzRFNzI1MSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTYgMTkuNUwxMi41IDIyIiBzdHJva2U9IiM0RTcyNTEiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTE2IDE2TDE5LjUgMTkiIHN0cm9rZT0iIzRFNzI1MSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTYgMTkuNUwxOS41IDIyIiBzdHJva2U9IiM0RTcyNTEiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+";

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={svgDataUrl} width={180} height={180} alt="" />
    ),
    { ...size }
  );
}
