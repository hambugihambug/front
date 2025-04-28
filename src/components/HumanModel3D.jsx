import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Color } from 'three';

function Model({ onPointClick }) {
    const { scene } = useGLTF('/models/human.glb');
    const modelRef = useRef();

    // 모델 재질 설정
    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.roughness = 0.5;
            child.material.metalness = 0.5;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={scene} ref={modelRef} scale={1.5} onClick={onPointClick} />;
}

function ErrorFallback() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
            }}
        >
            3D 모델을 불러오는데 실패했습니다.
        </div>
    );
}

export default function HumanModel3D({ symptoms, onSymptomAdd }) {
    const handleCanvasClick = (event) => {
        if (!onSymptomAdd) return;
        event.stopPropagation();
        const x = ((event.point.x + 1) / 2) * 100;
        const y = ((event.point.y + 1) / 2) * 100;
        onSymptomAdd({ x, y });
    };

    return (
        <div style={{ height: '500px', width: '100%', background: '#f8fafc', borderRadius: '8px' }}>
            <Canvas
                camera={{ position: [5, 9, 15], fov: 90 }}
                shadows
                onCreated={({ gl }) => {
                    gl.setClearColor(new Color('#f8fafc'));
                }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[10, 10, 10]}
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <Model onPointClick={handleCanvasClick} />
                </Suspense>
                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                    minDistance={2}
                    maxDistance={4}
                />
            </Canvas>

            {symptoms?.map((symptom, index) => (
                <div
                    key={index}
                    className="symptom-marker"
                    style={{
                        position: 'absolute',
                        top: `${symptom.y}%`,
                        left: `${symptom.x}%`,
                        width: '10px',
                        height: '10px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}
                    title={symptom.description}
                />
            ))}
        </div>
    );
}
