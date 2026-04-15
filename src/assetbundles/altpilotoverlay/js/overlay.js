(function () {
	"use strict";

	var RESOLVE_URL = "/actions/altpilot/overlay/resolve-images";
	var RESCAN_DEBOUNCE_MS = 200;

	var WARN_ICON = "\u26A0";
	var SEARCH_ICON = "\uD83D\uDD0D";
	var DARK_GREEN = "#0f5132";

	var state = {
		activeImg: null,
		scrollTicking: false,
		altPilotBaseUrl: "",
		btnPosition: "top-right",
		overlayEl: null,
		txtEl: null,
		btnEl: null,
		pageSearchOverlay: null,
		pageSearchBtn: null,
		uiReady: false,
		authenticated: null,
		rescanTimer: null,
	};

	// ── Scanning ───────────────────────────────────────────────

	function scan() {
		var images = collectImages();
		if (images.length === 0) {
			return;
		}
		resolveImages(images);
	}

	function collectImages() {
		var imgs = document.querySelectorAll(
			'img:not([data-cp-processed="true"])',
		);
		var result = [];
		var seen = {};

		for (var i = 0; i < imgs.length; i++) {
			var img = imgs[i];
			var src = getEffectiveSrc(img);
			if (!src) continue;

			var alt = img.getAttribute("alt") || "";
			var key = src + "::" + alt;

			if (!seen[key]) {
				seen[key] = true;
				result.push({ src: src, alt: alt, elements: [img] });
			} else {
				for (var j = 0; j < result.length; j++) {
					if (result[j].src === src && result[j].alt === alt) {
						result[j].elements.push(img);
						break;
					}
				}
			}
		}

		return result;
	}

	function getEffectiveSrc(img) {
		var dataSrc = img.getAttribute("data-src");
		var cls = img.getAttribute("class") || "";

		if (dataSrc && /(?:^|\s)lazyload(?:\s|$)/.test(cls)) {
			return dataSrc;
		}

		return img.currentSrc || img.src || img.getAttribute("src") || "";
	}

	// ── API ────────────────────────────────────────────────────

	function resolveImages(images) {
		if (state.authenticated === false) return;

		var payload = [];
		for (var i = 0; i < images.length; i++) {
			payload.push({ src: images[i].src, alt: images[i].alt });
		}

		fetch(RESOLVE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			credentials: "same-origin",
			body: JSON.stringify({ images: payload }),
		})
			.then(function (res) {
				if (!res.ok) {
					state.authenticated = false;
					return null;
				}
				return res.json();
			})
			.then(function (data) {
				if (!data || !data.authenticated) {
					state.authenticated = false;
					return;
				}
				state.authenticated = true;
				applyOverlay(data, images);
			})
			.catch(function () {});
	}

	// ── Stamping ───────────────────────────────────────────────

	function applyOverlay(data, images) {
		state.altPilotBaseUrl = data.cpUrl || "";
		state.btnPosition = data.btnPosition || "top-right";

		var resolved = data.images || [];
		var bySrc = {};
		for (var i = 0; i < resolved.length; i++) {
			bySrc[resolved[i].src] = resolved[i];
		}

		for (var j = 0; j < images.length; j++) {
			var match = bySrc[images[j].src];
			if (!match) continue;

			var altText = match.alt || images[j].alt || "";

			for (var k = 0; k < images[j].elements.length; k++) {
				var el = images[j].elements[k];
				el.setAttribute("data-cp-processed", "true");
				el.setAttribute("data-cp-edit-url", match.url || "");
				el.setAttribute("data-cp-edit-type", match.type || "search");
				el.setAttribute("data-cp-alt-text", altText);
				if (match.assetId) {
					el.setAttribute("data-cp-asset-id", String(match.assetId));
				}
				if (match.searchFilename) {
					el.setAttribute(
						"data-cp-search-filename",
						match.searchFilename,
					);
				}
			}
		}

		ensureUI();
	}

	// ── UI ──────────────────────────────────────────

	function ensureUI() {
		if (state.uiReady) return;
		state.uiReady = true;

		injectStyles();
		createElements();
		bindEvents();
	}

	function createElements() {
		var posStyle = getPositionStyle();

		var pageSearch = document.createElement("div");
		pageSearch.id = "craft-altpilot-page-search-overlay";
		pageSearch.setAttribute("style", posStyle);

		var pageBtn = document.createElement("a");
		pageBtn.id = "craft-altpilot-page-search-btn";
		pageBtn.href = "#";
		pageBtn.innerHTML =
			'<svg id="craft-altpilot-page-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 114" fill="none" aria-hidden="true" focusable="false">' +
			'<path d="M10 2.5H24.7686C27.0149 2.50001 29.1428 3.50726 30.5674 5.24414L107.664 99.2441C111.679 104.14 108.196 111.5 101.865 111.5H10C5.85787 111.5 2.5 108.142 2.5 104V10C2.5 5.85787 5.85787 2.5 10 2.5Z" fill="currentColor" stroke="currentColor" stroke-width="5"/>' +
			"</svg>" +
			"<span>review current page</span>";

		pageSearch.appendChild(pageBtn);
		document.body.appendChild(pageSearch);

		requestAnimationFrame(function () {
			pageSearch.style.opacity = "1";
		});

		var overlay = document.createElement("div");
		overlay.id = "craft-altpilot-overlay";

		var inner = document.createElement("div");
		var txt = document.createElement("span");
		txt.id = "craft-altpilot-text-display";

		var editBtn = document.createElement("a");
		editBtn.id = "craft-altpilot-edit-btn";
		editBtn.href = "#";
		editBtn.target = "_blank";
		editBtn.textContent = "Edit";

		inner.appendChild(txt);
		inner.appendChild(editBtn);
		overlay.appendChild(inner);
		document.body.appendChild(overlay);

		state.overlayEl = overlay;
		state.txtEl = txt;
		state.btnEl = editBtn;
		state.pageSearchOverlay = pageSearch;
		state.pageSearchBtn = pageBtn;
	}

	function getPositionStyle() {
		switch (state.btnPosition) {
			case "top-left":
				return "top:20px;left:20px;";
			case "top-right":
				return "top:20px;right:20px;";
			case "bottom-left":
				return "bottom:20px;left:20px;";
			default:
				return "bottom:20px;right:20px;";
		}
	}

	function injectStyles() {
		if (document.getElementById("craft-altpilot-overlay-styles")) return;

		var css =
			"#craft-altpilot-page-search-overlay{display:block;position:fixed;z-index:2147483646;pointer-events:auto;opacity:0;transition:opacity .4s ease}" +
			"#craft-altpilot-page-search-btn{background:#8FF5B3;color:#0f5132;text-decoration:none;padding:6px 12px;border-radius:999px;border:1px solid #0f5132;font-weight:500;font-size:16px;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 6px 18px rgba(15,81,50,.18);transition:background-color 150ms ease,color 150ms ease,border-color 150ms ease,box-shadow 150ms ease}" +
			"#craft-altpilot-page-search-btn:hover{background:#ddfce8}" +
			"#craft-altpilot-page-search-icon{width:16px;height:16px;display:block;flex:0 0 auto}" +
			"#craft-altpilot-overlay{display:none;position:fixed;z-index:2147483647;pointer-events:none}" +
			"#craft-altpilot-overlay>div{background:#fff;color:#0f5132;padding-left:8px;border-radius:999px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 20px rgba(15,81,50,.2)}" +
			"#craft-altpilot-text-display{max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#0f5132}" +
			"#craft-altpilot-edit-btn{pointer-events:auto;background:#8FF5B3;color:#0f5132;text-decoration:none;padding:4px 10px;border-radius:999px;border:1px solid #0f5132;font-size:15px;white-space:nowrap;transition:background-color 150ms ease,color 150ms ease,border-color 150ms ease,box-shadow 150ms ease}" +
			"#craft-altpilot-edit-btn:hover{background:#ddfce8}";

		var style = document.createElement("style");
		style.id = "craft-altpilot-overlay-styles";
		style.textContent = css;
		document.head.appendChild(style);
	}

	// ── Events ──────────────────────────────────────

	function bindEvents() {
		state.pageSearchBtn.addEventListener("click", function (e) {
			e.preventDefault();
			window.open(generatePageSearchUrl(), "_blank");
		});

		document.addEventListener("mouseover", function (e) {
			var img = e.target.closest
				? e.target.closest('img[data-cp-processed="true"]')
				: null;
			if (img) {
				state.activeImg = img;
				updateOverlay(img);
			}
		});

		document.addEventListener("mouseout", function (e) {
			var img = e.target.closest
				? e.target.closest('img[data-cp-processed="true"]')
				: null;
			if (img) {
				if (state.overlayEl.contains(e.relatedTarget)) return;
				state.overlayEl.style.display = "none";
				state.activeImg = null;
			}
		});

		state.overlayEl.addEventListener("mouseenter", function () {
			state.overlayEl.style.display = "block";
		});
		state.overlayEl.addEventListener("mouseleave", function () {
			state.overlayEl.style.display = "none";
			state.activeImg = null;
		});

		window.addEventListener("scroll", onViewportChange, {
			passive: true,
			capture: true,
		});
		window.addEventListener("resize", onViewportChange, { passive: true });
	}

	function updateOverlay(img) {
		var url = img.getAttribute("data-cp-edit-url");
		var type = img.getAttribute("data-cp-edit-type");
		var alt = img.getAttribute("data-cp-alt-text");

		if (!alt || alt.trim() === "") {
			state.txtEl.innerText = WARN_ICON + " alt text missing";
		} else {
			state.txtEl.innerText = alt;
		}
		state.txtEl.style.color = DARK_GREEN;

		state.btnEl.href =
			type === "direct" ? url : generateImageSearchUrl(img);
		state.btnEl.innerText =
			type === "direct" ? "Edit" : SEARCH_ICON + " Edit";

		state.overlayEl.style.display = "block";
		positionOverlay(img);
	}

	function positionOverlay(img) {
		if (!img || !img.isConnected) {
			state.overlayEl.style.display = "none";
			state.activeImg = null;
			return;
		}

		var rect = img.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) {
			state.overlayEl.style.display = "none";
			return;
		}

		var overlayRect = state.overlayEl.getBoundingClientRect();
		var inset = 6;
		state.overlayEl.style.top =
			rect.bottom - overlayRect.height - inset + "px";
		state.overlayEl.style.left =
			rect.right - overlayRect.width - inset + "px";
	}

	function onViewportChange() {
		if (!state.activeImg || state.overlayEl.style.display !== "block")
			return;
		if (state.scrollTicking) return;

		state.scrollTicking = true;
		window.requestAnimationFrame(function () {
			positionOverlay(state.activeImg);
			state.scrollTicking = false;
		});
	}

	// ── URL builders ───────────────────────────────────────────

	function generatePageSearchUrl() {
		var assetIds = {};
		var filenames = {};
		var imgs = document.querySelectorAll('img[data-cp-processed="true"]');

		for (var i = 0; i < imgs.length; i++) {
			var img = imgs[i];
			var raw = img.getAttribute("data-cp-asset-id");
			var id = raw ? parseInt(raw, 10) : NaN;

			if (!isNaN(id) && id > 0) {
				assetIds[id] = true;
				continue;
			}

			var fn = img.getAttribute("data-cp-search-filename");
			if (fn) {
				filenames[fn] = true;
				continue;
			}

			var src = img.getAttribute("src");
			if (!src) continue;
			var name = src.split("/").pop().split("?")[0];
			if (!name) continue;
			filenames[
				name.replace(
					/(_\d+x\d+|_thumb|_transform)(\.[a-z0-9]+)$/i,
					"$2",
				)
			] = true;
		}

		var terms = [];
		for (var aid in assetIds) terms.push("id:" + aid);
		for (var fname in filenames) terms.push('filename:"' + fname + '"');

		return buildAltPilotUrl(terms.join(" OR "));
	}

	function generateImageSearchUrl(img) {
		var raw = img.getAttribute("data-cp-asset-id");
		var id = raw ? parseInt(raw, 10) : NaN;

		if (!isNaN(id) && id > 0) {
			return buildAltPilotUrl("id:" + id);
		}

		var fn = img.getAttribute("data-cp-search-filename");
		if (fn) {
			return buildAltPilotUrl('filename:"' + fn + '"');
		}

		var src = img.getAttribute("src");
		if (!src) return buildAltPilotUrl();

		var name = src.split("/").pop().split("?")[0];
		if (!name) return buildAltPilotUrl();

		return buildAltPilotUrl(
			'filename:"' +
				name.replace(
					/(_\d+x\d+|_thumb|_transform)(\.[a-z0-9]+)$/i,
					"$2",
				) +
				'"',
		);
	}

	function buildAltPilotUrl(query) {
		var base = state.altPilotBaseUrl;
		if (!query || query.trim() === "") return base;
		var sep = base.indexOf("?") !== -1 ? "&" : "?";
		return base + sep + "query=" + encodeURIComponent(query);
	}

	// ── MutationObserver ───────────────────────────────────────

	function scheduleRescan() {
		if (state.authenticated === false) return;

		clearTimeout(state.rescanTimer);
		state.rescanTimer = setTimeout(scan, RESCAN_DEBOUNCE_MS);
	}

	function hasNewImages(mutations) {
		for (var i = 0; i < mutations.length; i++) {
			var added = mutations[i].addedNodes;
			for (var j = 0; j < added.length; j++) {
				var node = added[j];
				if (node.nodeType !== 1) continue;
				if (
					node.tagName === "IMG" &&
					node.getAttribute("data-cp-processed") !== "true"
				) {
					return true;
				}
				if (
					node.querySelector &&
					node.querySelector('img:not([data-cp-processed="true"])')
				) {
					return true;
				}
			}
		}
		return false;
	}

	function startObserver() {
		if (typeof MutationObserver === "undefined") return;

		var observer = new MutationObserver(function (mutations) {
			if (hasNewImages(mutations)) {
				scheduleRescan();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// ── Bootstrap ──────────────────────────────────────────────

	function boot() {
		scan();
		startObserver();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
