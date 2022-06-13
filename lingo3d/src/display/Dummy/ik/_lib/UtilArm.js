import { Armature, SkinMTX, Clip } from 'ossos';

import SkinMTXMaterial from './SkinMTXMaterial.js';
import { UtilGltf2 } from './UtilGltf2.js';

class UtilArm{
    static skinMtxMesh( gltf, arm, base='cyan', meshName=null ){
        const mat = SkinMTXMaterial( base, arm.getSkinOffsets()[0] ); // 3JS Example of Matrix Skinning GLSL Code
        return UtilGltf2.loadMesh( gltf, meshName, mat );             // Pull Skinned Mesh from GLTF
    }

    static clipFromGltf( gltf ){ return Clip.fromGLTF2( gltf.getAnimation() ); }

    static armFromGltf( gltf, defaultBoneLen = 0.07 ){
        const skin = gltf.getSkin();
        const arm  = new Armature();
        
        // Create Armature
        for( let j of skin.joints ){
            arm.addBone( j.name, j.parentIndex, j.rotation, j.position, j.scale );
        }

        // Bind
        arm.bind( SkinMTX, defaultBoneLen );

        // Save Offsets if available
        arm.offset.set( skin.rotation, skin.position, skin.scale );
        //if( skin.rotation ) arm.offset.rot.copy( skin.rotation );
        //if( skin.position ) arm.offset.pos.copy( skin.position );
        //if( skin.scale )    arm.offset.scl.copy( skin.scale );

        return arm;
    }

}

export default UtilArm;