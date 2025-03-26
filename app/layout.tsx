import type { Metadata } from "next";
import "../css/main.css";
import StoreProvider from "./_stores/StoreProvider";
import Script from "next/script";

const title = `Myoffice wowcns demo`;

const description =
  "WOWCNS Vietnam Co., Ltd. là công ty chuyên phát triển giải pháp chuyên nghiệp trong lĩnh vực Network Marketing Sales (MLM), có trụ sở chính tại Hàn Quốc. Công ty cung cấp hệ thống cho hơn 40% các công ty MLM tại Hàn Quốc và đã mở rộng hoạt động sang nhiều quốc gia như Mỹ, Nhật Bản, Đài Loan, Malaysia, Việt Nam, Philippines và Thái Lan. ​ITviec | Top IT Jobs for You Chi nhánh tại Việt Nam được thành lập vào tháng 7 năm 2019 với 100% vốn đầu tư từ Hàn Quốc. Ưu điểm nổi bật của WOWCNS là đội ngũ nhân viên tư vấn và phát triển chuyên nghiệp, bao gồm các quản lý và chuyên gia có kinh nghiệm trong ngành bán hàng tiếp thị mạng lưới. Công ty cam kết đáp ứng nhanh chóng và cung cấp các giải pháp phù hợp với nhu cầu luôn thay đổi của khách hàng.";

const url = "https://myofficedemoversion7.web.app";

const image = `https://myofficedemoversion7.web.app/img/logo.svg`;

const imageWidth = "1920";

const imageHeight = "960";

export const metadata: Metadata = {
  title,
  description,
  icons: "/img/logo.svg",
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: {
      url: image,
      width: imageWidth,
      height: imageHeight,
    },
  },
  openGraph: {
    url,
    title,
    images: {
      url: image,
      width: imageWidth,
      height: imageHeight,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className="style-basic">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-130795909-1"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-130795909-1');
          `}
        </Script>
        <body
          className={`bg-gray-50 dark:bg-slate-800 dark:text-slate-100 antialiased`}
        >
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
