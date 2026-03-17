"use client"

import dynamic from "next/dynamic"

const Cake3D = dynamic(() => import("@/components/cake-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center gradient-pink rounded-3xl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading 3D Cake...</p>
      </div>
    </div>
  ),
})

export default function Cake3DWrapper() {
  return <Cake3D />
}
