import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react";
import { iconMap, iconSizeMap, type IconName, type IconSize } from "./icon-map";

export type { IconName, IconSize };

type IconWeight = NonNullable<PhosphorIconProps["weight"]>;

export interface IconProps {
  name: IconName;
  size?: IconSize | number;
  weight?: IconWeight;
  color?: string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  size = "md",
  weight = "regular",
  color = "currentColor",
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const Component = iconMap[name];
  const pixelSize = typeof size === "number" ? size : iconSizeMap[size];

  return (
    <Component
      size={pixelSize}
      weight={weight}
      color={color}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden && !ariaLabel}
    />
  );
}
