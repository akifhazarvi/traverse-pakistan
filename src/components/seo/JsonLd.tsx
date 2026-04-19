import type { FC } from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export const JsonLd: FC<JsonLdProps> = ({ data, id }) => {
  const json = JSON.stringify(data, (_, value) =>
    value === undefined ? undefined : value
  ).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
