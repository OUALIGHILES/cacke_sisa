"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, Sparkles } from "@react-three/drei"
import * as THREE from "three"

function CakeLayer({ 
  position, 
  radius, 
  height, 
  color 
}: { 
  position: [number, number, number]
  radius: number
  height: number
  color: string 
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.1}
      />
    </mesh>
  )
}

function FrostingRing({ 
  position, 
  radius, 
  color 
}: { 
  position: [number, number, number]
  radius: number
  color: string 
}) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.08, 16, 64]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.4} 
        metalness={0.05}
      />
    </mesh>
  )
}

function Candle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
        <meshStandardMaterial color="#fff8e7" roughness={0.5} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 0.28, 0]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff6600" 
          emissiveIntensity={2}
        />
      </mesh>
      {/* Flame glow */}
      <pointLight 
        position={[0, 0.3, 0]} 
        intensity={0.5} 
        color="#ffaa00" 
        distance={1}
      />
    </group>
  )
}

function Decoration({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.3}
      />
    </mesh>
  )
}

function BirthdayCake() {
  const groupRef = useRef<THREE.Group>(null)
  const rotationRef = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      rotationRef.current += delta * 0.2
      groupRef.current.rotation.y = rotationRef.current
    }
  })

  const pinkFrosting = "#f8a5c2"
  const creamColor = "#fff5eb"
  const decorationGold = "#d4af37"

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* Base plate */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[1.6, 1.6, 0.08, 64]} />
          <meshStandardMaterial 
            color={decorationGold} 
            roughness={0.2} 
            metalness={0.8}
          />
        </mesh>

        {/* Bottom layer - largest */}
        <CakeLayer 
          position={[0, 0.35, 0]} 
          radius={1.3} 
          height={0.6} 
          color={creamColor} 
        />
        <FrostingRing position={[0, 0.65, 0]} radius={1.3} color={pinkFrosting} />
        
        {/* Middle layer */}
        <CakeLayer 
          position={[0, 0.95, 0]} 
          radius={1.0} 
          height={0.5} 
          color={creamColor} 
        />
        <FrostingRing position={[0, 1.2, 0]} radius={1.0} color={pinkFrosting} />
        
        {/* Top layer - smallest */}
        <CakeLayer 
          position={[0, 1.45, 0]} 
          radius={0.7} 
          height={0.4} 
          color={creamColor} 
        />
        
        {/* Top frosting decoration */}
        <mesh position={[0, 1.65, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.68, 0.72, 0.06, 64]} />
          <meshStandardMaterial 
            color={pinkFrosting} 
            roughness={0.3} 
            metalness={0.05}
          />
        </mesh>

        {/* Decorative swirls on top */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh 
              key={i} 
              position={[
                Math.cos(rad) * 0.45, 
                1.72, 
                Math.sin(rad) * 0.45
              ]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial 
                color={pinkFrosting} 
                roughness={0.3}
              />
            </mesh>
          )
        })}

        {/* Candles */}
        <Candle position={[0, 1.85, 0]} />
        <Candle position={[0.2, 1.85, 0.2]} />
        <Candle position={[-0.2, 1.85, 0.2]} />
        <Candle position={[0.2, 1.85, -0.2]} />
        <Candle position={[-0.2, 1.85, -0.2]} />

        {/* Gold decorations around layers */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <Decoration 
              key={`bottom-${i}`}
              position={[
                Math.cos(rad) * 1.35, 
                0.35, 
                Math.sin(rad) * 1.35
              ]}
              color={decorationGold}
            />
          )
        })}

        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <Decoration 
              key={`middle-${i}`}
              position={[
                Math.cos(rad) * 1.05, 
                0.95, 
                Math.sin(rad) * 1.05
              ]}
              color={pinkFrosting}
            />
          )
        })}

        {/* Rose decorations */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <group 
              key={`rose-${i}`}
              position={[
                Math.cos(rad) * 0.75, 
                1.45, 
                Math.sin(rad) * 0.75
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial 
                  color="#e84393" 
                  roughness={0.4}
                />
              </mesh>
            </group>
          )
        })}
      </group>
    </Float>
  )
}

export default function Cake3D() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#fdf2f8"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffd1dc" />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="#ffeaa7" />
        
        {/* Sparkles effect */}
        <Sparkles 
          count={50} 
          scale={5} 
          size={2} 
          speed={0.3} 
          color="#d4af37"
        />
        
        <BirthdayCake />
        
        <Environment preset="studio" />
      </Canvas>
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  )
}
