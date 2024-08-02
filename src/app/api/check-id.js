import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const fileBuffer = req.body.file;
      console.log(fileBuffer);

      function convertToBase64(buffer) {
        return buffer.toString("base64");
      }

      const base64Image = convertToBase64(Buffer.from(fileBuffer, "base64"));
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Extract all information from the image and return them in this same exact format in JSON with no other comments please.\n
                ALWAYS RETURN ONLY this JSON OBJECT PLEASE (key:value)\n
                RESPONSE IS ONLY LIKE THIS EXACTLY PLS DONT ADD ANYTHING AT ALL.\n
                For example:
                {
                  "Surname": "Surname",
                  "GivenName": "GivenName",
                  "DateOfBirth": "DateOfBirth",
                  "Nationality": "Nationality",
                  "DocumentNumber": "DocumentNumber",
                  "DateOfIssue": "DateOfIssue",
                  "DateOfExpiry": "DateOfExpiry",
                  "Sex": "Sex"
                  "other fields.." :"other values"
                }
                don't return keys with empty value
              `,
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                    detail: "low",
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          },
        }
      );

      const generatedContent = response.data.choices[0].message.content;

      res.status(200).json({
        generatedContent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
