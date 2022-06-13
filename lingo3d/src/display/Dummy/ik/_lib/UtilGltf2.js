import { BufferAttribute, BufferGeometry, Color, Group, Mesh, MeshPhongMaterial } from 'three';
import { Gltf2 } from "ossos";

class UtilGltf2{

    static primitiveGeo( prim ){
        const geo = new BufferGeometry();
        geo.setAttribute( 'position', new BufferAttribute( prim.position.data, prim.position.componentLen ) );

        //console.log( prim );

        if( prim.indices )    geo.setIndex( new BufferAttribute( prim.indices.data, 1 ) );
        if( prim.normal )     geo.setAttribute( 'normal', new BufferAttribute( prim.normal.data, prim.normal.componentLen ) );
        if( prim.texcoord_0 ) geo.setAttribute( 'uv', new BufferAttribute( prim.texcoord_0.data, prim.texcoord_0.componentLen ) );

        if( prim.joints_0 && prim.weights_0 ){
            geo.setAttribute( 'skinWeight', new BufferAttribute( prim.weights_0.data, prim.weights_0.componentLen ) );
            geo.setAttribute( 'skinIndex',  new BufferAttribute( prim.joints_0.data, prim.joints_0.componentLen ) );
        }

        return geo;
    }

    static loadMesh( gltf, name=null, mat=null ){
        const o = gltf.getMesh( name );
        let geo, prim, pmat;

        if( o.primitives.length == 1 ){
            prim = o.primitives[ 0 ];

            if( mat )                           pmat = mat;
            else if( prim.materialIdx != null ) pmat = this.loadMaterial( gltf, prim.materialIdx );
            
            geo = this.primitiveGeo( prim );
            return new Mesh( geo, pmat );
        }else{
            let mesh, m, c ;
            const grp = new Group();
            for( prim of o.primitives ){

                if( mat ){
                    pmat = mat;
                }else if( prim.materialIdx != null ){
                    pmat = this.loadMaterial( gltf, prim.materialIdx );
                }
            
                geo     = this.primitiveGeo( prim );
                mesh    = new Mesh( geo, pmat );
                
                grp.add( mesh );
            }
            return grp;
        }
    }

    static loadMaterial( gltf, id ){
        const config = {};
        const m      = gltf.getMaterial( id );
        
        if( m ){
            if( m.baseColorFactor ){
                config.color = new Color( m.baseColorFactor[0], m.baseColorFactor[1], m.baseColorFactor[2] );
            }
        }

        return new MeshPhongMaterial( config );
    }

}

export { UtilGltf2, Gltf2 };