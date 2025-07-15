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
  border: 2px solid #E1306C;        
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fafafa;        
  border-radius: 8px;
  font-family: Arial, sans-serif;
  color: #262626;                   
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
      color:black;
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

    // Target the footer navigation container
    const footerNav = document.querySelector("div._ab8b nav._ab8c");
    if (!footerNav) return;

    // As a more reliable approach, find the parent div that contains the footer
    const footerContainer = document.querySelector(
      "div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1e56ztr.x1pi30zi.x1swvt13.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1"
    );

    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    let boxToInsert = null;

    if (storedUser) {
      const user = JSON.parse(storedUser);
      boxToInsert = createUserBox(user, platform);
    } else {
      boxToInsert = createSyncBox();
    }

    // Insert the box after the footer container if found
    if (footerContainer) {
      // Create a wrapper div for better positioning
      const wrapperDiv = document.createElement("div");
      wrapperDiv.style.cssText = `
        margin-top: 15px;
        width: 100%;
        display: flex;
        justify-content: center;
      `;
      wrapperDiv.appendChild(boxToInsert);

      // Insert after the footer container
      footerContainer.after(wrapperDiv);
    } else if (footerNav) {
      // Fallback: insert after the footer navigation
      footerNav.after(boxToInsert);
    }
  }

  function observeFeedContainer() {
    const feedContainer = document.querySelector('main[role="main"]');

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

// Inject styles for the buttons
function injectStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
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
  `;
  document.head.appendChild(styleElement);
}

function addButtonsToPosts() {
  document.querySelectorAll("article").forEach((post) => {
    if (post.querySelector(".ig-custom-button-container")) return;

    // Find a better location - right after the action buttons
    const actionBar =
      post.querySelector("section:has(div[role='button'])") ||
      post.querySelector("section:has(span[role='button'])");

    if (!actionBar) return;

    // Create the container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "ig-custom-button-container";

    // Create AI comment button with icon + text
    const commentBtn = document.createElement("button");
    commentBtn.className = "ig-custom-button ig-comment-button";
    commentBtn.innerHTML = `💬 <span>AI Comment</span>`;
    commentBtn.onclick = () => generateAICommentForPost(post);

    // Create Repost button with icon + text

    // Add buttons to container
    buttonContainer.appendChild(commentBtn);

    // Insert after the action bar
    actionBar.insertAdjacentElement("afterend", buttonContainer);
  });
}

// Function to extract post details
function extractPostDetails(post) {
  // Extract the caption
  const captionElem = post.querySelector(
    "span._ap3a._aaco._aacu._aacx._aad7._aade"
  );
  const caption = captionElem ? captionElem.innerText : "";

  // Extract the image alt text
  const imgElem = post.querySelector("img[src*='instagram']");
  const imageAlt = imgElem
    ? imgElem.alt || imgElem.getAttribute("aria-label") || ""
    : "";

  // Extract hashtags from the caption
  let hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || [];

  // Look for hashtags in a possible "hashtag section" (Instagram sometimes places them separately)
  const hashtagSectionElem = post.querySelector("a[href*='/explore/tags/']");
  if (hashtagSectionElem) {
    const extraHashtags = [
      ...post.querySelectorAll("a[href*='/explore/tags/']"),
    ].map((a) => `#${a.innerText.trim()}`); // Extract hashtags correctly
    hashtags = [...new Set([...hashtags, ...extraHashtags])]; // Combine and remove duplicates
  }

  return {
    caption,
    imageAlt,
    hashtags: hashtags.join(", "), // Convert array to a string
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
  const commentBtn = post.querySelector(".ig-comment-button");
  const originalText = commentBtn.innerHTML;
  commentBtn.innerHTML = "⏳ Loading...";
  commentBtn.disabled = true;

  try {
    const { caption, imageAlt, hashtags } = extractPostDetails(post);

    // Create a styled dialog for selecting mood and length
    const dialog = document.createElement("div");
    dialog.style.cssText = `
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
    `;

    dialog.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 16px; color: #262626;">Select Comment Mood</h3>
      <select id="comment-mood" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
        <option value="engaging">Engaging</option>
        <option value="friendly">Friendly</option>
        <option value="eye-catchy">Eye Catchy</option>
        <option value="question">Question</option>
        <option value="funny">Funny</option>
        <option value="motivational">Motivational</option>
        <option value="romantic">Romantic</option>
        <option value="sarcastic">Sarcastic</option>
        <option value="inspiring">Inspiring</option>
      </select>
      
      <h3 style="margin-top: 15px; margin-bottom: 10px; color: #262626;">Select Comment Length</h3>
      <select id="comment-length" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
        <option value="60">60</option>
        <option value="100" selected>100</option>
        <option value="200">200</option>
        <option value="300">300</option>
        <option value="500">500</option>
      </select>

      <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
    <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;color:black;">
      <input type="checkbox" id="include-hashtags" style="appearance: none; width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 5px; display: inline-block; margin-right: 10px; position: relative; cursor: pointer; transition: all 0.2s ease-in-out;">
      Include Hashtags
    </label>
    <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;color:black;">
      <input type="checkbox" id="include-emojis" style="appearance: none; width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 5px; display: inline-block; margin-right: 10px; position: relative; cursor: pointer; transition: all 0.2s ease-in-out;">
      Include Emojis
    </label>
  </div>
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="generate-btn" style="background: #0095f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Generate</button>
        <button class="close-btn" style="background: #efefef; color: #262626; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
      </div>

      <style>
    /* Checkbox Active State */
    input[type="checkbox"]:checked {
      background-color: #0095f6;
      border-color: #0095f6;
      position: relative;
    }

    input[type="checkbox"]:checked::after {
      content: "✔";
      color: white;
      font-size: 14px;
      font-weight: bold;
      position: absolute;
      top: 1px;
      left: 4px;
    }

    /* Hover Effect */
    input[type="checkbox"]:hover {
      border-color: #0077cc;
    }

    .generate-btn:hover {
      background: #0077cc;
    }

    .close-btn:hover {
      background: #ddd;
    }
  </style>
    `;

    document.body.appendChild(dialog);

    // Add overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
    `;
    document.body.appendChild(overlay);

    function closeDialog() {
      dialog.remove();
      overlay.remove();
      commentBtn.innerHTML = originalText;
      commentBtn.disabled = false;
    }

    dialog.querySelector(".close-btn").addEventListener("click", closeDialog);
    overlay.addEventListener("click", closeDialog);

    dialog
      .querySelector(".generate-btn")
      .addEventListener("click", async () => {
        const selectedMood = document.getElementById("comment-mood").value;
        const selectedLength = parseInt(
          document.getElementById("comment-length").value,
          10
        );
        const includeHashtags =
          document.getElementById("include-hashtags").checked;
        const includeEmojis = document.getElementById("include-emojis").checked;
        dialog.innerHTML = `<p style="text-align:center;">⏳ Generating comment...</p>`;

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
  dialog.style.cssText = `
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
  `;

  dialog.innerHTML = `
    <h3 style="margin-top: 0; margin-bottom: 16px; color: #262626; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">AI Generated Comment</h3>
    <p style="margin-bottom: 20px; color: #262626; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${comment}</p>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
<button class="post-btn" style="background: white; color: #00c853; border: 1px solid #00c853; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-width: 80px; transition: all 0.2s ease;">Post</button>
      <button class="copy-btn" style="background: white; color: #0095f6; border: 1px solid #0095f6; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-width: 80px; transition: all 0.2s ease;">Copy</button>
      <button class="close-btn" style="background: white; color: #737373; border: 1px solid #dbdbdb; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-width: 80px; transition: all 0.2s ease;">Close</button>
    </div>
  `;

  document.body.appendChild(dialog);

  dialog.querySelectorAll("button").forEach((button) => {
    const originalBg = button.style.background;
    const originalColor = button.style.color;
    const borderColor =
      button.style.borderColor || button.style.border.split(" ")[2];

    button.addEventListener("mouseover", () => {
      if (button.classList.contains("post-btn")) {
        button.style.background = "#00c853";
        button.style.color = "white";
      } else if (button.classList.contains("copy-btn")) {
        button.style.background = "#0095f6";
        button.style.color = "white";
      } else if (button.classList.contains("close-btn")) {
        button.style.background = "#dbdbdb";
        button.style.color = "#262626";
      }
    });

    button.addEventListener("mouseout", () => {
      button.style.background = originalBg;
      button.style.color = originalColor;
    });
  });

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  // Close button
  dialog.querySelector(".close-btn").addEventListener("click", () => {
    dialog.remove();
    overlay.remove();
  });

  // Copy to clipboard button
  dialog.querySelector(".copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(comment);
    alert("Comment copied!");
  });

  // Post button (automatically fills and posts the comment)
  dialog.querySelector(".post-btn").addEventListener("click", () => {
    const commentBox = post.querySelector(
      'textarea[aria-label="Add a comment…"]'
    );

    if (commentBox) {
      commentBox.focus();
      commentBox.value = comment;
      // Create an input event to trigger Instagram's internal logic
      const inputEvent = new Event("input", { bubbles: true });
      commentBox.dispatchEvent(inputEvent);

      setTimeout(() => {
        // Look for the specific button with text "Post"
        const allButtons = post.querySelectorAll(
          'div[role="button"][tabindex="0"]'
        );
        let postButton = null;

        for (let button of allButtons) {
          if (button.textContent === "Post") {
            postButton = button;
            break;
          }
        }

        if (postButton) {
          postButton.click(); // Clicks the correct Post button
        } else {
          alert(
            "⚠️ Post button not found! Make sure you're on the comment section."
          );
        }
      }, 500);
    } else {
      alert("⚠️ Comment box not found! Open a post to comment.");
    }

    dialog.remove();
    overlay.remove();
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

// Continuously check for story updates and inject the repost button

// Initialize
function initialize() {
  injectStyles();
  addButtonsToPosts();
}

// Initialize immediately and set interval to catch new posts
initialize();
setInterval(addButtonsToPosts, 2000);
