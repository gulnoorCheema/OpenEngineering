import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { Point } from '../../lib/sewing';
/** Reuses a fixed tube buffer; no geometry/material allocation during playback. */
export default function ThreadTube({
  sample,
  count,
  color,
  radius = 0.018,
}: {
  sample: () => Point[];
  count: number;
  color: string;
  radius?: number;
}) {
  const geometry = useMemo(() => {
    const g = new BufferGeometry(),
      vertices = new Float32Array(count * 8 * 3),
      normals = new Float32Array(count * 8 * 3),
      indices = [];
    for (let i = 0; i < count - 1; i++)
      for (let j = 0; j < 8; j++) {
        const a = i * 8 + j,
          b = i * 8 + ((j + 1) % 8);
        indices.push(a, b, a + 8, b, b + 8, a + 8);
      }
    g.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    g.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    g.setIndex(indices);
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    const points = sample(),
      p = geometry.getAttribute('position'),
      n = geometry.getAttribute('normal');
    for (let i = 0; i < count; i++) {
      const c = points[Math.min(i, points.length - 1)],
        a = points[Math.max(0, i - 1)],
        b = points[Math.min(points.length - 1, i + 1)];
      let tx = b[0] - a[0],
        ty = b[1] - a[1],
        tz = b[2] - a[2];
      const len = Math.hypot(tx, ty, tz) || 1;
      tx /= len;
      ty /= len;
      tz /= len;
      let nx = -ty,
        ny = tx,
        nz = 0;
      let nl = Math.hypot(nx, ny);
      if (nl < 0.001) {
        nx = 1;
        ny = 0;
        nl = 1;
      }
      nx /= nl;
      ny /= nl;
      const bx = ty * nz - tz * ny,
        by = tz * nx - tx * nz,
        bz = tx * ny - ty * nx;
      for (let j = 0; j < 8; j++) {
        const angle = (j * Math.PI) / 4,
          co = Math.cos(angle),
          si = Math.sin(angle),
          x = nx * co + bx * si,
          y = ny * co + by * si,
          z = nz * co + bz * si;
        p.setXYZ(i * 8 + j, c[0] + radius * x, c[1] + radius * y, c[2] + radius * z);
        n.setXYZ(i * 8 + j, x, y, z);
      }
    }
    p.needsUpdate = true;
    n.needsUpdate = true;
  });
  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        emissive={color}
        emissiveIntensity={0.17}
      />
    </mesh>
  );
}
