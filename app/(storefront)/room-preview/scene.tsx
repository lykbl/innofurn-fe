'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { Bvh, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { EffectComposer, N8AO, Outline, Selection, TiltShift2, ToneMapping } from '@react-three/postprocessing';
import { DiningRoom } from '@/(storefront)/room-preview/dining-room';

function Effects() {
  const { size, camera} = useThree()
  // useFrame((state, delta) => {
    // easing.damp3(
    //   state.camera.position,
    //   [state.pointer.x, 1 + state.pointer.y / 2, 8 + Math.atan(state.pointer.x * 2)],
    //   0.3,
    //   delta
    // )
    // state.camera.lookAt(state.camera.position.x * 0.9, 0, -4)
  // })

  return (
    <EffectComposer
      stencilBuffer
      enableNormalPass={false}
      autoClear={false}
      multisampling={16}
    >
        <Outline
          visibleEdgeColor={0xffffff}
          // hiddenEdgeColor={0xff0000}
          blur
          width={size.width * 1.25}
          edgeStrength={10}
        />
    </EffectComposer>
  )
}

export default function Scene() {
  const helpers = useControls('helpers', {
    'orbit': false,
  });

  return (
    <div className="h-120 w-full">
      <Canvas
        camera={{
          position: [-3.04, 1.28, 0.173],
          rotation: [-2.3359, -1.5291, -2.3363],
          aspect: 16 / 9,
          fov: 35,
        }}
      >
        {helpers.orbit && <OrbitControls />}
        <Bvh firstHitOnly>
          <Selection>
          <Effects />
            <DiningRoom />
          </Selection>
        </Bvh>
      </Canvas>
    </div>
  );
}
