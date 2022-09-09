export default class PhysicsUpdate {
    public x = false
    public y = false
    public z = false

    public updateX() {
        this.x = true
    }

    public updateY() {
        this.x = true
    }

    public updateZ() {
        this.x = true
    }

    public updateXYZ() {
        this.x = this.y = this.z = true
    }

    public updateXZ() {
        this.x = this.z = true
    }

    public reset() {
        this.x = this.y = this.z = false
    }
}
