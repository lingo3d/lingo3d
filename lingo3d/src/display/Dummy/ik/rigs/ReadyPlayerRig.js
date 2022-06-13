// #region IMPORT
import CharacterRig, { Gltf2 } from '../lib/CharacterRig.js';
import { vec3, quat } from 'gl-matrix';
import { QuatUtil } from "ossos"
import SkinMTXMaterial from '../_lib/SkinMTXMaterial';
import { BufferAttribute, BufferGeometry, Group, Mesh, Texture } from 'three';
// #endregion


class ReadyPlayerRig extends CharacterRig{
    constructor(){ super(); }

    async loadAsync( config=null ){
        const gltf = await Gltf2.fetch( 'readyplayer.glb' );        
        
        this._parseArm( gltf );                     // Create Armature
        TPose.apply( this.pose );                   // Procedurally Generate TPose
        this.pose.updateWorld();                    // Update World
        this.arm.updateSkinFromPose( this.pose );   // Update Skin with TPose
        this._autoRig();                            // Auto BipedRig

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( config?.boneView ) this._boneView( config );
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( config?.mesh != false ){
            this.mesh = MeshParser.get( gltf, this.arm, config.tex );
            if( config?.meshPos ) this.mesh.position.fromArray( config.meshPos );
        }

        return this;
    }
}

/** Parse out the Ready Player Me Avatar from GLTF */
class MeshParser{

    /** Convert all Mesh Nodes to Renderable 3JS Meshes */
    static get( gltf, arm, useTex=false ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const aryNodes      = gltf.json.nodes.filter( i=>( i.skin !== undefined && i.mesh !== undefined ) );
        const skinOffsets   = arm.getSkinOffsets()[0];
        const grp           = new Group();
        const texMap        = new Map();
        let n;              // gl node
        let m;              // gl mesh
        let p;              // gl primitive
        let geo;            // 3JS Buffer Geo
        let mesh;           // 3JS Mesh
        let mat;            // 3JS Material
        let base = 'cyan';  // Base Color or Texture for 3JS Material

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Each mesh item should only have a single primitive, if its always true
        // we can skip looping over the array & just grab the first item.
        for( n of aryNodes ){
            //------------------------------------------
            m           = gltf.getMesh( n.mesh );                   // Get Mesh Primitives
            p           = m.primitives[ 0 ];                        // Just Grab the First Primitive
            
            //gl_m        = gltf.getMaterial( p.materialIdx );
            //texId       = gl_m.baseColorTexture.index;
            //tex         = ( texMap.has( texId ) )? texMap.get( texId ) : fnTex( texId );
            
            //------------------------------------------
            geo         = this.prim2Geo( p );                       // Create 3JS BufferGeometry
            geo.name    = 'geo_' + m.name;                          // ... name it for shitz
            
            //------------------------------------------
            if( useTex ) base = this.parseTexture( gltf, p.materialIdx, texMap );

            mat         = SkinMTXMaterial( base, skinOffsets );     // new THREE.MeshPhongMaterial( {color:0x00ffff } );
            mesh        = new Mesh( geo, mat );               // Create a 3JS mesh
            mesh.name   = m.name;                                   // ... name it
            
            //------------------------------------------
            grp.add( mesh );                                        // Group all Primitives together, Forms 1 Character
        }

        return grp;
    }

    static parseTexture( gltf, matIdx, texMap ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const mat       = gltf.getMaterial( matIdx );
        const texIdx    = mat.baseColorTexture.index;
        if( texMap.has( texIdx ) ) return texMap.get( texIdx );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const gl_tex = gltf.getTexture( texIdx );   // Parse Texture Data + Blob
        const tex    = new Texture();         // Start a 3JS Texture
        const img    = new Image();                 // Start image to put into 3js texture

        tex.name     = gl_tex.name;
        tex.flipY    = false; 

        img.src      = URL.createObjectURL( gl_tex.blob ); // Have image Load Blob
        img.onload   = ()=>{
            tex.image       = img;      // Update Texture when Image is ready
            tex.needsUpdate = true;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Save to map, other mesh can reuse textures
        texMap.set( texIdx, tex );
        return tex;
    }

    /** Convert GLTF Primitives to 3JS BufferGeometry */
    static prim2Geo( prim ){
        const geo = new BufferGeometry();
        geo.setAttribute( 'position', new BufferAttribute( prim.position.data, prim.position.componentLen ) );

        if( prim.indices )    geo.setIndex( new BufferAttribute( prim.indices.data, 1 ) );
        if( prim.normal )     geo.setAttribute( 'normal', new BufferAttribute( prim.normal.data, prim.normal.componentLen ) );
        if( prim.texcoord_0 ) geo.setAttribute( 'uv', new BufferAttribute( prim.texcoord_0.data, prim.texcoord_0.componentLen ) );

        if( prim.joints_0 && prim.weights_0 ){
            geo.setAttribute( 'skinWeight', new BufferAttribute( prim.weights_0.data, prim.weights_0.componentLen ) );
            geo.setAttribute( 'skinIndex',  new BufferAttribute( prim.joints_0.data, prim.joints_0.componentLen ) );
        }
        return geo;
    }

}


class TPose{

    static pose = null;
    static apply( pose ){
        this.pose = pose;

        const altLFoot = this.getAltDir( 'LeftFoot', [0,0,1], [0,1,0] );
        const altRFoot = this.getAltDir( 'LeftFoot', [0,0,1], [0,1,0] );

        this.alignAxis( 'LeftArm',        [1,0,0], [0,1,0] );
        this.alignAxis( 'LeftForeArm',    [1,0,0], [0,1,0] );
        this.alignAxis( 'LeftHand',       [1,0,0], [0,1,0] );
        this.rotStack(  'LeftHand',       [ [0,0,1,15] ] );

        this.alignAxis( 'RightArm',       [-1,0,0], [0,1,0] );
        this.alignAxis( 'RightForeArm',   [-1,0,0], [0,1,0] );
        this.alignAxis( 'RightHand',      [-1,0,0], [0,1,0] );
        this.rotStack(  'RightHand',      [ [0,0,1,-15] ] );

        this.alignAxis( 'LeftUpLeg',      [0,-1,0], [0,1,0] );
        this.alignAxis( 'LeftLeg',        [0,-1,0], [0,1,0] );
        this.alignAxis( 'RightUpLeg',     [0,-1,0], [0,1,0] );
        this.alignAxis( 'RightLeg',       [0,-1,0], [0,1,0] );
        
        this.swingTwist( 'LeftFoot',  altLFoot, [ [0,0,1], [0,1,0] ] );
        this.swingTwist( 'RightFoot', altRFoot, [ [0,0,1], [0,1,0] ] );

        this.pose = null;
    }

    /** Use a Swing Rotation to have the Tail Direction to align to a Target Direction */
    static alignAxis( bName, targetDir, tailDir ){
        const b     = this.pose.get( bName );
        const pRot  = this.pose.getWorldRotation( b.pidx, [0,0,0,0] );
        const cRot  = [0,0,0,0];
        const rot   = [0,0,0,0];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        quat.mul( cRot, pRot, b.local.rot );            // Get Bind Rotation in World Space
        vec3.transformQuat( tailDir, tailDir, cRot );   // Get Bone's Tail Direction
        quat.rotationTo( rot, tailDir, targetDir );     // Create swing rotation from Tail to Target
        quat.mul( cRot, rot, cRot );                    // Apply Swing Rotation
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        QuatUtil.pmulInvert( rot, cRot, pRot );         // To LocalSpace
        this.pose.setLocalRot( b.idx, rot );            // Save back to bone
    }

    /** Generate Alt Direction for a bone based on its WorldSpace Bind Rotation */
    static getAltDir( bName, fwdDir, upDir ){
        const b     = this.pose.get( bName );
        const rot   = this.pose.getWorldRotation( b.idx, [0,0,0,0] );
        quat.invert( rot, rot ); // Invert rotation to get Alter Axis Direction
        return [
            vec3.transformQuat( [0,0,0], fwdDir, rot ),
            vec3.transformQuat( [0,0,0], upDir, rot ),
        ];
    }

    /** Apply Swing + Twist Rotation to make Alt Dir Align with Target Direction */
    static swingTwist( bName, altDir, tarDir ){
        const b     = this.pose.get( bName );
        const pRot  = this.pose.getWorldRotation( b.pidx, [0,0,0,1] );
        const rot   = quat.mul( [0,0,0,0], pRot, b.local.rot );
        const q     = [0,0,0,0];
        const dir   = [0,0,0];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SWING
        vec3.transformQuat( dir, altDir[0], rot );  // Get Alt from current WS Rot
        quat.rotationTo( q, dir, tarDir[0] );       // Swing from one dir to another
        quat.mul( rot, q, rot );                    // Apply

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TWIST
        vec3.transformQuat( dir, altDir[1], rot );  // Get Alt from the swing rot
        quat.rotationTo( q, dir, tarDir[1] );       // Twist from one dir to another
        quat.mul( rot, q, rot );                    // Apply
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        QuatUtil.pmulInvert( q, rot, pRot );        // Banish THEE to LOCAL EFFing SPACE !
        this.pose.setLocalRot( b.idx, q );          // Save back to bone
    }

    /** Apply a stack of AxisAngle rotations  */
    static rotStack( bName, aryAry ){
        const b     = this.pose.get( bName );
        const pRot  = this.pose.getWorldRotation( b.pidx, [0,0,0,1] );
        const rot   = quat.mul( [0,0,0,0], pRot, b.local.rot );
        const axis  = [0,0,0,0];
        let i;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Apply the Stack of Axis Angle Rotations onto
        // The Bones World Space Rotation
        for( i of aryAry ){
            quat.setAxisAngle( axis, i, i[3] * Math.PI / 180 );
            quat.mul( rot, axis, rot );
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        QuatUtil.pmulInvert( rot, rot, pRot );  // To LocalSpace
        this.pose.setLocalRot( b.idx, rot );    // Save back to bone
    }

}

export default ReadyPlayerRig;