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

let raisedAmount = campaignConfig.currentRaised;

const formatCurrency = (value) =>
  `${campaignConfig.currency}${Math.round(value).toLocaleString("zh-TW")}`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateFunding() {
  const percent = clamp((raisedAmount / campaignConfig.fundingGoal) * 100, 0, 100);
  const remaining = Math.max(campaignConfig.fundingGoal - raisedAmount, 0);

  document.querySelector("#raised-amount").textContent = formatCurrency(raisedAmount);
  document.querySelector("#goal-amount").textContent = formatCurrency(campaignConfig.fundingGoal);
  document.querySelector("#remaining-amount").textContent =
    remaining > 0 ? `尚需 ${formatCurrency(remaining)}` : "募資目標已達成";
  document.querySelector("#progress-percent").textContent = `${percent.toFixed(1)}%`;
  document.querySelector("#progress-fill").style.width = `${percent}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", percent.toFixed(1));
}

function addPledge(amount) {
  raisedAmount += amount;
  updateFunding();

  const messages = [
    `收到 ${formatCurrency(amount)}。初質訊號上升，觀眾折痕正在擴散。`,
    `${formatCurrency(amount)} 已注入玄井計畫。下一支概念預告更接近成形。`,
    `支持完成：${formatCurrency(amount)}。這不是啟動引擎，是讓故事被看見。`,
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  document.querySelector("#pledge-message").textContent = message;
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
    <span>募資目標的 ${(campaignConfig.marketingBudgetRatio * 100).toFixed(0)}%：${formatCurrency(marketingTotal)}</span>
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
    return `行銷預算設定為募資目標的 ${(campaignConfig.marketingBudgetRatio * 100).toFixed(0)}%，目前規劃用於社群互動、概念預告、公關曝光、KOL合作、活動與數據測試。`;
  }

  if (normalized.includes("折疊") || normalized.includes("維度")) {
    return "折疊深度已接近 0.92。警告：空間不是容器，而是有回聲的結構。";
  }

  if (normalized.includes("啟動") || normalized.includes("支持")) {
    return "你的選擇已記錄。宣傳系統將把觀眾立場轉化為社群投票題：你會為了拯救文明啟動引擎嗎？";
  }

  return `已接收：「${input}」。玄井建議將這句話轉化為觀眾互動貼文，測試科技倫理與災難選擇的討論熱度。`;
}

function appendTerminalLine(speaker, text) {
  const log = document.querySelector("#terminal-log");
  const line = document.createElement("p");
  line.innerHTML = `<span>${speaker}</span>${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function initInteractions() {
  document.querySelectorAll("[data-pledge]").forEach((button) => {
    button.addEventListener("click", () => {
      addPledge(Number(button.dataset.pledge));
    });
  });

  document.querySelector("#custom-pledge-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#custom-pledge");
    const amount = Number(input.value);

    if (!Number.isFinite(amount) || amount < 100) {
      document.querySelector("#pledge-message").textContent = "請輸入至少 NT$100 的支持金額。";
      return;
    }

    addPledge(amount);
    input.value = "";
  });

  document.querySelector("#text-interface").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#audience-text");
    const value = input.value.trim();

    appendTerminalLine("觀眾", value || " ");
    appendTerminalLine("玄井", terminalReply(value));
    input.value = "";
  });
}

function initCanvas() {
  const canvas = document.querySelector("#fold-canvas");
  const context = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let foldLines = [];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    foldLines = Array.from({ length: 18 }, (_, index) => ({
      offset: (index / 17) * width,
      speed: 0.18 + (index % 5) * 0.045,
      tilt: -0.45 + (index % 7) * 0.12,
      phase: index * 0.7,
    }));
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    foldLines.forEach((line, index) => {
      const drift = Math.sin(time * 0.0004 + line.phase) * 38;
      const influence = (pointer.x - 0.5) * 70;
      const startX = ((line.offset + drift + influence + time * line.speed * 0.02) % (width + 220)) - 110;
      const gradient = context.createLinearGradient(startX, 0, startX + 220, height);
      gradient.addColorStop(0, "rgba(89,216,255,0)");
      gradient.addColorStop(0.48, index % 3 === 0 ? "rgba(124,255,200,0.34)" : "rgba(89,216,255,0.25)");
      gradient.addColorStop(1, "rgba(89,216,255,0)");

      context.strokeStyle = gradient;
      context.beginPath();
      context.moveTo(startX, 0);
      context.lineTo(startX + height * line.tilt + 120, height);
      context.stroke();
    });

    const centerX = width * (0.68 + (pointer.x - 0.5) * 0.06);
    const centerY = height * (0.38 + (pointer.y - 0.5) * 0.06);
    context.strokeStyle = "rgba(183,244,255,0.18)";
    context.lineWidth = 1;

    for (let size = 70; size < 420; size += 58) {
      const pulse = Math.sin(time * 0.001 + size) * 8;
      context.save();
      context.translate(centerX, centerY);
      context.rotate(time * 0.00008 + size * 0.002);
      context.strokeRect((-size - pulse) / 2, (-size - pulse) / 2, size + pulse, size + pulse);
      context.restore();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / Math.max(width, 1);
    pointer.y = event.clientY / Math.max(height, 1);
  });

  resize();
  requestAnimationFrame(draw);
}

updateFunding();
renderBudget();
initInteractions();
initCanvas();
