/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/rooms/cozy_living_room_baked/scene.gltf --transform 
Files: public/rooms/cozy_living_room_baked/scene.gltf [191.27KB] > /Users/rkpiii/Documents/Projects/General/innofurn-fe/scene-transformed.glb [8.88MB] (-4540%)
Author: ChristyHsu (https://sketchfab.com/ida61xq)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/cozy-living-room-baked-581238dc5fda4dc990571cdc02827783
Title: Cozy living room baked
*/

import React, { useCallback, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import { debounce } from 'leva/plugin';

export function MinifiedRoom(props) {
  const { nodes, materials } = useGLTF('/scene-transformed.glb');
    const [hovered, hover] = useState(null)
    const debouncedHover = useCallback(debounce(hover, 30), [])
    const over = (name) => (e) => (e.stopPropagation(), hover(name))

    return (
    <group { ...props } dispose={ null }>
            <Select
              enabled={ hovered === "LIVSVERK" }
              onPointerOver={ over("LIVSVERK") }
              onPointerOut={ () => debouncedHover(null) }
            >
            <mesh
        geometry={ nodes.Leather_Sofa_Fabric002_0.geometry }
        material={ materials['Fabric.002'] }
        position={ [-2.491, 0.096, -0.906] }
        rotation={ [-Math.PI / 2, 0, Math.PI / 2] }
        scale={ [1.196, 1, 1] }
      />
        </Select>
      <mesh
        geometry={ nodes.Cube_Material_0.geometry }
        material={ materials.Material }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.Cube007_Material023_0.geometry }
        material={ materials.PaletteMaterial001 }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.Cube019_Birch_Wood_Flooring__English_0.geometry }
        material={ materials.Birch_Wood_Flooring__English }
        position={ [-0.321, 1.56, 0] }
        rotation={ [-Math.PI / 2, 0, 0] }
        scale={ [2.273, 4.554, 1.5] }
      />
      <Select>
        <mesh
          geometry={ nodes.CURTAIN_2008_Material001_0.geometry }
          material={ materials['Material.001'] }
          position={ [0.416, 1.537, -4.128] }
          scale={ [0.887, 1.411, 1.411] }
        />
      </Select>
      <mesh
        geometry={ nodes.Grapes_of_Wrath_Grapes_of_Wrath_0.geometry }
        material={ materials.Grapes_of_Wrath }
        position={ [-0.911, 0.365, -0.118] }
        rotation={ [Math.PI, 0.824, -Math.PI] }
        scale={ 1.128 }
      />
      <mesh
        geometry={ nodes.Verre_Fabric_Upholstery_001a001_0.geometry }
        material={ materials['Fabric_Upholstery_001a.001'] }
        position={ [-0.818, 0.388, -0.197] }
        rotation={ [-Math.PI / 2, 0, -0.063] }
      />
      <mesh
        geometry={ nodes.Cube036_Material002_0.geometry }
        material={ materials['Material.002'] }
        position={ [-0.527, 0.087, -2.173] }
        rotation={ [-1.691, 0.115, -0.761] }
      />
      <mesh
        geometry={ nodes.Circle005_Leather_Fabric_01_0.geometry }
        material={ materials.Leather_Fabric_01 }
        position={ [-2.563, 1.363, -2.933] }
        rotation={ [-Math.PI / 2, 0, -0.829] }
      />
      <mesh
        geometry={ nodes['Glass_Coffee_Cup_-_Glass_0'].geometry }
        material={ materials.PaletteMaterial002 }
        position={ [-0.844, 0.394, -0.77] }
        rotation={ [-Math.PI / 2, 0, 0.721] }
        scale={ 1.465 }
      />
      <mesh
        geometry={ nodes['Foam_Coffee_Cup_-_Foam_0'].geometry }
        material={ materials['Coffee_Cup_-_Foam'] }
        position={ [-0.844, 0.377, -0.77] }
        rotation={ [-Math.PI / 2, 0, 0.721] }
        scale={ 1.465 }
      />
      <mesh
        geometry={ nodes['Straw_basket-02_rattan_0'].geometry }
        material={ materials.rattan }
        position={ [-0.823, 0.087, 0.62] }
        rotation={ [-Math.PI / 2, 0, 0.608] }
        scale={ 1.576 }
      />
      <mesh
        geometry={ nodes.SM_Jug_of_flowers_A001_Material007_0.geometry }
        material={ materials['Material.007'] }
        position={ [-1.086, 0.616, -0.922] }
        rotation={ [-1.547, 0.42, -3.139] }
        scale={ [1.576, 1.263, 2.462] }
      />
      <mesh
        geometry={ nodes.Cube021_Material009_0.geometry }
        material={ materials['Material.009'] }
        position={ [-0.999, 0.333, -0.539] }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.Plane001_Material013_0.geometry }
        material={ materials['Material.013'] }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.Sphere_Material003_0.geometry }
        material={ materials['Material.003'] }
        position={ [-1.087, 0.416, -0.909] }
        rotation={ [-Math.PI / 2, 0, 0] }
        scale={ [1.431, 1.431, 1.212] }
      />
      <mesh
        geometry={ nodes.Sphere001_Leather_Fabric_01002_0.geometry }
        material={ materials['Leather_Fabric_01.002'] }
        position={ [-0.392, 2.398, -0.901] }
        rotation={ [-Math.PI / 2, 0, 0] }
        scale={ [0.316, 0.316, 0.161] }
      />
      <mesh
        geometry={ nodes.Plane002_Tecido005_0.geometry }
        material={ materials['Tecido.005'] }
        position={ [-1.749, 1.187, -0.183] }
        rotation={ [-2.746, -0.034, 2.073] }
        scale={ [0.434, 0.788, 0.788] }
      />
      <mesh
        geometry={ nodes.Plane_Material021_0.geometry }
        material={ materials['Material.021'] }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.NurbsPath_Material008_0.geometry }
        material={ materials['Material.008'] }
        rotation={ [-Math.PI / 2, 0, 0] }
      />
      <mesh
        geometry={ nodes.Plane003_Material004_0.geometry }
        material={ materials['Material.004'] }
        position={ [-0.146, 1.604, -6.908] }
        scale={ [3.936, 2.621, 1.639] }
      />
      <mesh
        geometry={ nodes.Cube034_Fabric001_0.geometry }
        material={ materials['Fabric.001'] }
        position={ [-0.527, 0.087, -2.173] }
        rotation={ [-0.121, -0.765, 3.058] }
      />
    </group>
  );
}

useGLTF.preload('/scene-transformed.glb');