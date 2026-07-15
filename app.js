const docs = [
  {
    id: "overview",
    title: "Package README",
    type: "markdown",
    path: "./the-grande-growth-strategy/README.md",
  },
  {
    id: "strategy",
    title: "Detailed Strategy",
    type: "markdown",
    path: "./the-grande-growth-strategy/STRATEGY.md",
  },
  {
    id: "pitch-script",
    title: "Pitch Script",
    type: "markdown",
    path: "./the-grande-growth-strategy/PITCH_SCRIPT.md",
  },
  {
    id: "objections",
    title: "Objection Handling",
    type: "markdown",
    path: "./the-grande-growth-strategy/OBJECTION_HANDLING.md",
  },
  {
    id: "setup",
    title: "GitHub Setup Guide",
    type: "markdown",
    path: "./the-grande-growth-strategy/GITHUB_SETUP.md",
  },
  {
    id: "contact",
    title: "Contact Info",
    type: "markdown",
    path: "./the-grande-growth-strategy/contact/README.md",
  },
  {
    id: "pitch-deck",
    title: "Interactive Pitch Deck",
    type: "html",
    path: "./the-grande-growth-strategy/pitch-deck/the-grande-pitch-deck-updated.html",
  },
];

const navEl = document.getElementById("section-nav");
const docTitleEl = document.getElementById("doc-title");
const docSourceEl = document.getElementById("doc-source-link");
const docContentEl = document.getElementById("doc-content");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.getElementById("search-results");

const state = {
  activeDocId: docs[0].id,
  contentCache: new Map(),
};

init();

function init() {
  renderNav();
  attachSearch();
  selectDoc(state.activeDocId);
}

function renderNav() {
  navEl.innerHTML = "";
  for (const doc of docs) {
    const button = document.createElement("button");
    button.className = "nav-btn";
    button.dataset.docId = doc.id;
    button.textContent = doc.title;
    button.addEventListener("click", () => selectDoc(doc.id));
    navEl.appendChild(button);
  }
  syncActiveNav();
}

function syncActiveNav() {
  const buttons = navEl.querySelectorAll(".nav-btn");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.docId === state.activeDocId);
  });
}

async function selectDoc(docId) {
  state.activeDocId = docId;
  syncActiveNav();
  clearSearchResults();

  const doc = docs.find((item) => item.id === docId);
  if (!doc) return;

  docTitleEl.textContent = doc.title;
  docSourceEl.href = doc.path;

  if (doc.type === "html") {
    docContentEl.innerHTML = `<iframe title="${escapeHtml(
      doc.title
    )}" src="${escapeHtml(doc.path)}"></iframe>`;
    return;
  }

  try {
    const text = await getDocText(doc);
    docContentEl.innerHTML = parseMarkdown(text);
  } catch (error) {
    docContentEl.innerHTML = `<p class="muted">Unable to load document.</p>`;
  }
}

async function getDocText(doc) {
  if (state.contentCache.has(doc.path)) {
    return state.contentCache.get(doc.path);
  }
  const response = await fetch(doc.path);
  if (!response.ok) {
    throw new Error(`Failed to load: ${doc.path}`);
  }
  const text = await response.text();
  state.contentCache.set(doc.path, text);
  return text;
}

function attachSearch() {
  searchInputEl.addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length < 2) {
      clearSearchResults();
      return;
    }

    const hits = await searchDocs(query);
    renderSearchResults(hits, query);
  });
}

async function searchDocs(query) {
  const lower = query.toLowerCase();
  const hits = [];
  const searchableDocs = docs.filter((doc) => doc.type === "markdown");

  for (const doc of searchableDocs) {
    const text = await getDocText(doc);
    const idx = text.toLowerCase().indexOf(lower);
    if (idx === -1) continue;
    const start = Math.max(0, idx - 45);
    const end = Math.min(text.length, idx + query.length + 75);
    const snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
    hits.push({ docId: doc.id, title: doc.title, snippet });
  }

  return hits.slice(0, 8);
}

function renderSearchResults(hits, query) {
  searchResultsEl.classList.remove("hidden");
  if (!hits.length) {
    searchResultsEl.innerHTML = `<p class="search-hit muted">No matches for "${escapeHtml(
      query
    )}".</p>`;
    return;
  }

  searchResultsEl.innerHTML = hits
    .map(
      (hit) => `
      <div class="search-hit">
        <button data-hit-doc-id="${escapeHtml(hit.docId)}">
          ${escapeHtml(hit.title)}
          <small>${escapeHtml(hit.snippet)}</small>
        </button>
      </div>
    `
    )
    .join("");

  const buttons = searchResultsEl.querySelectorAll("button[data-hit-doc-id]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const docId = button.getAttribute("data-hit-doc-id");
      searchInputEl.value = "";
      clearSearchResults();
      selectDoc(docId);
    });
  });
}

function clearSearchResults() {
  searchResultsEl.classList.add("hidden");
  searchResultsEl.innerHTML = "";
}

function parseMarkdown(input) {
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let inCodeBlock = false;
  let inUl = false;
  let inOl = false;
  let pendingParagraph = [];

  const flushParagraph = () => {
    if (!pendingParagraph.length) return;
    out.push(`<p>${formatInline(pendingParagraph.join(" "))}</p>`);
    pendingParagraph = [];
  };

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      closeLists();
      if (!inCodeBlock) {
        out.push("<pre><code>");
      } else {
        out.push("</code></pre>");
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      out.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeLists();
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(lines[i + 1])
    ) {
      flushParagraph();
      closeLists();
      const headerCells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean)
        );
        i += 1;
      }
      i -= 1;
      out.push("<table><thead><tr>");
      out.push(
        headerCells.map((cell) => `<th>${formatInline(cell)}</th>`).join("")
      );
      out.push("</tr></thead><tbody>");
      out.push(
        rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`
          )
          .join("")
      );
      out.push("</tbody></table>");
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      const level = headingMatch[1].length;
      out.push(`<h${level}>${formatInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeLists();
      out.push("<hr />");
      continue;
    }

    const orderedItem = line.match(/^\s*\d+\.\s+(.+)$/);
    if (orderedItem) {
      flushParagraph();
      if (!inOl) {
        if (inUl) {
          out.push("</ul>");
          inUl = false;
        }
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${formatInline(orderedItem[1])}</li>`);
      continue;
    }

    const unorderedItem = line.match(/^\s*[-*]\s+(.+)$/);
    if (unorderedItem) {
      flushParagraph();
      if (!inUl) {
        if (inOl) {
          out.push("</ol>");
          inOl = false;
        }
        out.push("<ul>");
        inUl = true;
      }
      out.push(`<li>${formatInline(unorderedItem[1])}</li>`);
      continue;
    }

    const quoteMatch = line.match(/^\s*>\s?(.+)$/);
    if (quoteMatch) {
      flushParagraph();
      closeLists();
      out.push(`<blockquote>${formatInline(quoteMatch[1])}</blockquote>`);
      continue;
    }

    pendingParagraph.push(line.trim());
  }

  flushParagraph();
  closeLists();
  if (inCodeBlock) out.push("</code></pre>");
  return out.join("\n");
}

function formatInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
