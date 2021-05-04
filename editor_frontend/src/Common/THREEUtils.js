import * as THREE from 'three';
function deepClone( obj, recursive ) {

  return new deepCopy( obj, recursive );

}
function deepCopy( source, recursive ) {
    if ( recursive === undefined ) recursive = true;

    const cloneObject = new THREE.Mesh();

    //console.log("cloneObject" , cloneObject);

    cloneObject.name = source.name;
    cloneObject.up.copy( source.up );
    cloneObject.position.copy( source.position );
    cloneObject.quaternion.copy( source.quaternion );
    cloneObject.scale.copy( source.scale );
    cloneObject.matrix.copy( source.matrix );
    cloneObject.matrixWorld.copy( source.matrixWorld );
    if(source.material){
        //changed
        cloneObject.material = source.material.clone()
    }
    if(source.geometry){
        //changed
        cloneObject.geometry = source.geometry.clone()
    }
    cloneObject.matrixAutoUpdate = source.matrixAutoUpdate;
    cloneObject.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
    cloneObject.layers.mask = source.layers.mask;
    cloneObject.visible = source.visible;
    cloneObject.castShadow = source.castShadow;
    cloneObject.receiveShadow = source.receiveShadow;
    cloneObject.frustumCulled = source.frustumCulled;
    cloneObject.renderOrder = source.renderOrder;
    cloneObject.userData = JSON.parse( JSON.stringify( source.userData ) );
    if ( recursive === true ) {
        for ( var i = 0; i < source.children.length; i ++ ) {
            var child = source.children[ i ];
            cloneObject.add( child.deepClone() ); //changed
        }
    }
    return cloneObject;
}

    export default deepClone;