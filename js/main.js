/* StudyAustralia 留学澳洲 官网交互：导航状态 / 移动菜单 / 滚动显现 / 年份
   约定：不用 window scroll 监听（性能），全部走 IntersectionObserver */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  /* 导航滚动态：页面顶部放一个哨兵，离开视口即加边框 */
  if (nav && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("scrolled", !entries[0].isIntersecting);
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
  var revealEls = document.querySelectorAll(".reveal");
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* 版权年份 */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
