import Error from "next/error";

export default function NotFound() {
  // We do not record an exception in Sentry for 404.
  return <Error statusCode={404} />;
}
