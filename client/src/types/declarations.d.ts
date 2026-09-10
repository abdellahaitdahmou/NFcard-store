declare module "lucide-react" {
  import * as React from "react";
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  export type LucideIcon = React.FC<IconProps>;
  export const [key: string]: any;
  const content: any;
  export default content;
}

declare module "canvas-confetti" {
  const confetti: any;
  export default confetti;
}

declare module "qrcode.react" {
  import * as React from "react";
  export const QRCodeSVG: React.FC<any>;
  export const QRCodeCanvas: React.FC<any>;
}
