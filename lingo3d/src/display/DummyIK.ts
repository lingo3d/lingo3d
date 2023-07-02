import Appendable from "./core/Appendable"
import IDummyIK, { dummyIKDefaults, dummyIKSchema } from "../interface/IDummyIK"
import { configDummyIKSystem } from "../systems/configSystems/configDummyIKSystem"

export default class DummyIK extends Appendable implements IDummyIK {
    public static componentName = "dummyIK"
    public static defaults = dummyIKDefaults
    public static schema = dummyIKSchema

    private _target?: string
    public get target() {
        return this._target
    }
    public set target(val) {
        this._target = val
        configDummyIKSystem.add(this)
    }

    private _hips?: string
    public get hips() {
        return this._hips
    }
    public set hips(val) {
        this._hips = val
        configDummyIKSystem.add(this)
    }

    private _spine0?: string
    public get spine0() {
        return this._spine0
    }
    public set spine0(val) {
        this._spine0 = val
        configDummyIKSystem.add(this)
    }

    private _spine1?: string
    public get spine1() {
        return this._spine1
    }
    public set spine1(val) {
        this._spine1 = val
        configDummyIKSystem.add(this)
    }

    private _spine2?: string
    public get spine2() {
        return this._spine2
    }
    public set spine2(val) {
        this._spine2 = val
        configDummyIKSystem.add(this)
    }

    private _neck?: string
    public get neck() {
        return this._neck
    }
    public set neck(val) {
        this._neck = val
        configDummyIKSystem.add(this)
    }

    private _leftShoulder?: string
    public get leftShoulder() {
        return this._leftShoulder
    }
    public set leftShoulder(val) {
        this._leftShoulder = val
        configDummyIKSystem.add(this)
    }

    private _leftArm?: string
    public get leftArm() {
        return this._leftArm
    }
    public set leftArm(val) {
        this._leftArm = val
        configDummyIKSystem.add(this)
    }

    private _leftForeArm?: string
    public get leftForeArm() {
        return this._leftForeArm
    }
    public set leftForeArm(val) {
        this._leftForeArm = val
        configDummyIKSystem.add(this)
    }

    private _leftHand?: string
    public get leftHand() {
        return this._leftHand
    }
    public set leftHand(val) {
        this._leftHand = val
        configDummyIKSystem.add(this)
    }

    private _rightShoulder?: string
    public get rightShoulder() {
        return this._rightShoulder
    }
    public set rightShoulder(val) {
        this._rightShoulder = val
        configDummyIKSystem.add(this)
    }

    private _rightArm?: string
    public get rightArm() {
        return this._rightArm
    }
    public set rightArm(val) {
        this._rightArm = val
        configDummyIKSystem.add(this)
    }

    private _rightForeArm?: string
    public get rightForeArm() {
        return this._rightForeArm
    }
    public set rightForeArm(val) {
        this._rightForeArm = val
        configDummyIKSystem.add(this)
    }

    private _rightHand?: string
    public get rightHand() {
        return this._rightHand
    }
    public set rightHand(val) {
        this._rightHand = val
        configDummyIKSystem.add(this)
    }

    private _leftThigh?: string
    public get leftThigh() {
        return this._leftThigh
    }
    public set leftThigh(val) {
        this._leftThigh = val
        configDummyIKSystem.add(this)
    }

    private _leftLeg?: string
    public get leftLeg() {
        return this._leftLeg
    }
    public set leftLeg(val) {
        this._leftLeg = val
        configDummyIKSystem.add(this)
    }

    private _leftFoot?: string
    public get leftFoot() {
        return this._leftFoot
    }
    public set leftFoot(val) {
        this._leftFoot = val
        configDummyIKSystem.add(this)
    }

    private _leftForeFoot?: string
    public get leftForeFoot() {
        return this._leftForeFoot
    }
    public set leftForeFoot(val) {
        this._leftForeFoot = val
        configDummyIKSystem.add(this)
    }

    private _rightThigh?: string
    public get rightThigh() {
        return this._rightThigh
    }
    public set rightThigh(val) {
        this._rightThigh = val
        configDummyIKSystem.add(this)
    }

    private _rightLeg?: string
    public get rightLeg() {
        return this._rightLeg
    }
    public set rightLeg(val) {
        this._rightLeg = val
        configDummyIKSystem.add(this)
    }

    private _rightFoot?: string
    public get rightFoot() {
        return this._rightFoot
    }
    public set rightFoot(val) {
        this._rightFoot = val
        configDummyIKSystem.add(this)
    }

    private _rightForeFoot?: string
    public get rightForeFoot() {
        return this._rightForeFoot
    }
    public set rightForeFoot(val) {
        this._rightForeFoot = val
        configDummyIKSystem.add(this)
    }
}
