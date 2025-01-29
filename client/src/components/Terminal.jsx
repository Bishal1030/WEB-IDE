import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";
import socket from "../socket";


const Terminal = () => {
  const terminalRef = useRef(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    if (terminalRef.current) {
      const term = new XTerminal({
        fontFamily: "Fira Code, Consolas, monospace",
        fontSize: 14,
        theme: {
          background: "#1E1E1E", // VS Code dark background
          foreground: "#D4D4D4", // Light gray text
          cursor: "#FFFFFF", // White cursor
          cursorAccent: "#1E1E1E",
          selection: "#264F78", // VS Code selection blue
          black: "#000000",
          red: "#F44747",
          green: "#4EC9B0",
          yellow: "#DCDCAA",
          blue: "#569CD6",
          magenta: "#C586C0",
          cyan: "#9CDCFE",
          white: "#D4D4D4",
          brightBlack: "#808080",
          brightRed: "#F44747",
          brightGreen: "#B5CEA8",
          brightYellow: "#D7BA7D",
          brightBlue: "#9CDCFE",
          brightMagenta: "#C586C0",
          brightCyan: "#4EC9B0",
          brightWhite: "#FFFFFF",
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.onData((data) => {
        socket.emit('terminal:write', data);
      });

      socket.on('terminal:data', (data) => {
        term.write(data);
        setTimeout(() => {
          term.scrollToBottom();
        }, 0);
      });

      term.write("Hello from \x1B[1;3;31mBishal.x.Shahi\x1B[0m\n$ ");
    }
  }, []);

  return (
    <div
      ref={terminalRef}
      id="terminal"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        color: "white",
      }}
    > </div>
  );
};

export default Terminal;
