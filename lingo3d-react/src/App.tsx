import { Cube, HTML, HTMLMesh, World, LingoEditor } from "."

function App() {
  return (
    <World>
      <HTMLMesh>
        <div style={{ color: "blue" }}>hello world 2</div>
      </HTMLMesh>
      <LingoEditor />
    </World>
  )
}

export default App
