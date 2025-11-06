export default async function handler(req, res) {
  const { dimension } = req.query;

  // ✅ Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: `Use POST instead of ${req.method}`,
    });
  }

  try {
    const { input, type } = req.body;

    // ✅ Basic validation
    if (!input) {
      return res.status(400).json({ error: "Missing input in request body" });
    }

    // ✅ Here you can add your real analysis logic later
    const analysisResult = {
      dimension,
      type,
      summary: `Analysis complete for ${dimension}`,
      example: input.slice(0, 100), // preview of user input
    };

    // ✅ Send success response
    return res.status(200).json({
      success: true,
      result: analysisResult,
    });
  } catch (error) {
    console.error("Error analyzing dimension:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
