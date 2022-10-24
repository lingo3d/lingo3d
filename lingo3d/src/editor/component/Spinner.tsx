type SpinnerProps = {
    color?: string,
    size?: number
}

const Spinner = ({ color, size }: SpinnerProps) => {
    return (
        <div class="lingo3d-sk-cube-grid" style={{ color, width: size, height: size }}>
            <div class="lingo3d-sk-cube lingo3d-sk-cube1"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube2"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube3"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube4"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube5"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube6"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube7"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube8"></div>
            <div class="lingo3d-sk-cube lingo3d-sk-cube9"></div>
        </div>
    )
}

export default Spinner
