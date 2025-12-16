// src/pages/api/auth/me.js
export default function handler(req, res) {
  const accessToken = req.cookies["spotify_access_token"];

  if (accessToken) {
    res.status(200).json({ isAuthenticated: true });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
}
