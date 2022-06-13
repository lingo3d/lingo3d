import { Gltf2 } from './_lib/UtilGltf2';
import UtilArm from './_lib/UtilArm';
import { Animator, BipedRig, BipedIKPose } from 'ossos';
import { loop } from '../../../engine/eventLoop';
import clockDelta from '../../utils/clockDelta';
import scene from '../../../engine/scene';
import NabbaRig from './rigs/NabbaRig';
import ReadyPlayerRig from './rigs/ReadyPlayerRig';

class MixamoIKAnimatorRig {
    animator    = new Animator();
    ikPose      = new BipedIKPose();
    arm         = null;
    rig         = null;
    pose        = null;

    onTick      = null;
    constructor(){}

    async load( url ){
        const gltf  = await Gltf2.fetch( url );
        const clip  = UtilArm.clipFromGltf( gltf );

        this.animator.setClip( clip );
        this.animator.inPlace = true;
        // this.animator.inPlaceScale[ 1 ] = 0;
        
        this.arm    = UtilArm.armFromGltf( gltf, 0.07 );
        this.pose   = this.arm.newPose();
        this.pose
            .updateWorld()              // Mixamo Stuff has an Offset Transform, Compute Proper WS Transforms...
            .updateBoneLengths( 0.01 ); // Then use it to get the correct bone lengths for use in IK

        this.rig = new BipedRig();
        if( !this.rig.autoRig( this.arm ) ) console.log( 'AutoRig was Incomplete' );
        
        this.rig
            .bindPose( this.pose )                  // Setup Chains & Alt Directions, Pose should be a TPose of the character
            .updateBoneLengths( this.pose )         // Apply BoneLengths to Rig since they're different from ARM.
            .useSolversForRetarget( this.pose );    // Setup Solvers

        return this;
    }

    tick( dt ){
        this.animator
            .update( dt )                                           // Move Animation Forward
            .applyPose( this.pose );                                // Apply Animation local space transform to Pose

        this.pose.updateWorld();                                    // Update the Pose's WorldSpace Transforms

        this.ikPose.computeFromRigPose( this.rig, this.pose );      // Compute IK Pose Data from Animation Pose

        if( this.onTick ) this.onTick( this, dt );
    }
}

let animator
let rigs = []

function onRender( dt=0 ){
    animator?.tick( dt );
}

const aryLoader = [
    new MixamoIKAnimatorRig().load( 'ossos/anim/Walking.gltf' ).then( rig=>{
        animator = rig;

        rig.onTick = ( rigAnim, dt )=>{
            for( let r of rigs ) r.applyIKPose( rigAnim.ikPose, dt );
        }
    }),

    new ReadyPlayerRig().loadAsync({ mesh: true }).then(rig => {
        scene.add( rig.mesh );
        rigs.push( rig );
    })

    // new NabbaRig().loadAsync( {mesh:true} ).then( rig=>{
    //     scene.add( rig.mesh );
    //     rigs.push( rig );
    // }),
];
Promise.all( aryLoader ).then(() => {
    loop(() => onRender(clockDelta[0]))
})