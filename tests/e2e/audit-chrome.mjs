import { realpath } from "node:fs/promises";
import { basename, isAbsolute, relative } from "node:path";
import { tmpdir } from "node:os";
import { Launcher } from "chrome-launcher";
import { chromium } from "playwright";

// chrome-launcher's convenience kill() uses taskkill /F on Windows. Keep the
// same launcher/flags, but close only this owned browser through its protocol.
export async function launchAuditChrome(options) {
  if (options.userDataDir !== undefined) throw new Error("Audit Chrome must use an isolated temporary profile.");
  const launcher = new Launcher(options);
  await launcher.launch();
  let closing;
  return {
    port: launcher.port,
    pid: launcher.pid,
    close() {
      closing ??= (async () => {
        const child = launcher.chromeProcess;
        if (!child) throw new Error("Missing owned audit browser process.");
        const exited = child.exitCode !== null || child.signalCode !== null
          ? Promise.resolve({ code: child.exitCode, signal: child.signalCode })
          : new Promise((resolve) => child.once("exit", (code, signal) => resolve({ code, signal })));
        let requestError;
        let method = "already exited";
        if (child.exitCode === null && child.signalCode === null) {
          method = "CDP Browser.close";
          try {
            const browser = await chromium.connectOverCDP(`http://127.0.0.1:${launcher.port}`, { timeout: 10000 });
            const session = await browser.newBrowserCDPSession();
            let requestTimer;
            try {
              await Promise.race([
                session.send("Browser.close"),
                exited,
                new Promise((_, reject) => { requestTimer = setTimeout(() => reject(new Error("Browser.close acknowledgement timed out")), 5000); })
              ]);
            } finally { clearTimeout(requestTimer); }
          } catch (error) {
            // Browser.close can acknowledge by disconnecting. Actual process
            // exit below is required; a rejected command alone is not success.
            requestError = error instanceof Error ? error.message : String(error);
          }
        }
        let timer;
        let exit;
        try {
          exit = await Promise.race([
            exited,
            new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`Audit Chrome ${launcher.pid} did not close gracefully; no forced fallback. ${requestError ?? ""}`)), 10000); })
          ]);
        } finally { clearTimeout(timer); }

        // Verify the resolved recursive-cleanup target before invoking the
        // launcher's own profile cleanup. Never touch a user browser profile.
        const profile = await realpath(launcher.userDataDir);
        const temp = await realpath(tmpdir());
        const fromTemp = relative(temp, profile);
        if (!fromTemp || fromTemp.startsWith("..") || isAbsolute(fromTemp) || !basename(profile).startsWith("lighthouse.")) throw new Error("Refusing audit profile cleanup outside the owned temporary directory.");
        let profileCleanup = true;
        try { launcher.destroyTmp(); }
        catch (error) {
          profileCleanup = false;
          console.warn(`Audit Chrome exited; its owned temporary profile was retained: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (exit.code !== 0 || exit.signal !== null) throw new Error(`Audit Chrome exited unexpectedly: code=${exit.code}, signal=${exit.signal}`);
        return { pid: launcher.pid, method, exitCode: exit.code, signal: exit.signal, profileCleanup };
      })();
      return closing;
    }
  };
}
