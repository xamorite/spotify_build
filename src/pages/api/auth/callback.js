// src/pages/api/auth/callback.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies["spotify_auth_state"] : null;

  if (state === null || state !== storedState) {
    res.redirect("/login?error=state_mismatch");
    return;
  }

  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error("Token error:", data);
        res.redirect("/login?error=invalid_token");
        return;
    }

    // Set cookies with access and refresh tokens
    res.setHeader("Set-Cookie", [
      serialize("spotify_access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: data.expires_in,
      }),
      serialize("spotify_refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }),
    ]);

    res.redirect("/home");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Callback error:", error);
    res.redirect("/login?error=server_error");
  }
}
