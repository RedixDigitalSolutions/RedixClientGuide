(function () {
    // ===== Auth helpers =====
    // ===== Auth helpers (REPLACE your existing auth block) =====
    const AUTH = window.AUTH_CONFIG || {};
    const SESSION_KEY = AUTH.sessionKey || "redix_auth_v1";

    // Normalize accounts: support AUTH.accounts or legacy {username, passSha256}
    const ACCOUNTS = Array.isArray(AUTH.accounts) && AUTH.accounts.length
        ? AUTH.accounts
        : (AUTH.username && AUTH.passSha256
            ? [{ username: AUTH.username, passSha256: AUTH.passSha256 }]
            : []);

    function isAuthEnabled() { return !!AUTH.enabled; }

    function isAuthed() {
        // Check both localStorage and sessionStorage
        try {
            return localStorage.getItem(SESSION_KEY) === "1" || sessionStorage.getItem(SESSION_KEY) === "1";
        } catch {
            return false;
        }
    }

    async function sha256Hex(text) {
        const buf = new TextEncoder().encode(text);
        const hash = await crypto.subtle.digest("SHA-256", buf);
        return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function findAccount(username) {
        const u = (username || "").trim();
        return ACCOUNTS.find(a => a && typeof a.username === "string" && a.username.trim() === u);
    }

    function showOverlay() { document.getElementById("auth-overlay")?.classList.remove("hidden"); }
    function hideOverlay() { document.getElementById("auth-overlay")?.classList.add("hidden"); }

    function wireAuthForm(onSuccess) {
        const form = document.getElementById("auth-form");
        const err = document.getElementById("auth-error");
        const rememberCheck = document.getElementById("auth-remember");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (err) err.textContent = "";

            const user = (document.getElementById("auth-user")?.value || "").trim();
            const pass = document.getElementById("auth-pass")?.value || "";
            const remember = rememberCheck?.checked || false;

            const acct = findAccount(user);
            let ok = false;

            if (acct?.passSha256) {
                try {
                    const hex = await sha256Hex(pass);
                    ok = hex.toLowerCase() === String(acct.passSha256).toLowerCase();
                } catch {
                    ok = false;
                }
            }

            if (ok) {
                try {
                    if (remember) {
                        // Persist across browser sessions
                        localStorage.setItem(SESSION_KEY, "1");
                        sessionStorage.removeItem(SESSION_KEY);
                    } else {
                        // Clear when tab closes
                        sessionStorage.setItem(SESSION_KEY, "1");
                        localStorage.removeItem(SESSION_KEY);
                    }
                } catch { }
                hideOverlay();
                onSuccess?.();
            } else {
                if (err) err.textContent = "Invalid username or password.";
            }
        });
    }


    // ===== Existing app code (render grid) =====
    const grid = document.getElementById("grid");

    const ICONS = {
        tiktok: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.76 3c.45 2.09 1.78 3.7 3.78 4.46a6.78 6.78 0 0 0 1.98.32v2.47c-1.29-.03-2.5-.33-3.6-.9v5.5c0 3.28-2.66 5.93-5.94 5.93A5.93 5.93 0 0 1 3 14.85c0-3.28 2.65-5.94 5.93-5.94c.39 0 .77.04 1.14.12v2.7a3.2 3.2 0 0 0-1.14-.21a3.22 3.22 0 0 0-3.22 3.22a3.22 3.22 0 0 0 3.22 3.22a3.22 3.22 0 0 0 3.22-3.22V3h1.61Z"/></svg>`,
        instagram: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm11 2a1 1 0 1 1 0 2a1 1 0 0 1 0-2M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 12 14.8A2.8 2.8 0 0 0 12 9.2"/></svg>`,
        facebook: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 3h4a1 1 0 0 1 1 1v3h-3a1 1 0 0 0-1 1v3h4l-1 4h-3v8h-4v-8H7v-4h3V8a5 5 0 0 1 5-5"/></svg>`,
        drive: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m10.06 2l3.32 5.75H8.08L4.76 2zM5.2 3l3.04 5.25L3 17H0zm13.6 0l5.2 9l-5.2 9H7L1.8 12L7 3zM9.7 9h7.76l3.04 5.25l-3.04 5.25H9.7L6.66 14.25z"/></svg>`,
        link: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.24-4.24a3 3 0 1 0-4.24-4.24l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06a1 1 0 1 1 1.41 1.41zm2.82-2.82a1 1 0 0 0-1.41-1.41L7.76 12.7a3 3 0 1 0 4.24 4.24l1.06-1.06a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41z"/></svg>`
    };

    function createIconLink({ href, label, kind, primary = false }) {
        if (!href) return null;
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = primary ? "icon-btn primary" : "icon-btn";
        a.setAttribute("aria-label", label);
        a.innerHTML = ICONS[kind] + `<span class="visually-hidden">${label}</span>`;
        return a;
    }

    function initials(name) {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/).slice(0, 2);
        return parts.map(p => p[0]?.toUpperCase() || "").join("");
    }

    function renderClient(client) {
        const card = document.createElement("article");
        card.className = "card";
        card.setAttribute("data-id", client.id);

        const media = document.createElement("div");
        media.className = "card-media";
        if (client.photo) {
            const img = document.createElement("img");
            img.src = client.photo;
            img.alt = client.name;
            img.className = "avatar";
            media.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.className = "initials";
            div.textContent = initials(client.name);
            media.appendChild(div);
        }

        const body = document.createElement("div");
        body.className = "card-body";
        body.innerHTML = `
      <h3 class="card-title">${client.name}</h3>
      <p class="card-sub">Client profile</p>
    `;

        const linkbar = document.createElement("div");
        linkbar.className = "linkbar";

        const socials = document.createElement("div");
        socials.className = "group";
        const s = client.social || {};
        [
            { key: "tiktok", label: `Open ${client.name} on TikTok` },
            { key: "instagram", label: `Open ${client.name} on Instagram` },
            { key: "facebook", label: `Open ${client.name} on Facebook` }
        ].forEach(({ key, label }) => {
            if (s[key]) {
                const btn = createIconLink({ href: s[key], label, kind: key });
                if (btn) socials.appendChild(btn);
            }
        });

        const actions = document.createElement("div");
        actions.className = "group";
        const driveHref = client.drive || window.globalRedixGoogleDriveFolder;
        const driveBtn = createIconLink({
            href: driveHref,
            label: `Open ${client.name} Google Drive folder`,
            kind: "drive",
            primary: true
        });
        if (driveBtn) actions.appendChild(driveBtn);

        if (client.resources) {
            const resBtn = createIconLink({
                href: client.resources,
                label: `Open ${client.name} resources`,
                kind: "link"
            });
            if (resBtn) actions.appendChild(resBtn);
        }

        linkbar.appendChild(socials);
        linkbar.appendChild(actions);

        card.appendChild(media);
        card.appendChild(body);
        card.appendChild(linkbar);

        return card;
    }
    function domainFrom(url) {
        try { return new URL(url).host; } catch { return url; }
    }

    function renderLinkItem({ title, url }) {
        if (!url) return null;
        const a = document.createElement("a");
        a.className = "link-card";
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.setAttribute("aria-label", `Open ${title}`);

        const icon = document.createElement("div");
        icon.className = "link-icon";
        icon.innerHTML = ICONS.link;

        const meta = document.createElement("div");
        meta.className = "link-meta";
        meta.innerHTML = `
    <div class="link-title">${title || domainFrom(url)}</div>
    <div class="link-url">${domainFrom(url)}</div>
  `;

        a.appendChild(icon);
        a.appendChild(meta);
        return a;
    }

    function renderLinks() {
        const cfg = window.LINKS || {};
        const sales = Array.isArray(cfg.sales) ? cfg.sales : [];
        const proposals = Array.isArray(cfg.proposals) ? cfg.proposals : [];

        const salesGrid = document.getElementById("sales-grid");
        const propGrid = document.getElementById("proposals-grid");

        if (salesGrid) {
            salesGrid.innerHTML = "";
            sales.forEach(item => {
                const el = renderLinkItem(item);
                if (el) salesGrid.appendChild(el);
            });
        }
        if (propGrid) {
            propGrid.innerHTML = "";
            proposals.forEach(item => {
                const el = renderLinkItem(item);
                if (el) propGrid.appendChild(el);
            });
        }
    }


    function renderApp() {
        if (!grid) return;
        grid.innerHTML = "";
        const data = Array.isArray(window.CLIENTS) ? window.CLIENTS : [];
        data.forEach(c => grid.appendChild(renderClient(c)));

        // New: render Sales & Proposals
        renderLinks();
    }

    function start() {
        if (isAuthEnabled() && !isAuthed()) {
            showOverlay();
            wireAuthForm(renderApp);
            return;
        }
        hideOverlay();
        renderApp();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
