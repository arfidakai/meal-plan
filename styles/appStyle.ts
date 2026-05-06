const appStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --surface: #FFFFFF; --sage: #7A9E7E;
    --sage-light: #C8DBC9; --sage-dark: #4E7251; --cream: #EDE8DC;
    --brown: #5C4A32; --text: #2A2A2A; --muted: #8A8070;
    --border: #E5DFD3; --red: #C0513F; --red-light: #F5E0DC;
    --gold: #C49A3C; --gold-light: #F5EDD6;
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
  .app { max-width: 390px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; }
  .status-bar { background: var(--bg); padding: 14px 24px 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; }
  .screen { padding: 0 20px 110px; overflow-y: auto; height: calc(100vh - 48px); }
  .screen::-webkit-scrollbar { display: none; }
  .screen-header { padding: 20px 0 16px; }
  .screen-header h1 { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1.15; color: var(--brown); }
  .screen-header p { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .card { background: var(--surface); border-radius: 20px; padding: 18px; margin-bottom: 14px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(90,74,50,0.06); }
  .card-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .input-group { display: flex; flex-direction: column; gap: 5px; }
  .input-group label { font-size: 11px; color: var(--muted); font-weight: 500; }
  .input-group input, .input-group select { background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; transition: border 0.2s; width: 100%; }
  .input-group input:focus, .input-group select:focus { border-color: var(--sage); }
  .tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .tag { padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 500; border: 1.5px solid var(--border); background: var(--bg); color: var(--muted); cursor: pointer; user-select: none; }
  .tag-like { background: var(--sage-light); border-color: var(--sage); color: var(--sage-dark); }
  .tag-dislike { background: var(--red-light); border-color: var(--red); color: var(--red); }
  .bmi-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
  .bmi-badge { background: var(--cream); border-radius: 12px; padding: 8px 14px; font-size: 12px; color: var(--brown); font-weight: 500; }
  .bmi-val { font-size: 18px; font-weight: 700; margin-right: 4px; }
  .btn-primary { width: 100%; background: var(--sage-dark); color: #fff; border: none; border-radius: 16px; padding: 15px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; margin-top: 4px; }
  .btn-primary:hover { background: var(--sage); }
  .btn-primary:disabled { background: var(--sage-light); cursor: not-allowed; }
  .day-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; margin-bottom: 16px; }
  .day-tabs::-webkit-scrollbar { display: none; }
  .day-tab { flex-shrink: 0; padding: 8px 14px; border-radius: 50px; font-size: 12px; font-weight: 500; border: 1.5px solid var(--border); background: var(--surface); color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .day-tab-active { background: var(--sage-dark); border-color: var(--sage-dark); color: #fff; }
  .meal-slot { background: var(--surface); border-radius: 18px; border: 1px solid var(--border); margin-bottom: 12px; overflow: hidden; }
  .meal-slot-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--cream); }
  .meal-slot-title { font-size: 12px; font-weight: 600; color: var(--brown); letter-spacing: 0.5px; }
  .meal-time { font-size: 11px; color: var(--muted); }
  .meal-content { padding: 14px 16px; }
  .meal-name { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--text); margin-bottom: 4px; }
  .meal-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .meal-meta { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  .meal-pill { font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 50px; background: var(--bg); color: var(--muted); border: 1px solid var(--border); }
  .meal-pill-green { background: var(--sage-light); color: var(--sage-dark); border-color: var(--sage); }
  .skeleton { background: linear-gradient(90deg, var(--cream) 25%, var(--border) 50%, var(--cream) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 10px; height: 14px; margin-bottom: 8px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .btn-regen { background: none; border: 1.5px solid var(--sage); color: var(--sage-dark); border-radius: 12px; padding: 10px 16px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; width: 100%; margin-top: 4px; }
  .btn-regen:hover { background: var(--sage-light); }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 390px; background: rgba(247,245,240,0.95); backdrop-filter: blur(16px); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 10px 0 24px; z-index: 100; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 12px; border-radius: 12px; }
  .nav-icon { font-size: 20px; color: var(--muted); }
  .nav-icon-active { color: var(--sage-dark); }
  .nav-label { font-size: 10px; color: var(--muted); font-weight: 500; }
  .nav-label-active { color: var(--sage-dark); font-weight: 600; }
  .tip-card { background: linear-gradient(135deg, #4E7251, #7A9E7E); border-radius: 20px; padding: 20px; color: white; margin-bottom: 14px; }
  .tip-card h3 { font-family: 'DM Serif Display', serif; font-size: 18px; margin-bottom: 6px; }
  .tip-card p { font-size: 13px; opacity: 0.88; line-height: 1.5; }
  .error-msg { background: #FEF0EE; border: 1px solid #F5C6BF; border-radius: 12px; padding: 12px 14px; font-size: 12px; color: var(--red); margin-top: 10px; }
  .hint-text { text-align: center; font-size: 12px; color: var(--muted); margin-top: 10px; }
  .mode-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1.5px solid; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .cat-label { font-size: 10px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .challenge-card { background: var(--surface); border-radius: 20px; border: 1px solid var(--border); margin-bottom: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(90,74,50,0.06); }
  .challenge-card-header { padding: 16px 18px 12px; }
  .challenge-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .challenge-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--text); }
  .challenge-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 50px; letter-spacing: 0.5px; }
  .badge-avoid { background: var(--red-light); color: var(--red); }
  .badge-streak { background: var(--gold-light); color: var(--gold); }
  .badge-done { background: var(--sage-light); color: var(--sage-dark); }
  .progress-wrap { background: var(--bg); border-radius: 50px; height: 8px; overflow: hidden; margin-bottom: 8px; }
  .progress-bar { height: 100%; border-radius: 50px; background: linear-gradient(90deg, var(--sage-dark), var(--sage)); transition: width 0.4s ease; }
  .progress-bar-gold { background: linear-gradient(90deg, var(--gold), #E8B84B); }
  .challenge-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }
  .checkin-row { display: flex; gap: 6px; overflow-x: auto; padding: 12px 18px; border-top: 1px solid var(--border); scrollbar-width: none; }
  .checkin-row::-webkit-scrollbar { display: none; }
  .day-dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
  .day-dot { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: all 0.18s; }
  .day-dot-done { background: var(--sage-dark); border-color: var(--sage-dark); color: white; }
  .day-dot-today { border-color: var(--sage); border-width: 2px; }
  .day-dot-future { opacity: 0.4; cursor: not-allowed; }
  .day-dot-label { font-size: 9px; color: var(--muted); font-weight: 500; }
  .streak-badge { display: flex; align-items: center; gap: 6px; background: var(--gold-light); border-radius: 12px; padding: 8px 14px; margin-bottom: 10px; }
  .streak-badge span { font-size: 13px; color: var(--gold); font-weight: 600; }
  .add-challenge-form { background: var(--surface); border-radius: 20px; border: 1px solid var(--border); padding: 18px; margin-bottom: 14px; }
  .form-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--brown); margin-bottom: 14px; }
  .type-selector { display: flex; gap: 8px; margin-bottom: 14px; }
  .type-btn { flex: 1; padding: 10px 8px; border-radius: 14px; border: 1.5px solid var(--border); font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; text-align: center; background: var(--bg); color: var(--muted); }
  .type-btn-active-avoid { background: var(--red-light); border-color: var(--red); color: var(--red); }
  .type-btn-active-streak { background: var(--gold-light); border-color: var(--gold); color: var(--gold); }
  .empty-challenge { text-align: center; padding: 40px 20px; color: var(--muted); }
  .empty-challenge p { font-size: 14px; margin-top: 8px; }
  .btn-danger { background: none; border: 1.5px solid var(--red); color: var(--red); border-radius: 10px; padding: 6px 12px; font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .completed-banner { background: linear-gradient(135deg, var(--sage-dark), var(--sage)); color: white; border-radius: 14px; padding: 10px 14px; margin: 8px 18px 12px; font-size: 12px; font-weight: 600; text-align: center; }
  .stepper { display: flex; align-items: flex-start; margin-bottom: 24px; }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .step-dot { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; transition: all 0.2s; }
  .step-dot-active { background: var(--sage-dark); color: white; }
  .step-dot-done { background: var(--sage); color: white; }
  .step-dot-pending { background: var(--border); color: var(--muted); }
  .step-label { font-size: 10px; color: var(--muted); font-weight: 500; white-space: nowrap; }
  .step-label-active { color: var(--sage-dark); font-weight: 600; }
  .step-line { flex: 1; height: 2px; background: var(--border); margin: 15px 6px 0; transition: background 0.2s; }
  .step-line-done { background: var(--sage); }
  .nav-row { display: flex; gap: 10px; margin-top: 4px; }
  .btn-back { flex: 1; background: var(--bg); border: 1.5px solid var(--border); border-radius: 16px; padding: 15px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; color: var(--muted); }
  .btn-skip { width: 100%; background: none; border: none; font-size: 13px; color: var(--muted); font-family: 'DM Sans', sans-serif; cursor: pointer; padding: 10px; text-decoration: underline; }
`;

export default appStyle;
