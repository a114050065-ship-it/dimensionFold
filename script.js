const campaignConfig = {
  fundingGoal: 12000000,
  currentRaised: 4850000,
  currency: "NT$",
  marketingBudgetRatio: 0.18,
  marketingBudgetAllocation: [
    { label: "社群內容與互動擴散", ratio: 28 },
    { label: "概念預告與視覺特效測試素材", ratio: 24 },
    { label: "媒體公關與影展提案曝光", ratio: 18 },
    { label: "KOL / 科普與電影頻道合作", ratio: 14 },
    { label: "實體活動與沉浸式文本體驗", ratio: 10 },
    { label: "數據追蹤、廣告測試與再行銷", ratio: 6 },
  ],
};

const formatCurrency = (value) =>
  `${campaignConfig.currency}${Math.round(value).toLocaleString("zh-TW")}`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateFunding() {
  const percent = clamp((campaignConfig.currentRaised / campaignConfig.fundingGoal) * 100, 0, 100);
  const remaining = Math.max(campaignConfig.fundingGoal - campaignConfig.currentRaised, 0);

  document.querySelector("#raised-amount").textContent = formatCurrency(campaignConfig.currentRaised);
  document.querySelector("#goal-amount").textContent = formatCurrency(campaignConfig.fundingGoal);
  document.querySelector("#remaining-amount").textContent =
    remaining > 0 ? `尚需 ${formatCurrency(remaining)}` : "籌資目標已達成";
  document.querySelector("#progress-percent").textContent = `${percent.toFixed(1)}%`;
  document.querySelector("#progress-fill").style.width = `${percent}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", percent.toFixed(1));
}

function renderBudget() {
  const list = document.querySelector("#budget-list");
  const marketingTotal = campaignConfig.fundingGoal * campaignConfig.marketingBudgetRatio;
  const allocationTotal = campaignConfig.marketingBudgetAllocation.reduce(
    (sum, item) => sum + item.ratio,
    0,
  );

  const summary = document.createElement("div");
  summary.className = "budget-item";
  summary.style.setProperty("--budget-width", "100%");
  summary.innerHTML = `
    <strong>行銷總預算</strong>
    <span>籌資目標的 ${(campaignConfig.marketingBudgetRatio * 100).toFixed(0)}%：${formatCurrency(marketingTotal)}</span>
  `;
  list.appendChild(summary);

  campaignConfig.marketingBudgetAllocation.forEach((item) => {
    const amount = marketingTotal * (item.ratio / 100);
    const row = document.createElement("div");
    row.className = "budget-item";
    row.style.setProperty("--budget-width", `${item.ratio}%`);
    row.innerHTML = `
      <strong>${item.label}</strong>
      <span>${item.ratio}% / ${formatCurrency(amount)}</span>
    `;
    list.appendChild(row);
  });

  const check = document.createElement("div");
  check.className = "budget-item";
  check.style.setProperty("--budget-width", `${allocationTotal}%`);
  check.innerHTML = `
    <strong>比例檢核</strong>
    <span>${allocationTotal}%</span>
  `;
  list.appendChild(check);
}

function terminalReply(input) {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return "訊號為空。請輸入一個判斷，或嘗試關鍵字：初質、阿迦、白祈、預算、折疊。";
  }

  if (normalized.includes("初質")) {
    return "初質不是被創造的物質，而是從高維折痕中被迫凝結的存在。它美麗，也有債。";
  }

  if (normalized.includes("阿迦")) {
    return "阿迦回應：你們稱之為能源，我們稱之為傷口。請重新定義進步。";
  }

  if (normalized.includes("白祈")) {
    return "白祈座標仍有殘響：如果我回去，那座島也會回來嗎？";
  }

  if (normalized.includes("預算") || normalized.includes("行銷")) {
    return `行銷預算設定為籌資目標的 ${(campaignConfig.marketingBudgetRatio * 100).toFixed(0)}%，目前規劃用於社群互動、概念預告、公關曝光、KOL合作、活動與數據測試。`;
  }

  if (normalized.includes("贊助") || normalized.includes("支持") || normalized.includes("付款") || normalized.includes("登入")) {
    return "目前網站僅顯示電影製作籌資進度。若要開放支持或贊助，需要另外建立會員登入、付款金流、交易紀錄與收據通知系統。";
  }

  if (normalized.includes("折疊") || normalized.includes("維度")) {
