import React from "react";
import justboilLogoPath from "./logoPath";
import Image from "next/image";

type Props = {
  className?: string;
};
export default function JustboilLogo({ className = "" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="100"
      viewBox="0 0 250 100"
      className={className}
    >
      <path fill="currentColor" d={justboilLogoPath} />
    </svg>
  );
}

// WowcnsLogo sử dụng next/image đúng cách
export function WowcnsLogo({ className = "" }: Props) {
  return (
    <Image   // Truyền nguyên hàm
    src="/img/logo.svg" 
      width={30} 
      height={30} 
      alt="Wowcns Logo" 
      className={className} 
    />
  );
}
