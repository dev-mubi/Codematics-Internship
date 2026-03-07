const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client using the project's public anon key.
// getUser() validates the JWT against Supabase directly, so it works with
// both HS256 legacy and ECC P-256 new signing keys automatically.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Let Supabase verify the JWT — works with all signing algorithms
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // The Supabase user ID (uuid) becomes the identifier for all data
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
