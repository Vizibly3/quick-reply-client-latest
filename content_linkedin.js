// Remove any unload event handlers that could trigger policy violations
window.onunload = null;
window.onbeforeunload = null;

function detectPlatformFromURL() {
  const hostname = window.location.hostname;

  if (hostname.includes("linkedin.com")) return "linkedin";
  if (hostname.includes("instagram.com")) return "instagram";
  if (hostname.includes("facebook.com")) return "facebook";
  return null;
}

(function () {
  const SYNC_BOX_CLASS = "sync-account-box";
  const USER_BOX_CLASS = "user-info-box";

  function detectPlatformFromURL() {
    const host = window.location.hostname;
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook")) return "facebook";
    return null;
  }

  function createUserBox(user, platform) {
    const container = document.createElement("div");
    container.className = USER_BOX_CLASS;
    container.style.cssText = `
      border: 2px solid #28a745;
      padding: 12px;
      margin-bottom: 10px;
      background-color: #e9f7ef;
      border-radius: 8px;
      font-family: Arial, sans-serif;
    `;

    const emailEl = document.createElement("p");
    emailEl.innerHTML = `<strong>Email:</strong> ${user.email}`;

    const totalCredits = 75;
    const usedCredits = user.credits?.[platform] || 0;
    const leftCredits = totalCredits - usedCredits;

    const creditEl = document.createElement("p");
    creditEl.innerHTML = `<strong>Total Credits:</strong> ${totalCredits}<br><strong>Credits Left:</strong> ${leftCredits}`;

    const premiumEl = document.createElement("p");
    premiumEl.innerHTML = `<strong>Premium:</strong> ${
      user.isPremium ? "Yes 🏆" : "No"
    }`;

    container.appendChild(emailEl);
    container.appendChild(creditEl);
    container.appendChild(premiumEl);

    return container;
  }

  function createSyncBox() {
    const container = document.createElement("div");
    container.className = SYNC_BOX_CLASS;
    container.style.cssText = `
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      border-radius: 6px;
      font-family: Arial, sans-serif;
    `;

    const heading = document.createElement("h3");
    heading.textContent = "Sync Your Account";
    heading.style.cssText = `
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #0073b1;
    `;

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.gap = "8px";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Enter your email";
    emailInput.required = true;
    emailInput.style.cssText = `
      flex-grow: 1;
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    `;

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.style.cssText = `
      background-color: #0073b1;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
    `;

    form.appendChild(emailInput);
    form.appendChild(submitBtn);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const platform = detectPlatformFromURL();

      if (!email || !platform) {
        alert("Missing email or unsupported platform");
        return;
      }

      try {
        const res = await fetch(
          "https://jatinonline.com/quickreply/api/auth/request-otp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        const data = await res.json();
        alert(data.message);

        function createOtpDialog() {
          // Create overlay
          const overlay = document.createElement("div");
          overlay.style.position = "fixed";
          overlay.style.top = "0";
          overlay.style.left = "0";
          overlay.style.width = "100%";
          overlay.style.height = "100%";
          overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          overlay.style.zIndex = "10000";
          overlay.style.display = "flex";
          overlay.style.justifyContent = "center";
          overlay.style.alignItems = "center";

          // Create dialog
          const dialog = document.createElement("div");
          dialog.style.backgroundColor = "white";
          dialog.style.padding = "20px";
          dialog.style.borderRadius = "8px";
          dialog.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
          dialog.style.width = "300px";
          dialog.style.textAlign = "center";

          // Title
          const title = document.createElement("h3");
          title.textContent = "Enter OTP";
          title.style.marginTop = "0";

          // Input field
          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Enter the OTP sent to your email";
          input.style.width = "100%";
          input.style.padding = "8px";
          input.style.marginBottom = "15px";
          input.style.marginTop = "15px";
          input.style.boxSizing = "border-box";

          // Button container
          const btnContainer = document.createElement("div");
          btnContainer.style.display = "flex";
          btnContainer.style.justifyContent = "space-between";

          // Submit button
          const submitBtn = document.createElement("button");
          submitBtn.textContent = "Submit";
          submitBtn.style.padding = "8px 16px";
          submitBtn.style.backgroundColor = "#4285f4";
          submitBtn.style.color = "white";
          submitBtn.style.border = "none";
          submitBtn.style.borderRadius = "4px";
          submitBtn.style.cursor = "pointer";

          // Cancel button
          const cancelBtn = document.createElement("button");
          cancelBtn.textContent = "Cancel";
          cancelBtn.style.padding = "8px 16px";
          cancelBtn.style.backgroundColor = "#f1f1f1";
          cancelBtn.style.border = "none";
          cancelBtn.style.borderRadius = "4px";
          cancelBtn.style.cursor = "pointer";

          // Add elements to dialog
          dialog.appendChild(title);
          dialog.appendChild(input);
          btnContainer.appendChild(cancelBtn);
          btnContainer.appendChild(submitBtn);
          dialog.appendChild(btnContainer);
          overlay.appendChild(dialog);

          // Add to body
          document.body.appendChild(overlay);

          // Focus on input
          setTimeout(() => input.focus(), 100);

          // Return a promise that resolves with the OTP
          return new Promise((resolve, reject) => {
            submitBtn.addEventListener("click", () => {
              const value = input.value.trim();
              if (value) {
                document.body.removeChild(overlay);
                resolve(value);
              } else {
                input.style.borderColor = "red";
              }
            });

            cancelBtn.addEventListener("click", () => {
              document.body.removeChild(overlay);
              reject("User cancelled");
            });

            // Handle enter key
            input.addEventListener("keypress", (e) => {
              if (e.key === "Enter") {
                submitBtn.click();
              }
            });
          });
        }

        if (res.ok) {
          try {
            // Use the custom dialog instead of prompt
            const otp = await createOtpDialog();
            if (!otp) return;

            const verifyRes = await fetch(
              "https://jatinonline.com/quickreply/api/auth/verify-otp",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, platform }),
              }
            );

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert("✅ Email verified successfully!");
              localStorage.setItem("user", JSON.stringify(verifyData.user));
              location.reload(); // Refresh to re-trigger UI update
            } else {
              alert("❌ OTP verification failed.");
            }
          } catch (error) {
            console.log("OTP input cancelled or failed:", error);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });

    container.appendChild(heading);
    container.appendChild(form);

    return container;
  }

  function isOnFeedPage() {
    return location.pathname === "/feed/" || location.pathname === "/";
  }

  function insertBoxIfMissing() {
    if (!isOnFeedPage()) return;

    const platform = detectPlatformFromURL();
    if (!platform) return;

    // If box already exists, skip
    if (
      document.querySelector(`.${SYNC_BOX_CLASS}`) ||
      document.querySelector(`.${USER_BOX_CLASS}`)
    )
      return;

    const profileCardBackground = document.querySelector(
      ".profile-card-background-image"
    );
    if (!profileCardBackground) return;

    let parentAnchor = null;
    let currentElement = profileCardBackground;

    while (currentElement && !parentAnchor) {
      if (currentElement.tagName === "A") {
        parentAnchor = currentElement;
      }
      currentElement = currentElement.parentElement;
    }

    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    let boxToInsert = null;

    if (storedUser) {
      const user = JSON.parse(storedUser);
      boxToInsert = createUserBox(user, platform);
    } else {
      boxToInsert = createSyncBox();
    }

    if (parentAnchor) {
      parentAnchor.parentNode.insertBefore(boxToInsert, parentAnchor);
    } else {
      profileCardBackground.parentNode.insertBefore(
        boxToInsert,
        profileCardBackground
      );
    }
  }

  function observeFeedContainer() {
    const feedContainer = document.querySelector(
      ".scaffold-finite-scroll__content"
    );

    if (!feedContainer) {
      setTimeout(observeFeedContainer, 1000);
      return;
    }

    const observer = new MutationObserver(() => {
      if (isOnFeedPage()) {
        insertBoxIfMissing();
      }
    });

    observer.observe(feedContainer, { childList: true, subtree: true });
  }

  function listenToUrlChanges() {
    let lastUrl = location.href;

    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (isOnFeedPage()) {
          insertBoxIfMissing();
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  insertBoxIfMissing();
  observeFeedContainer();
  listenToUrlChanges();
})();

function injectStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    /* Instagram button styles */
    .ig-custom-button-container {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 0 16px;
    }
    
    .ig-custom-button {
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .ig-custom-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .ig-custom-button span {
      margin-left: 6px;
    }
    
    /* LinkedIn button styles */
    .li-custom-button {
      padding: 8px 12px;
      border: 1px solid #0073b1;
      border-radius: 20px;
      background-color: #0073b1;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s ease;
    }
    
    .li-custom-button:hover {
      background-color: #005582;
    }
    
    /* Dialog styles */
    .ai-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      width: 80%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    .ai-dialog h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #262626;
    }
    
    .ai-dialog p {
      margin-bottom: 20px;
      color: #262626;
      line-height: 1.5;
    }
    
    .ai-dialog select {
      width: 100%;
      height: 42px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin-bottom: 15px;
      color: #262626;
      font-size: 14px;
      text-overflow: ellipsis;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat;
      background-position: right 12px top 50%;
      background-size: 12px auto;
      padding-right: 30px;
      line-height: 1.4;
    }
    
    .ai-dialog select::-ms-expand {
      display: none;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      color: #262626;
    }
    
    .checkbox-container input[type="checkbox"] {
      display: none;
    }
    
    .custom-checkbox {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      border: 2px solid #ccc;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .checkmark {
      font-size: 14px;
      color: white;
      display: none;
      position: absolute;
      font-weight: bold;
    }
    
    .ai-dialog-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .generate-btn {
      background: #0095f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .close-btn {
      background: #efefef;
      color: #262626;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
    }
    
    .checkbox-options {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    /* Comment result dialog buttons */
    .comment-result-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .comment-result-buttons button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-width: 80px;
      transition: all 0.2s ease;
      background: white;
    }
    
    .post-btn {
      color: #00c853;
      border: 1px solid #00c853;
    }
    
    .post-btn:hover {
      background: #00c853;
      color: white;
    }
    
    .copy-btn {
      color: #0095f6;
      border: 1px solid #0095f6;
    }
    
    .copy-btn:hover {
      background: #0095f6;
      color: white;
    }
    
    .comment-close-btn {
      color: #737373;
      border: 1px solid #dbdbdb;
    }
    
    .comment-close-btn:hover {
      background: #dbdbdb;
      color: #262626;
    }
  `;
  document.head.appendChild(styleElement);
}

function addButtonsToPosts() {
  document.querySelectorAll("div.fie-impression-container").forEach((post) => {
    if (post.querySelector(".li-custom-button-container")) return;

    // Find the control menu to insert after it
    const actionBar = post.querySelector(".feed-shared-social-action-bar");
    if (!actionBar) return;

    // Create the container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "li-custom-button-container";

    // Create AI comment button
    const commentBtn = document.createElement("button");
    commentBtn.className = "li-custom-button";
    commentBtn.innerHTML = `💬 <span>AI Comment</span>`;
    commentBtn.onclick = () => generateAICommentForPost(post);

    // Append button to container
    buttonContainer.appendChild(commentBtn);

    actionBar.insertAdjacentElement("afterend", buttonContainer);
  });
}

// Function to extract post details
function extractPostDetails(post) {
  const captionElem = post.querySelector(
    ".update-components-text .break-words span[dir='ltr']"
  );

  // Fallback if the specific selector doesn't work
  const captionElemFallback = post.querySelector(
    ".feed-shared-update-v2__description span[dir='ltr']"
  );

  // Use the first one that exists
  const captionElement = captionElem || captionElemFallback;

  let caption = "";

  if (captionElement) {
    // Get the HTML content
    const html = captionElement.innerHTML;

    // Match all text between <!---->TEXT<!---->
    const regex = /<!---->([^<]+?)(?=<!----)|<!---->([^<]+?)(?=<)/g;
    let match;
    let captionParts = [];

    // Extract all parts of the caption
    while ((match = regex.exec(html)) !== null) {
      const captionPart = match[1] || match[2];
      if (captionPart && captionPart.trim()) {
        captionParts.push(captionPart.trim());
      }
    }

    // Join all parts with spaces
    caption = captionParts.join(" ");
  }

  // Extract the image alt text
  const imgElem = post.querySelector("img[src*='media.licdn.com']");
  let imageAlt = imgElem ? imgElem.alt : ""; // Use alt text or fallback to an empty string
  if (!imageAlt && imgElem) {
    imageAlt = imgElem.src.split("/").pop().replace(/-/g, " "); // Fallback to using the image filename (you could enhance this)
  }

  // Extract hashtags from the caption
  let hashtags = [];
  const hashtagElems = post.querySelectorAll(
    "a[href*='/search/results/all/?keywords=%23']"
  );
  hashtagElems.forEach((hashtagElem) => {
    const hashtagText = hashtagElem.innerText.trim();
    if (hashtagText && !hashtags.includes(hashtagText)) {
      hashtags.push(`#${hashtagText}`);
    }
  });

  return {
    caption,
    imageAlt,
    hashtags: hashtags.join(", "), // Convert array to a string of hashtags
  };
}

// Function to generate AI comment
async function generateAICommentForPost(post) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.email) {
    alert("⚠️ Please sync your account to use AI comments.");
    return;
  }

  const platform = detectPlatformFromURL();

  const isPremium = user?.premium;
  const credits = user?.credits?.[platform] || 0;

  if (!isPremium && credits >= 75) {
    alert(
      "🚫 You've reached the free limit. Please upgrade to premium to continue using this feature."
    );
    return;
  }

  // Show loading state
  const commentBtn = post.querySelector(".li-custom-button");
  const originalText = commentBtn.innerHTML;
  commentBtn.innerHTML = "⏳ Loading...";
  commentBtn.disabled = true;

  try {
    const { caption, imageAlt, hashtags } = extractPostDetails(post);

    // Create dialog using DOM methods instead of innerHTML to avoid sanitization issues
    const dialog = document.createElement("div");
    dialog.className = "ai-dialog";

    // Create mood selection header
    const moodHeader = document.createElement("h3");
    moodHeader.textContent = "Select Comment Mood";
    dialog.appendChild(moodHeader);

    // Create mood selection dropdown
    const moodSelect = document.createElement("select");
    moodSelect.id = "comment-mood";

    const moodOptions = [
      { value: "engaging", text: "Engaging" },
      { value: "friendly", text: "Friendly" },
      { value: "eye-catchy", text: "Eye Catchy" },
      { value: "question", text: "Question" },
      { value: "funny", text: "Funny" },
      { value: "motivational", text: "Motivational" },
      { value: "romantic", text: "Romantic" },
      { value: "sarcastic", text: "Sarcastic" },
      { value: "inspiring", text: "Inspiring" },
    ];

    moodOptions.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      moodSelect.appendChild(option);
    });

    dialog.appendChild(moodSelect);

    // Create comment length header
    const lengthHeader = document.createElement("h3");
    lengthHeader.textContent = "Select Comment Length";
    dialog.appendChild(lengthHeader);

    // Create length selection dropdown
    const lengthSelect = document.createElement("select");
    lengthSelect.id = "comment-length";

    const lengthOptions = [
      { value: "60", text: "60" },
      { value: "100", text: "100", selected: true },
      { value: "200", text: "200" },
      { value: "300", text: "300" },
      { value: "500", text: "500" },
    ];

    lengthOptions.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      if (opt.selected) option.selected = true;
      lengthSelect.appendChild(option);
    });

    dialog.appendChild(lengthSelect);

    // Create checkbox options container
    const checkboxOptions = document.createElement("div");
    checkboxOptions.className = "checkbox-options";

    // Create hashtags checkbox
    const hashtagsLabel = document.createElement("label");
    hashtagsLabel.className = "checkbox-container";

    const hashtagsCheckbox = document.createElement("input");
    hashtagsCheckbox.type = "checkbox";
    hashtagsCheckbox.id = "include-hashtags";
    hashtagsCheckbox.checked = false; // Initialize as unchecked

    const hashtagsCustomCheckbox = document.createElement("div");
    hashtagsCustomCheckbox.className = "custom-checkbox";

    // Apply initial style based on checked state
    hashtagsCustomCheckbox.style.backgroundColor = "transparent";
    hashtagsCustomCheckbox.style.borderColor = "#ccc";

    const hashtagsCheckmark = document.createElement("div");
    hashtagsCheckmark.className = "checkmark";
    hashtagsCheckmark.textContent = "✓";
    // Initially hide the checkmark
    hashtagsCheckmark.style.display = "none";

    hashtagsCustomCheckbox.appendChild(hashtagsCheckmark);

    const hashtagsText = document.createTextNode("Include Hashtags");

    hashtagsLabel.appendChild(hashtagsCheckbox);
    hashtagsLabel.appendChild(hashtagsCustomCheckbox);
    hashtagsLabel.appendChild(hashtagsText);

    // Create emojis checkbox
    const emojisLabel = document.createElement("label");
    emojisLabel.className = "checkbox-container";

    const emojisCheckbox = document.createElement("input");
    emojisCheckbox.type = "checkbox";
    emojisCheckbox.id = "include-emojis";
    emojisCheckbox.checked = false; // Initialize as unchecked

    const emojisCustomCheckbox = document.createElement("div");
    emojisCustomCheckbox.className = "custom-checkbox";

    // Apply initial style based on checked state
    emojisCustomCheckbox.style.backgroundColor = "transparent";
    emojisCustomCheckbox.style.borderColor = "#ccc";

    const emojisCheckmark = document.createElement("div");
    emojisCheckmark.className = "checkmark";
    emojisCheckmark.textContent = "✓";
    // Initially hide the checkmark
    emojisCheckmark.style.display = "none";

    emojisCustomCheckbox.appendChild(emojisCheckmark);

    const emojisText = document.createTextNode("Include Emojis");

    emojisLabel.appendChild(emojisCheckbox);
    emojisLabel.appendChild(emojisCustomCheckbox);
    emojisLabel.appendChild(emojisText);

    // Add checkboxes to container
    checkboxOptions.appendChild(hashtagsLabel);
    checkboxOptions.appendChild(emojisLabel);
    dialog.appendChild(checkboxOptions);

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "ai-dialog-buttons";

    // Create generate button
    const generateBtn = document.createElement("button");
    generateBtn.className = "generate-btn";
    generateBtn.textContent = "Generate";

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "Close";

    // Add buttons to container
    buttonsContainer.appendChild(generateBtn);
    buttonsContainer.appendChild(closeBtn);
    dialog.appendChild(buttonsContainer);

    document.body.appendChild(dialog);

    // Add overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    // Function to update checkbox visual state
    function updateCheckboxVisual(checkbox, customCheckbox, checkmark) {
      if (checkbox.checked) {
        customCheckbox.style.backgroundColor = "#0095f6";
        customCheckbox.style.borderColor = "#0095f6";
        checkmark.style.display = "block";
      } else {
        customCheckbox.style.backgroundColor = "transparent";
        customCheckbox.style.borderColor = "#ccc";
        checkmark.style.display = "none";
      }
    }

    // Simple direct handlers for hashtags checkbox
    hashtagsLabel.addEventListener("click", function (e) {
      // Prevent default handling to avoid conflicts
      e.preventDefault();
      // Toggle the checkbox state
      hashtagsCheckbox.checked = !hashtagsCheckbox.checked;
      // Update visuals directly
      if (hashtagsCheckbox.checked) {
        hashtagsCustomCheckbox.style.backgroundColor = "#0095f6";
        hashtagsCustomCheckbox.style.borderColor = "#0095f6";
        hashtagsCheckmark.style.display = "block";
      } else {
        hashtagsCustomCheckbox.style.backgroundColor = "transparent";
        hashtagsCustomCheckbox.style.borderColor = "#ccc";
        hashtagsCheckmark.style.display = "none";
      }
    });

    // Simple direct handlers for emojis checkbox
    emojisLabel.addEventListener("click", function (e) {
      // Prevent default handling to avoid conflicts
      e.preventDefault();
      // Toggle the checkbox state
      emojisCheckbox.checked = !emojisCheckbox.checked;
      // Update visuals directly
      if (emojisCheckbox.checked) {
        emojisCustomCheckbox.style.backgroundColor = "#0095f6";
        emojisCustomCheckbox.style.borderColor = "#0095f6";
        emojisCheckmark.style.display = "block";
      } else {
        emojisCustomCheckbox.style.backgroundColor = "transparent";
        emojisCustomCheckbox.style.borderColor = "#ccc";
        emojisCheckmark.style.display = "none";
      }
    });

    function closeDialog() {
      dialog.remove();
      overlay.remove();
      commentBtn.innerHTML = originalText;
      commentBtn.disabled = false;
    }

    closeBtn.addEventListener("click", closeDialog);
    overlay.addEventListener("click", closeDialog);

    generateBtn.addEventListener("click", async () => {
      const selectedMood = document.getElementById("comment-mood").value;
      const selectedLength = parseInt(
        document.getElementById("comment-length").value,
        10
      );
      const includeHashtags =
        document.getElementById("include-hashtags").checked;
      const includeEmojis = document.getElementById("include-emojis").checked;

      // Clear dialog content and show loading
      while (dialog.firstChild) {
        dialog.removeChild(dialog.firstChild);
      }

      const loadingText = document.createElement("p");
      loadingText.textContent = "⏳ Generating comment...";
      loadingText.style.textAlign = "center";
      dialog.appendChild(loadingText);

      try {
        const aiComment = await fetchAIComment(
          caption,
          imageAlt,
          hashtags,
          selectedMood,
          selectedLength,
          includeHashtags,
          includeEmojis,
          isPremium,
          user,
          platform
        );
        closeDialog();
        showGeneratedComment(aiComment, post);
      } catch (error) {
        alert("Error generating comment. Please try again.");
        closeDialog();
      }
    });
  } catch (error) {
    console.error("Error generating comment:", error);
    alert("Sorry, couldn't generate a comment. Please try again.");
  } finally {
    commentBtn.innerHTML = originalText;
    commentBtn.disabled = false;
  }
}

// Function to display the generated AI comment
function showGeneratedComment(comment, post) {
  const dialog = document.createElement("div");
  dialog.className = "ai-dialog";

  // Create title element
  const title = document.createElement("h3");
  title.textContent = "AI Generated Comment";
  dialog.appendChild(title);

  // Create comment paragraph
  const commentPara = document.createElement("p");
  commentPara.textContent = comment;
  dialog.appendChild(commentPara);

  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "comment-result-buttons";

  // Create Post button
  const postBtn = document.createElement("button");
  postBtn.className = "post-btn";
  postBtn.textContent = "Post";

  // Create Copy button
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Copy";

  // Create Close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "comment-close-btn close-btn";
  closeBtn.textContent = "Close";

  // Append buttons to container
  buttonsContainer.appendChild(postBtn);
  buttonsContainer.appendChild(copyBtn);
  buttonsContainer.appendChild(closeBtn);

  // Append buttons container to dialog
  dialog.appendChild(buttonsContainer);

  document.body.appendChild(dialog);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  // Close button
  closeBtn.addEventListener("click", () => {
    dialog.remove();
    overlay.remove();
  });

  // Copy to clipboard button
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(comment);
    alert("Comment copied!");
  });

  // Post button (automatically fills and posts the comment)
  postBtn.addEventListener("click", () => {
    const commentButton = post.querySelector(
      'button[aria-label="Comment"].artdeco-button--tertiary'
    );

    if (commentButton) {
      commentButton.click();
      console.log("Comment button clicked");
    } else {
      alert("⚠️ Comment button not found!");
    }
    setTimeout(() => {
      const postContainer = commentButton.closest(".feed-shared-update-v2"); // use actual class if different

      // Now find the comment box within this post
      const commentBox = postContainer?.querySelector(
        'div.ql-editor[contenteditable="true"][aria-placeholder="Add a comment…"]'
      );

      if (commentBox) {
        commentBox.focus();
        commentBox.innerText = comment;

        const inputEvent = new Event("input", { bubbles: true });
        commentBox.dispatchEvent(inputEvent);

        setTimeout(() => {
          const postCommentButton = document.querySelector(
            "button.comments-comment-box__submit-button--cr"
          );

          if (postCommentButton) {
            postCommentButton.click();
            console.log("✅ Comment posted!");
          } else {
            alert("⚠️ Comment 'Post' button not found!");
          }
        }, 500);
      } else {
        alert("⚠️ Comment box not found! Open a post to comment.");
      }

      dialog.remove();
      overlay.remove();
    }, 1500); // 1.5 second delay
  });

  overlay.addEventListener("click", () => {
    dialog.remove();
    overlay.remove();
  });
}

// Function to call Hugging Face API
async function fetchAIComment(
  caption,
  imageAlt,
  hashtags,
  mood,
  length,
  includeHashtags,
  includeEmojis,
  isPremium,
  user,
  platform
) {
  try {
    // First check if chrome.runtime is available
    if (
      typeof chrome === "undefined" ||
      typeof chrome.runtime === "undefined"
    ) {
      console.error("❌ Chrome runtime not available");

      // Fall back to direct fetch if chrome.runtime is not available
      const res = await fetch(
        "https://jatinonline.com/quickreply/proxy/generate-comment", // Changed from localhost URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caption,
            imageAlt,
            hashtags,
            mood,
            length,
            includeHashtags,
            includeEmojis,
          }),
        }
      );

      const data = await res.json();
      return data.comment;
    }

    // If chrome.runtime is available, use message passing
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(
          {
            action: "fetchAIComment",
            data: {
              caption,
              imageAlt,
              hashtags,
              mood,
              length,
              includeHashtags,
              includeEmojis,
            },
          },
          async (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "❌ Chrome runtime error:",
                chrome.runtime.lastError
              );
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }

            if (!response) {
              console.error("❌ No response received from background script");
              reject(new Error("No response from background script"));
              return;
            }

            if (response.error) {
              console.error("❌ AI Comment Error:", response.error);
              reject(new Error(response.error));
            } else {
              if (!isPremium) {
                await incrementUserCredit(user.email, platform); // server
                incrementLocalCredit(platform); // local
              }
              resolve(response.data.comment);
            }
          }
        );
      } catch (err) {
        console.error("❌ Message sending error:", err);
        reject(err);
      }
    });
  } catch (error) {
    console.error("❌ AI Comment Error:", error);
    return "Error generating comment. Please try again with a shorter length.";
  }
}

function incrementLocalCredit(platform) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  if (!user.credits) user.credits = {};
  if (!user.credits[platform]) user.credits[platform] = 0;

  user.credits[platform] += 1;
  localStorage.setItem("user", JSON.stringify(user));
}

async function incrementUserCredit(email, platform) {
  try {
    await fetch(
      "https://jatinonline.com/quickreply/api/user/increment-credit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, platform }),
      }
    );
  } catch (err) {
    console.error("❌ Failed to increment user credit in DB:", err);
  }
}

// Initialize
function initialize() {
  injectStyles();
  addButtonsToPosts();
}

// Initialize immediately and set interval to catch new posts
initialize();
setInterval(addButtonsToPosts, 2000);
