function extractAndStoreLead() {
  setTimeout(() => {
    try {
      const nameEl = document.querySelector('h1[data-x--lead--name]');
      const designationEl = document.querySelector('span[data-anonymize="job-title"]');
      const companyEl = document.querySelector('span[data-anonymize="company-name"]');

      const fullName = nameEl ? nameEl.textContent.trim() : "N/A";
      const [firstName, ...rest] = fullName.split(" ");
      const lastName = rest.join(" ") || "N/A";
      const designation = designationEl ? designationEl.textContent.trim() : "N/A";
      const company = companyEl ? companyEl.textContent.trim() : "N/A";

      // 🔍 Try to get LinkedIn profile link
      let profileLink = "N/A";
      const allLinks = document.querySelectorAll("a[href*='linkedin.com/in/']");
      for (const a of allLinks) {
        const href = a.getAttribute("href");
        if (href && href.includes("linkedin.com/in/")) {
          profileLink = href.startsWith("http") ? href : `https://www.linkedin.com${href}`;
          break;
        }
      }

      const newEntry = {
        "First Name": firstName,
        "Last Name": lastName,
        "Company": company,
        "Designation": designation,
        "Profile URL": profileLink
      };

      chrome.storage.local.get({ leads: [] }, (result) => {
        const updatedLeads = [...result.leads, newEntry];
        chrome.storage.local.set({ leads: updatedLeads }, () => {
          console.log("✅ Lead saved:", newEntry);
        });
      });

    } catch (err) {
      console.error("❌ Error storing lead:", err);
    }
  }, 3000);
}

extractAndStoreLead();
