import {ReactNode} from 'react';
import "./globals.css";

type Props = {
  children: ReactNode;
};

// Since users will be redirected to `[locale]` pages, this layout is just a placeholder
export default function RootLayout({children}: Props) {
  return children;
}
