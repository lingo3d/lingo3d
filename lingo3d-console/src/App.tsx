import { useEffect, useState } from "react";
import { Hook, Unhook, Console, Decode } from "console-feed";

const setFrameProperty = (key: string, value: any) =>
  //@ts-ignore
  window.frameElement && (window.frameElement[key] = value);

function App() {
  const [logs, setLogs] = useState<Array<any>>([]);

  useEffect(() => {
    setFrameProperty("$hook", (myConsole: typeof console) =>
      Hook(myConsole, (log) => {
        setLogs((currLogs) => [...currLogs, Decode(log)]);
      })
    );
    setFrameProperty("$unhook", Unhook);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Console logs={logs} variant="dark" />
    </div>
  );
}

export default App;
