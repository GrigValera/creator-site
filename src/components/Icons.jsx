const paths = {
  window: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18m-13 5h4m-4 2h8"/></>,
  refresh: <><path d="M20 10a8 8 0 0 0-13-5l-3 3m0-4v4h4m-4 6a8 8 0 0 0 13 5l3-3m0 4v-4h-4"/></>,
  flow: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6M6 9v6a3 3 0 0 0 3 3h6"/></>,
  bag: <><path d="M5 8h14l1 13H4L5 8Zm4 1V6a3 3 0 0 1 6 0v3"/></>,
  server: <><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01m4-9h6m-6 9h6"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  tick: <path d="m5 12 5 5L20 7"/>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
}
export function Icon({ name, size = 24 }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
