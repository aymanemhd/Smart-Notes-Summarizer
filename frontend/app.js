/* global React, ReactDOM, RTK */
(function () {
  const { configureStore, createSlice } = RTK;

  const API_BASE = (window.API_BASE || "http://localhost:8000").replace(/\/$/, "");

  async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // -------------------------
  // Redux slices
  // -------------------------
  const notesSlice = createSlice({
    name: "notes",
    initialState: { items: [], currentText: "" },
    reducers: {
      setNotes: (s, a) => { s.items = a.payload; },
      setCurrentText: (s, a) => { s.currentText = a.payload; },
      addNote: (s, a) => { s.items.unshift(a.payload); },
      updateNote: (s, a) => {
        const idx = s.items.findIndex(n => n.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      },
      deleteNote: (s, a) => {
        s.items = s.items.filter(n => n.id !== a.payload);
      }
    }
  });

  const summarySlice = createSlice({
    name: "summary",
    initialState: { summary: "", bullets: [], takeaways: [], loading: false },
    reducers: {
      setLoading: (s, a) => { s.loading = a.payload; },
      setSummary: (s, a) => { s.summary = a.payload.summary; s.bullets = a.payload.bullet_points; s.takeaways = a.payload.key_takeaways; s.loading = false; },
      reset: (s) => { s.summary = ""; s.bullets = []; s.takeaways = []; s.loading = false; }
    }
  });

  const chatSlice = createSlice({
    name: "chat",
    initialState: { messages: [], loading: false },
    reducers: {
      pushUser: (s, a) => { s.messages.push({ role: "user", text: a.payload }); },
      pushAssistant: (s, a) => { s.messages.push({ role: "assistant", text: a.payload }); s.loading = false; },
      setLoading: (s, a) => { s.loading = a.payload; }
    }
  });

  const store = configureStore({
    reducer: {
      notes: notesSlice.reducer,
      summary: summarySlice.reducer,
      chat: chatSlice.reducer,
    }
  });

  // -------------------------
  // React components
  // -------------------------
  function useSelector(selector) {
    const [state, setState] = React.useState(selector(store.getState()));
    React.useEffect(() => {
      const unsub = store.subscribe(() => setState(selector(store.getState())));
      return unsub;
    }, []);
    return state;
  }
  function useDispatch() { return store.dispatch; }

  function Editor() {
    const dispatch = useDispatch();
    const text = useSelector(s => s.notes.currentText);
    const [error, setError] = React.useState("");

    async function saveNote() {
      setError("");
      const t = text.trim();
      if (!t) return setError("Note cannot be empty");
      try {
        const data = await api("/api/notes", { method: "POST", body: JSON.stringify({ content: t }) });
        dispatch(notesSlice.actions.addNote(data));
      } catch (e) {
        setError(safeErr(e));
      }
    }
    async function summarize() {
      setError("");
      const t = text.trim();
      if (!t) return setError("Enter text to summarize");
      try {
        dispatch(summarySlice.actions.setLoading(true));
        const data = await api("/api/summarize", { method: "POST", body: JSON.stringify({ content: t }) });
        dispatch(summarySlice.actions.setSummary(data));
      } catch (e) {
        dispatch(summarySlice.actions.setLoading(false));
        setError(safeErr(e));
      }
    }
    return React.createElement("div", { className: "pane" },
      React.createElement("h2", null, "Editor"),
      React.createElement("textarea", {
        value: text,
        onChange: (e) => dispatch(notesSlice.actions.setCurrentText(e.target.value)),
        placeholder: "Paste your long notes here",
      }),
      React.createElement("div", { className: "toolbar" },
        React.createElement("button", { className: "primary", onClick: saveNote }, "Save Note"),
        React.createElement("button", { onClick: summarize }, "Summarize"),
      ),
      error ? React.createElement("div", { className: "error" }, error) : null,
      React.createElement(NotesList)
    );
  }

  function NotesList() {
    const dispatch = useDispatch();
    const notes = useSelector(s => s.notes.items);
    React.useEffect(() => {
      (async () => {
        try {
          const data = await api("/api/notes");
          dispatch(notesSlice.actions.setNotes(data));
        } catch (e) {
          // ignore initial load error
        }
      })();
    }, []);

    return React.createElement("div", { className: "list" },
      notes.map(n => React.createElement("div", { key: n.id, className: "note-item" },
        React.createElement("div", null, truncate(n.content, 80)),
        React.createElement("div", { className: "note-actions" },
          React.createElement("button", { onClick: async () => {
            const txt = prompt("Update note:", n.content);
            if (txt == null) return;
            try {
              const data = await api(`/api/notes/${n.id}`, { method: "PUT", body: JSON.stringify({ content: txt }) });
              dispatch(notesSlice.actions.updateNote(data));
            } catch (e) { alert(safeErr(e)); }
          } }, "Edit"),
          React.createElement("button", { onClick: async () => {
            if (!confirm("Delete this note?")) return;
            try {
              await api(`/api/notes/${n.id}`, { method: "DELETE" });
              dispatch(notesSlice.actions.deleteNote(n.id));
            } catch (e) { alert(safeErr(e)); }
          } }, "Delete"),
          React.createElement("button", { onClick: async () => {
            try {
              store.dispatch(summarySlice.actions.setLoading(true));
              const data = await api("/api/summarize", { method: "POST", body: JSON.stringify({ content: n.content }) });
              store.dispatch(summarySlice.actions.setSummary(data));
            } catch (e) { store.dispatch(summarySlice.actions.setLoading(false)); alert(safeErr(e)); }
          } }, "Summarize")
        )
      ))
    );
  }

  function SummaryPanel() {
    const s = useSelector(s => s.summary);
    return React.createElement("div", { className: "pane" },
      React.createElement("h2", null, "Summary"),
      React.createElement("div", { id: "summaryText", className: "muted" }, s.loading ? "Summarizing..." : (s.summary || "No summary yet")),
      React.createElement("h2", { style: { marginTop: 12 } }, "Bullet Points"),
      React.createElement("ul", { id: "bulletList" }, s.bullets.map((b, i) => React.createElement("li", { key: i }, b))),
      React.createElement("h2", { style: { marginTop: 12 } }, "Key Takeaways"),
      React.createElement("ul", { id: "takeawayList" }, s.takeaways.map((b, i) => React.createElement("li", { key: i }, b))),
      React.createElement("hr", { style: { margin: "16px 0" } }),
      React.createElement(Chatbot)
    );
  }

  function Chatbot() {
    const dispatch = useDispatch();
    const [input, setInput] = React.useState("");
    const messages = useSelector(s => s.chat.messages);
    const [targetNoteId, setTargetNoteId] = React.useState(null);
    const notes = useSelector(s => s.notes.items);
    const loading = useSelector(s => s.chat.loading);

    async function send() {
      const m = input.trim();
      if (!m) return;
      setInput("");
      dispatch(chatSlice.actions.pushUser(m));
      dispatch(chatSlice.actions.setLoading(true));
      try {
        const data = await api("/api/chat", { method: "POST", body: JSON.stringify({ message: m, note_id: targetNoteId }) });
        dispatch(chatSlice.actions.pushAssistant(data.response));
      } catch (e) {
        dispatch(chatSlice.actions.pushAssistant("Error: " + safeErr(e)));
      }
    }

    return React.createElement(React.Fragment, null,
      React.createElement("h2", null, "Chatbot"),
      React.createElement("div", { className: "toolbar" },
        React.createElement("select", { value: targetNoteId || "", onChange: e => setTargetNoteId(e.target.value ? Number(e.target.value) : null) },
          React.createElement("option", { value: "" }, "No note context"),
          notes.map(n => React.createElement("option", { key: n.id, value: n.id }, `Note #${n.id}`))
        )
      ),
      React.createElement("div", { className: "chat" },
        React.createElement("input", { type: "text", value: input, onChange: e => setInput(e.target.value), placeholder: "Ask for recommendations..." }),
        React.createElement("button", { onClick: send }, loading ? "..." : "Send")
      ),
      React.createElement("div", { className: "list" },
        messages.map((m, i) => React.createElement("div", { key: i }, `[${m.role}] ${m.text}`))
      )
    );
  }

  function App() {
    return React.createElement("div", { className: "container" },
      React.createElement("div", { className: "pane" }, React.createElement(Editor)),
      React.createElement("div", { className: "pane" }, React.createElement(SummaryPanel))
    );
  }

  function truncate(s, n) {
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }
  function safeErr(e) {
    const t = (e && e.message) ? e.message : String(e);
    return t.slice(0, 200);
  }

  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(React.createElement(App));
})(); 
