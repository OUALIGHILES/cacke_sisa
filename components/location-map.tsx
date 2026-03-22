"use client"

export default function LocationMap() {
  // Ait Anane, Darguina, Bejaia, Algeria
  const lat = 36.7089
  const lng = 4.9472

  return (
    <div className="relative w-full h-[250px] rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
        className="w-full h-full border-0"
        title="SISA_Cake Location"
        loading="lazy"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:opacity-90 transition-opacity"
      >
        Open in Maps
      </a>
    </div>
  )
}
