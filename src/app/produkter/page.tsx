export default function Products() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Våra Produkter</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Livförsäkring</h2>
          <p className="text-gray-600 mb-4">
            Skydda dina nära och kära ekonomiskt vid oförutsedda händelser. Vår livförsäkring ger trygghet när det behövs som mest.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Flexibla försäkringsbelopp</li>
            <li>Snabb och enkel ansökningsprocess</li>
            <li>Konkurrenskraftiga premier</li>
          </ul>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Inkomstbortfallsförsäkring</h2>
          <p className="text-gray-600 mb-4">
            Säkerställ din inkomst vid sjukdom eller arbetslöshet. Denna försäkring ger dig ekonomisk stabilitet i osäkra tider.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Anpassningsbar ersättningsnivå</li>
            <li>Omfattande skydd vid olika scenarier</li>
            <li>Snabb handläggning av ärenden</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

