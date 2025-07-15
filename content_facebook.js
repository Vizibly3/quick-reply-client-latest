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

const COOKIE_NAME = "social_sync_user";
const COOKIE_EXPIRY_DAYS = 60;

function saveUserData(userData) {
  console.log("Saving user data:", userData);
  const cookieSuccess = setCookie(COOKIE_NAME, userData, COOKIE_EXPIRY_DAYS);
  const fallbackSuccess = setFallbackStorage(userData);

  return cookieSuccess || fallbackSuccess;
}

function getUserData() {
  const cookieData = getCookie(COOKIE_NAME);
  if (cookieData) {
    console.log("Retrieved user data from cookie");
    return cookieData;
  }

  const fallbackData = getFallbackStorage();
  if (fallbackData) {
    console.log("Retrieved user data from fallback storage");
    // Re-save to cookies
    setCookie(COOKIE_NAME, fallbackData, COOKIE_EXPIRY_DAYS);
    return fallbackData;
  }

  console.log("No user data found in any storage");
  return null;
}

function setCookie(name, value, days) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    const valueStr = JSON.stringify(value);

    // Set cookie with domain-level and secure attributes
    document.cookie =
      name +
      "=" +
      encodeURIComponent(valueStr) +
      ";" +
      expires +
      ";path=/;SameSite=Lax";

    // Debug log
    console.log(
      "Cookie set:",
      name,
      "Value:",
      valueStr.substring(0, 50) + "..."
    );

    // Verify cookie was set
    setTimeout(() => {
      const retrieved = getCookie(name);
      console.log("Cookie verification:", retrieved ? "Success" : "Failed");
    }, 100);

    return true;
  } catch (e) {
    console.error("Error setting cookie:", e);
    return false;
  }
}

function getCookie(name) {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    // Debug log
    console.log("All cookies:", document.cookie);
    console.log("Looking for cookie:", name);

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) {
        const rawValue = c.substring(nameEQ.length);
        const decodedValue = decodeURIComponent(rawValue);
        const parsedValue = JSON.parse(decodedValue);

        console.log(
          "Found cookie:",
          name,
          "Raw value length:",
          rawValue.length
        );
        return parsedValue;
      }
    }

    console.log("Cookie not found:", name);
    return null;
  } catch (e) {
    console.error("Error reading cookie:", e);
    return null;
  }
}

// Fallback storage mechanism using SessionStorage and DOM storage
const storageKey = "_fallback_user_data";

function setFallbackStorage(data) {
  try {
    // Try sessionStorage first
    if (window.sessionStorage) {
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    }

    // Also store in a hidden div as last resort
    let storageDiv = document.getElementById("social-sync-storage");
    if (!storageDiv) {
      storageDiv = document.createElement("div");
      storageDiv.id = "social-sync-storage";
      storageDiv.style.display = "none";
      document.body.appendChild(storageDiv);
    }
    storageDiv.setAttribute("data-user", JSON.stringify(data));

    return true;
  } catch (e) {
    console.error("Error in fallback storage:", e);
    return false;
  }
}

function getFallbackStorage() {
  try {
    // Try sessionStorage first
    if (window.sessionStorage) {
      const data = sessionStorage.getItem(storageKey);
      if (data) return JSON.parse(data);
    }

    // Try hidden div as last resort
    const storageDiv = document.getElementById("social-sync-storage");
    if (storageDiv) {
      const dataAttr = storageDiv.getAttribute("data-user");
      if (dataAttr) return JSON.parse(dataAttr);
    }

    return null;
  } catch (e) {
    console.error("Error in fallback storage retrieval:", e);
    return null;
  }
}

(async function () {
  const SYNC_BOX_CLASS = "sync-account-box";
  const USER_BOX_CLASS = "user-info-box";
  const WRAPPER_CLASS = "custom-extension-wrapper";
  const TARGET_LINK_SELECTOR =
    "a.x1i10hfl[href^='https://www.facebook.com/profile.php']";
  const COOKIE_NAME = "social_sync_user";
  const COOKIE_EXPIRY_DAYS = 60;

  let observer;
  let checkInterval;
  let lastUserState = null;

  // Improved cookie utility functions
  function setCookie(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toUTCString();
      const valueStr = JSON.stringify(value);

      // Set cookie with domain-level and secure attributes
      document.cookie =
        name +
        "=" +
        encodeURIComponent(valueStr) +
        ";" +
        expires +
        ";path=/;SameSite=Lax";

      // Debug log
      // console.log(
      //   "Cookie set:",
      //   name,
      //   "Value:",
      //   valueStr.substring(0, 50) + "..."
      // );

      // Verify cookie was set
      setTimeout(() => {
        const retrieved = getCookie(name);
        console.log("Cookie verification:", retrieved ? "Success" : "Failed");
      }, 100);

      return true;
    } catch (e) {
      console.error("Error setting cookie:", e);
      return false;
    }
  }

  function getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");

      // Debug log
      //console.log("All cookies:", document.cookie);
      //console.log("Looking for cookie:", name);

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) {
          const rawValue = c.substring(nameEQ.length);
          const decodedValue = decodeURIComponent(rawValue);
          const parsedValue = JSON.parse(decodedValue);

          // console.log(
          //   "Found cookie:",
          //   name,
          //   "Raw value length:",
          //   rawValue.length
          // );
          return parsedValue;
        }
      }

      console.log("Cookie not found:", name);
      return null;
    } catch (e) {
      console.error("Error reading cookie:", e);
      return null;
    }
  }

  // Fallback storage mechanism using SessionStorage and DOM storage
  const storageKey = "_fallback_user_data";

  function setFallbackStorage(data) {
    try {
      // Try sessionStorage first
      if (window.sessionStorage) {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
      }

      // Also store in a hidden div as last resort
      let storageDiv = document.getElementById("social-sync-storage");
      if (!storageDiv) {
        storageDiv = document.createElement("div");
        storageDiv.id = "social-sync-storage";
        storageDiv.style.display = "none";
        document.body.appendChild(storageDiv);
      }
      storageDiv.setAttribute("data-user", JSON.stringify(data));

      return true;
    } catch (e) {
      console.error("Error in fallback storage:", e);
      return false;
    }
  }

  function getFallbackStorage() {
    try {
      // Try sessionStorage first
      if (window.sessionStorage) {
        const data = sessionStorage.getItem(storageKey);
        if (data) return JSON.parse(data);
      }

      // Try hidden div as last resort
      const storageDiv = document.getElementById("social-sync-storage");
      if (storageDiv) {
        const dataAttr = storageDiv.getAttribute("data-user");
        if (dataAttr) return JSON.parse(dataAttr);
      }

      return null;
    } catch (e) {
      console.error("Error in fallback storage retrieval:", e);
      return null;
    }
  }

  // Combined storage handler
  function saveUserData(userData) {
    console.log("Saving user data:", userData);
    const cookieSuccess = setCookie(COOKIE_NAME, userData, COOKIE_EXPIRY_DAYS);
    const fallbackSuccess = setFallbackStorage(userData);

    return cookieSuccess || fallbackSuccess;
  }

  function getUserData() {
    const cookieData = getCookie(COOKIE_NAME);
    if (cookieData) {
      //console.log("Retrieved user data from cookie");
      return cookieData;
    }

    const fallbackData = getFallbackStorage();
    if (fallbackData) {
      //console.log("Retrieved user data from fallback storage");
      // Re-save to cookies
      setCookie(COOKIE_NAME, fallbackData, COOKIE_EXPIRY_DAYS);
      return fallbackData;
    }

    console.log("No user data found in any storage");
    return null;
  }

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
      margin-bottom: 15px;
      background-color: #fafafa;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      color: #262626;
      width: 100%;
      box-sizing: border-box;
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
      padding: 12px;
      margin-bottom: 15px;
      background-color: #f5f5f5;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      width: 100%;
      box-sizing: border-box;
    `;

    const heading = document.createElement("h3");
    heading.textContent = "Sync Your Account";
    heading.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #0073b1;
    `;

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.gap = "10px";
    form.style.alignItems = "center";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Enter your email";
    emailInput.required = true;
    emailInput.style.cssText = `
      color: black;
      flex-grow: 1;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    `;

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.style.cssText = `
      background-color: #0073b1;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
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

              // Store user data
              const userData = verifyData.user || {
                email,
                credits: { [platform]: 0 },
                isPremium: false,
              };

              if (saveUserData(userData)) {
                console.log("User data saved successfully");
              } else {
                console.error("Failed to save user data");
              }

              location.reload();
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

  async function insertContainer() {
    const profileLink = document.querySelector(TARGET_LINK_SELECTOR);
    if (!profileLink) return;

    // Get user data using our combined storage approach
    const storedUser = getUserData();
    const currentUser = storedUser ? JSON.stringify(storedUser) : null;
    const userChanged = currentUser !== lastUserState;
    lastUserState = currentUser;

    //console.log("User data retrieved:", storedUser ? "Found" : "Not found");

    // Remove existing container if user state changed
    if (userChanged) {
      const oldWrapper = document.querySelector(`.${WRAPPER_CLASS}`);
      if (oldWrapper) oldWrapper.remove();
    }

    // Check if already inserted
    const existingWrapper =
      profileLink.previousElementSibling?.classList?.contains(WRAPPER_CLASS);
    if (existingWrapper && !userChanged) return;

    // Create new container
    const platform = detectPlatformFromURL();
    const box = storedUser
      ? createUserBox(storedUser, platform)
      : createSyncBox();

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    wrapper.style.cssText = `
      width: 100%;
      margin-bottom: 15px;
    `;
    wrapper.appendChild(box);

    // Insert before profile link
    profileLink.parentNode.insertBefore(wrapper, profileLink);
  }

  function startObservation() {
    // Initial try
    insertContainer();

    // MutationObserver for DOM changes
    observer = new MutationObserver(() => {
      insertContainer();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    // Backup interval check
    checkInterval = setInterval(() => {
      insertContainer();
    }, 1000);
  }

  function cleanup() {
    if (observer) observer.disconnect();
    if (checkInterval) clearInterval(checkInterval);
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      startObservation();
    });
  } else {
    startObservation();
  }

  // Reinitialize on navigation
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      cleanup();
      startObservation();
    }
  });
  urlObserver.observe(document, { subtree: true, childList: true });

  // Cleanup when script is removed
  window.addEventListener("beforeunload", cleanup);
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
  document
    .querySelectorAll(
      "div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd"
    )
    .forEach((post) => {
      if (post.querySelector(".fb-custom-button-container")) return;

      const actionBar = post.querySelector("div.xq8finb.x16n37ib");
      if (!actionBar) return;

      // Create container
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "fb-custom-button-container";
      buttonContainer.style.marginTop = "10px";
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "flex-start";

      // Create AI Comment button
      const commentBtn = document.createElement("button");
      commentBtn.className = "fb-custom-button fb-comment-button";
      commentBtn.innerHTML = `💬 <span>AI Comment</span>`;

      // Facebook-like styling
      Object.assign(commentBtn.style, {
        backgroundColor: "#1877F2",
        color: "#fff",
        padding: "6px 12px",
        border: "none",
        borderRadius: "18px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "background-color 0.2s",
      });

      commentBtn.onmouseover = () => {
        commentBtn.style.backgroundColor = "#165cdb";
      };
      commentBtn.onmouseout = () => {
        commentBtn.style.backgroundColor = "#1877F2";
      };

      commentBtn.onclick = () => generateAICommentForPost(post);

      // Append button to container
      buttonContainer.appendChild(commentBtn);

      // Insert the button container AFTER the action bar
      actionBar.insertAdjacentElement("afterend", buttonContainer);
    });
}

// Function to extract post details
function extractPostDetails(post) {
  let caption = "";

  // 1. Get all parts of the caption (before + after "See more")
  const captionNodes = post.querySelectorAll(
    'div[data-ad-preview="message"] span[dir="auto"], div.xu06os2.x1ok221b span[dir="auto"]'
  );

  captionNodes.forEach((node) => {
    const text = node.textContent.trim();
    if (text && !/^[. ]+$/.test(text)) {
      caption += text + " ";
    }
  });

  caption = caption.trim();

  console.log("caption", caption);

  // 2. Target the correct image by exact class match
  const imgElem = post.querySelector(
    "img.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1ey2m1c.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3.xl1xv1r"
  );

  let imageAlt = "";
  if (imgElem) {
    imageAlt = imgElem.alt.trim();
  }

  console.log("alt", imageAlt);

  // 3. Extract hashtags from caption text
  const hashtagRegex = /#\w[\w\d]*/g;
  const hashtags = [...new Set(caption.match(hashtagRegex) || [])];

  console.log("hashtag", hashtags);

  return {
    caption,
    imageAlt,
    hashtags: hashtags.join(", "),
  };
}

// Function to generate AI comment
async function generateAICommentForPost(post) {
  const user = getUserData();
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
  const commentBtn = post.querySelector(".fb-comment-button");
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
      'span[data-ad-rendering-role="comment_button"]'
    );

    if (commentButton) {
      commentButton.click();
      console.log("✅ Comment button clicked");
    } else {
      alert("⚠️ Comment button not found!");
      return;
    }

    // Poll for the comment box using consistent attributes
    let maxAttempts = 25;
    const interval = setInterval(() => {
      const commentBox = document.querySelector(
        'div[contenteditable="true"][data-lexical-editor="true"][role="textbox"]'
      );

      if (commentBox) {
        clearInterval(interval);

        // Focus and insert comment
        commentBox.focus();
        document.execCommand("selectAll", false, null);
        document.execCommand("delete", false, null);
        document.execCommand("insertText", false, comment);

        commentBox.dispatchEvent(new Event("input", { bubbles: true }));

        const inputEvent = new Event("input", { bubbles: true });
        commentBox.dispatchEvent(inputEvent);

        // Click Send button
        setTimeout(() => {
          const sendButton = document.querySelector(
            'div[role="button"][aria-label="Comment"]'
          );

          if (sendButton) {
            sendButton.click();
            console.log("✅ Comment posted!");
          } else {
            alert("⚠️ Send button not found!");
          }

          dialog.remove();
          overlay.remove();
        }, 700);
      } else {
        if (--maxAttempts <= 0) {
          clearInterval(interval);
          alert("⚠️ Comment box not found after waiting!");
        }
      }
    }, 200);
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
  const user = getUserData();
  if (!user) return;

  if (!user.credits) user.credits = {};
  if (!user.credits[platform]) user.credits[platform] = 0;

  user.credits[platform] += 1;
  saveUserData(user);
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
