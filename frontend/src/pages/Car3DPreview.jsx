import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function CarModel() {
  return (
    <group rotation={[0, 0.4, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.8, 1.8]} />
        <meshStandardMaterial color="var(--accent)" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Car Top / Cabin */}
      <mesh position={[-0.2, 0.7, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 1.5]} />
        <meshStandardMaterial color="var(--text)" roughness={0.1} metalness={0.9} transparent opacity={0.9} />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.76, 0, 0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
        <meshStandardMaterial color="var(--bg-card)" emissive="var(--bg-card)" emissiveIntensity={2} />
      </mesh>
      <mesh position={[1.76, 0, -0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
        <meshStandardMaterial color="var(--bg-card)" emissive="var(--bg-card)" emissiveIntensity={2} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.76, 0, 0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
        <meshStandardMaterial color="var(--accent)" emissive="var(--accent)" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-1.76, 0, -0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.4]} />
        <meshStandardMaterial color="var(--accent)" emissive="var(--accent)" emissiveIntensity={1.5} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-1.1, -0.4, 1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="var(--text)" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, -0.4, 1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="var(--text)" roughness={0.8} />
      </mesh>
      <mesh position={[-1.1, -0.4, -1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="var(--text)" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, -0.4, -1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="var(--text)" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Car3DPreview() {
  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "1000px", 
        padding: "20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        <div style={{ marginBottom: "30px" }}>
          <span style={{ 
            background: "rgba(59, 130, 246, 0.2)", 
            color: "var(--text)", 
            padding: "8px 20px", 
            borderRadius: "30px",
            fontWeight: "700",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "inline-block",
            marginBottom: "15px",
            border: "1px solid var(--border)"
          }}>
            Interactive 3D Engine
          </span>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "10px",
            lineHeight: "1.2"
          }}>
            3D Vehicle Preview
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Interact with the digital twin of your selected vehicle. Drag to rotate and zoom to inspect every angle before you book.
          </p>
        </div>

        <div className="auth-card" style={{ 
          width: "100%", 
          padding: "10px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
        }}>
          {/* Subtle glow behind canvas */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "50%", height: "50%", background: "var(--accent)", filter: "blur(120px)", opacity: 0.15, zIndex: 0
          }} />

          <div style={{ 
            height: "500px", 
            width: "100%", 
            background: "var(--text)", 
            borderRadius: "16px",
            position: "relative",
            zIndex: 1,
            cursor: "grab"
          }}>
            <Canvas camera={{ position: [5, 3, 6], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="var(--accent)" />
              
              <CarModel />
              
              <ContactShadows position={[0, -0.85, 0]} opacity={0.7} scale={10} blur={2} far={4} />
              <OrbitControls enablePan={false} minDistance={4} maxDistance={12} maxPolarAngle={Math.PI / 2 - 0.05} />
            </Canvas>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "10px", 
            padding: "20px 0 10px 0",
            color: "var(--text)",
            fontSize: "1rem"
          }}>
            <span style={{ fontSize: "1.2rem" }}>️</span>
            <span>Left Click to Rotate</span>
            <span style={{ margin: "0 10px", color: "rgba(255, 255, 255, 0.2)" }}>|</span>
            <span style={{ fontSize: "1.2rem" }}>️</span>
            <span>Scroll to Zoom</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Car3DPreview;