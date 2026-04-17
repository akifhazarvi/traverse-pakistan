import type { FC } from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

/**
 * Renders a JSON-LD <script> tag inside the DOM stream (not the <head>).
 * This is the Next.js 15+ App Router recommended pattern — script tags
 * inside the component tree are hoisted to <head> by React when they
 * carry a `type` and no side effects.
 *
 * Usage: <JsonLd data={tourSchema(tour)} id="tour-jsonld" />
 */
export const JsonLd: FC<JsonLdProps> = ({ data, id }) => {
  const json = JSON.stringify(data, (_, value) =>
    value === undefined ? undefined : value
  );
  return (
    <script
      type="application/ld+json"
      id={id}
      // JSON.stringify produces safe HTML already; escape closing script just in case.
      dangerouslySetInnerHTML={{
        __html: json.replace(/</g, "\\u003c"),
      }}
    />
  );
};
