import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import "xterm/css/xterm.css";
import socket from "../socket";

const Terminal = () => {
  const terminalRef = useRef(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if(isRendered.current) return;
    isRendered.current = true;

    if (terminalRef.current) {
      const term = new XTerminal({
        rows: 20,
        cols: 80,
      });

    
      term.open(terminalRef.current);
      term.onData((data) => {
        socket.emit('terminal:write', data);
      })
      socket.on('terminal:data', (data) => {
        term.write(data);
      })
      term.write("Hello from \x1B[1;3;31mBishal.x.Shahi\x1B[0m $ ");
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
    ></div>
  );
};

export default Terminal;
