/** Runs before page paint. A blocked storage read falls back to the system theme. */
export const themeBootstrap = `(function(){var t;try{t=localStorage.getItem('ilws-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()`;
