document.getElementById("export").addEventListener("click", () => {
  chrome.storage.local.get({ leads: [] }, (result) => {
    const leads = result.leads;
    if (leads.length === 0) {
      alert("No leads found!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `all-leads.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.set({ leads: [] }, () => {
    alert("All saved leads cleared.");
  });
});
