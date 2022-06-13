import CharacterRig, { Gltf2 } from '../lib/CharacterRig.js';

class NabbaRig extends CharacterRig{
    constructor(){ super(); }

    async loadAsync( config=null ){
        const gltf = await Gltf2.fetch( 'ossos/models/nabba/nabba.gltf' );
        this._parseArm( gltf, false )   // Create Armature
            ._autoRig()                 // Auto BipedRig

        if( config?.mesh != false ) this._skinnedMesh( gltf, 'cyan', config );
        if( config?.boneView )      this._boneView( config );
        return this;
    }
}

export default NabbaRig;