import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Color, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { path } from '../../lib/paths';
export function MechanicalPart({
  name,
  selected = false,
  model = '/models/mechanical-parts.glb',
  ...props
}: { name: string; selected?: boolean; model?: string } & Record<string, any>) {
  const { scene } = useGLTF(path(model), path('/draco/'));
  const object = useMemo(() => {
    const original = scene.getObjectByName(name);
    if (!original) throw new Error(`Missing mechanical asset: ${name}`);
    const copy = original.clone(true);
    copy.traverse((child: Object3D) => {
      if (!(child instanceof Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = (Array.isArray(child.material) ? child.material : [child.material]).map(
        (m: MeshStandardMaterial) => {
          const material = m.clone();
          material.envMapIntensity = 1.1;
          // Boolean-cut planar gear webs must not interpolate normals across bores.
          if (name.startsWith('Gear')) material.flatShading = true;
          return material;
        },
      );
      child.material = Array.isArray(child.material) ? materials : materials[0];
    });
    return copy;
  }, [scene, name]);
  useEffect(() => {
    object.traverse((o) => {
      if (o instanceof Mesh) {
        for (const m of Array.isArray(o.material) ? o.material : [o.material])
          if (m instanceof MeshStandardMaterial) {
            m.emissive = new Color(selected ? '#c86626' : '#000000');
            m.emissiveIntensity = selected ? 0.14 : 0;
          }
      }
    });
  }, [object, selected]);
  useEffect(
    () => () =>
      object.traverse((o) => {
        if (o instanceof Mesh)
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
      }),
    [object],
  );
  return <primitive object={object} {...props} />;
}
