/* StudyAustralia v4 · 系统即品牌
   岛式导航 / 全屏菜单 / blur-up 显现 / 案件引擎控制台动画
   约定：不用 window scroll 监听；动画只碰 transform/opacity/class */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 导航滚动态 */
  var nav = document.getElementById("nav");
  if (nav && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:90px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* 全屏玻璃菜单 */
  var toggle = document.getElementById("navtoggle");
  var menu = document.getElementById("menu");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
  }

  /* blur-up 显现 */
  var revealEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && revealEls.length && !reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* 版权年份 */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ============ 案件引擎控制台 ============ */
  var log = document.getElementById("clog");
  var bar = document.getElementById("cbar");
  var pct = document.getElementById("cpct");
  var stages = document.querySelectorAll(".console-stages .stage");
  if (!log) return;

  var SCRIPT = [
    { t: "09:02", k: "ok",  m: "护照信息页 · 完整性核查通过" },
    { t: "09:02", k: "ok",  m: "学历与成绩单 · 已入档并归位" },
    { t: "09:03", k: "ok",  m: "存款证明 · 覆盖学费与生活费" },
    { t: "09:05", k: "ok",  m: "GS 陈述 · 与材料一致性通过" },
    { t: "09:08", k: "run", m: "递交前终检 · 逐项核查中" },
    { t: "09:11", k: "ok",  m: "递交前终检 · 全部通过" },
    { t: "09:12", k: "run", m: "等待学生确认 · 以本人名义递交" }
  ];
  var PCTS = ["28%", "41%", "55%", "68%", "80%", "92%", "SYNC"];

  function renderLine(item, instant) {
    var line = document.createElement("div");
    line.className = "log-line" + (item.k === "run" ? " hot" : "");
    line.innerHTML =
      '<span class="t">' + item.t + "</span>" +
      '<span class="' + item.k + '">' + (item.k === "ok" ? "✓" : "▸") + "</span>" +
      '<span class="msg">' + item.m + "</span>";
    log.appendChild(line);
    if (instant) { line.classList.add("show"); }
    else { requestAnimationFrame(function () { requestAnimationFrame(function () { line.classList.add("show"); }); }); }
    return line;
  }

  /* reduced-motion：静态渲染全部行，不循环 */
  if (reduced) {
    SCRIPT.forEach(function (item) { renderLine(item, true); });
    if (bar) bar.style.transform = "scaleX(0.92)";
    if (pct) pct.textContent = "92%";
    return;
  }

  var i = 0;
  var caret = document.createElement("span");
  caret.className = "caret";

  function step() {
    if (i < SCRIPT.length) {
      if (caret.parentNode) caret.parentNode.removeChild(caret);
      var line = renderLine(SCRIPT[i], false);
      line.appendChild(caret);
      if (bar) bar.style.transform = "scaleX(" + (0.15 + (i / SCRIPT.length) * 0.8) + ")";
      if (pct) pct.textContent = PCTS[i] || "SYNC";
      /* 第 6 行后阶段翻转：材料 done，递交 now */
      if (i === 5 && stages.length >= 4) {
        stages[2].classList.remove("now"); stages[2].classList.add("done");
        stages[3].classList.add("now");
      }
      i += 1;
      setTimeout(step, i === SCRIPT.length ? 3200 : 950 + Math.floor(i * 40));
    } else {
      /* 循环重置 */
      i = 0;
      log.innerHTML = "";
      if (stages.length >= 4) {
        stages[2].classList.remove("done"); stages[2].classList.add("now");
        stages[3].classList.remove("now");
      }
      if (bar) bar.style.transform = "scaleX(0.1)";
      if (pct) pct.textContent = "SYNC";
      setTimeout(step, 700);
    }
  }
  if (bar) bar.style.transform = "scaleX(0.1)";
  setTimeout(step, 900);
})();
