chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchAIComment") {
    fetch("https://jatinonline.com/quickreply/api/linkedin/generate-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Background script sending response:", data);
        sendResponse({ data });
      })
      .catch((error) => {
        console.error("Background script fetch error:", error);
        sendResponse({ error: error.message || "Network error" });
      });

    // Required to use sendResponse asynchronously
    return true;
  }
});
