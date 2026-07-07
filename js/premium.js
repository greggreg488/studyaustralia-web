/* StudyAustralia 留学澳洲 · 高端版交互
   约定：不用 window scroll 监听；导航态与滚动显现全部走 IntersectionObserver */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navtoggle");
  var links = document.getElementById("navlinks");

  /* 导航：离开页面顶部 → 实心浅色（.solid）；回到 hero 顶部 → 透明深色 */
  if (nav && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("solid", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* 移动菜单 */
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 滚动显现（reduced-motion 由 CSS 兜底为常显） */
  var revealEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* 版权年份 */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
