import fetch from "node-fetch";

export const sendWhatsAppMessage = async (req, res) => {
  const { appName, mobileNumber, templateName, languageCode, parameters } = req.body;

  const token = "EAANA2gDMWIkBOzhSNvZAcYSZCi2wUI1sZABdt57Dz3jjtr3buKqD6pQC3Ip534JjUXtIM2gtKOINBXPg8JYQctdI0aoI1xgpR6MfDEz0CtSNz8Iwlg1wWkGpaOBdLhtAsvrJ8qSlAGnzMTQ1r7HFjtzdtH7hjR8QkAsZBdKxAYJG0igVcbvgjJHPkbrgqV2niAZAETZAoaPEZBGZCtfXOyd5NOCus07q";
  const metaApiUrl = "https://graph.facebook.com/v19.0/314156511792263/messages";
  
  try {
    const requestBody = {
      messaging_product: appName,
      to: mobileNumber,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: [
          {
            type: "body",
            parameters: parameters.map(param => ({ type: "text", text: param })),
          },
        ],
      },
    };

    console.log("Attempting to send WhatsApp message with data:", requestBody);

    const response = await fetch(metaApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response);
    const responseData = await response.json();

    if (response.ok) {
      res.status(200).json({ message: "WhatsApp Message sent successfully by ohoh products private limited!" });
      console.log("WhatsApp Message sent successfully!");
    } else {
      res.status(response.status).json({ error: responseData.error.message || "Unknown error" });
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};
