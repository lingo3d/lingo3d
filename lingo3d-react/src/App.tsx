import { Cube, HTML, HTMLMesh, World, LingoEditor } from "."

function App() {
  return (
    <World>
      <HTMLMesh sprite>
        <div style={{ color: "blue" }}>hello world</div>
      </HTMLMesh>
      <LingoEditor />
    </World>
  )
}

export default App
