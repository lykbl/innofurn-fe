import { useGLTF } from '@react-three/drei';
import React, { useCallback, useState } from 'react';
import { Select } from '@react-three/postprocessing';
import { debounce } from 'leva/plugin';

export default function CozyDarkRoom() {
  const model = useGLTF('rooms/cozy_living_room_baked/scene.gltf');
  const [hovered, hover] = useState(null)
  const debouncedHover = useCallback(debounce(hover, 30), [])
  const over = (name) => (e) => (e.stopPropagation(), hover(name))

  console.log(model.nodes)
  console.log(model.materials)

  return (
    <>
      <primitive
        object={model.scene}
      />
      {/*<Select*/}
      {/*  enabled={hovered === 'SKAFTET'}*/}
      {/*  onPointerOver={() => hover('SKAFTET')}*/}
      {/*  onPointerOut={() => hover(null)}*/}
      {/*>*/}
        {/*<mesh*/}
        {/*  geometry={model.nodes['Leather_Sofa_Fabric002_0'].geometry}*/}
        {/*  material={model.materials['Material.001']}*/}
        {/*  // material-envMap={env}*/}
        {/*/>*/}
      {/*</Select>*/}
      <ambientLight intensity={0.1} />
      <pointLight
        position={[-2.5, 1.3, -2.8]}
          color='#ffac00'
          intensity={1.7}
          distance={10}
          decay={1}
        />

        <pointLight
          name="candle-light"
          color='#ffac00'
          decay={1}
          position={[-0.82, 0.45, -0.2]}
          distance={1.7}
          intensity={0.5}
        />
    </>
  );
}
