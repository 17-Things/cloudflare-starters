// Small extras for the page. The page works without this file.
// You do not need to change anything here: the opening hours come from
// the hours table in index.html.

(function () {
  "use strict";

  // ---------------------------------------------------------------
  // 1. "Open now" badge and today's row in the hours table
  // ---------------------------------------------------------------
  var table = document.querySelector("[data-hours]");
  var badge = document.querySelector("[data-open-badge]");

  function toMinutes(hhmm) {
    if (!hhmm) return null;
    var parts = hhmm.split(":");
    return Number(parts[0]) * 60 + Number(parts[1] || 0);
  }

  // 7.30am, 4pm, 12.15pm
  function niceTime(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var suffix = h >= 12 ? "pm" : "am";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? "." + String(m).padStart(2, "0") : "") + suffix;
  }

  function nowIn(timeZone) {
    // Returns { day: 1-7 (Monday is 1), mins: minutes since midnight }
    var parts = {};
    try {
      new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var d = new Date();
      return { day: d.getDay() || 7, mins: d.getHours() * 60 + d.getMinutes() };
    }
    var days = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    return { day: days[parts.weekday], mins: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  if (table) {
    var rows = {};
    table.querySelectorAll("tr[data-day]").forEach(function (tr) {
      rows[tr.getAttribute("data-day")] = {
        el: tr,
        name: tr.querySelector("th").textContent.trim(),
        open: toMinutes(tr.getAttribute("data-open")),
        close: toMinutes(tr.getAttribute("data-close"))
      };
    });

    var now = nowIn(table.getAttribute("data-timezone") || "Europe/London");
    var today = rows[now.day];
    if (today) today.el.classList.add("is-today");

    if (badge && today) {
      var text, state;
      if (today.open !== null && now.mins >= today.open && now.mins < today.close) {
        state = "open";
        text = "Open now · closes " + niceTime(today.close);
      } else if (today.open !== null && now.mins < today.open) {
        state = "closed";
        text = "Closed now · opens " + niceTime(today.open) + " today";
      } else {
        state = "closed";
        text = "Closed now";
        for (var i = 1; i <= 7; i++) {
          var dayNum = ((now.day - 1 + i) % 7) + 1;
          var next = rows[dayNum];
          if (next && next.open !== null) {
            text += " · opens " + niceTime(next.open) + " " + (i === 1 ? "tomorrow" : next.name);
            break;
          }
        }
      }
      badge.textContent = text;
      badge.setAttribute("data-state", state);
    }
  }

  // ---------------------------------------------------------------
  // 2. Gallery photo viewer, using the built-in <dialog> element
  // ---------------------------------------------------------------
  var viewer = document.querySelector(".viewer");
  if (viewer && typeof viewer.showModal === "function") {
    var big = viewer.querySelector("img");
    var caption = viewer.querySelector("figcaption");
    var lastLink = null;

    document.querySelectorAll(".gallery-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        var thumb = link.querySelector("img");
        var fig = link.closest("figure");
        var cap = fig && fig.querySelector("figcaption");
        big.src = link.getAttribute("href");
        big.alt = thumb ? thumb.alt : "";
        if (thumb) {
          big.width = thumb.getAttribute("width");
          big.height = thumb.getAttribute("height");
        }
        caption.textContent = cap ? cap.textContent : "";
        lastLink = link;
        viewer.showModal();
      });
    });

    viewer.querySelector(".viewer-close").addEventListener("click", function () { viewer.close(); });
    // Click on the dark area outside the photo to close.
    viewer.addEventListener("click", function (event) {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener("close", function () {
      if (lastLink) lastLink.focus();
    });
  }
})();
