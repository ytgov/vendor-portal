import sanitizeHtml from "sanitize-html"

export function sanitize(html: string): string {
  const options: sanitizeHtml.IOptions = {
    allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "li", "ol", "p", "a", "br", "span", "strong"],
    nonBooleanAttributes: ["class"],
    allowedAttributes: {
      a: ["href"],
    },
    allowedClasses: {
      "*": ["mb-3", "mb-2", "mb-1"],
    },
    allowedSchemes: ["https", "mailto"],
  }

  return sanitizeHtml(html, options)
}
