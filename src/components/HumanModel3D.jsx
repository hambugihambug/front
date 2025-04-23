// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { Suspense } from 'react';

// function Model() {
//     // 3D 모델 파일 경로 (glb 또는 gltf 파일)
//     const { scene } = useGLTF('/human_model.glb');
//     return <primitive object={scene} scale={1.5} />;
// }

// export default function HumanModel3D() {
//     return (
//         <div style={{ height: '500px', width: '100%' }}>
//             <Canvas camera={{ position: [0, 1.5, 2.5], fov: 50 }} style={{ background: '#f8fafc' }}>
//                 <ambientLight intensity={0.5} />
//                 <directionalLight position={[10, 10, 5]} intensity={1} />
//                 <Suspense fallback={null}>
//                     <Model />
//                 </Suspense>
//                 <OrbitControls enablePan={false} minDistance={2} maxDistance={5} />
//             </Canvas>
//         </div>
//     );
// }
