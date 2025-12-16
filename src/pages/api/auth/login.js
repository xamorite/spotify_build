// src/pages/api/auth/login.js
import { serialize } from "cookie";

const SPOTIFY_SCOPE = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
].join(" ");

export default function handler(req, res) {
  const state = Math.random().toString(36).substring(7);
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  // Create state cookie for security
  res.setHeader(
    "Set-Cookie",
    serialize("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600,
    })
  );

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPE,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
