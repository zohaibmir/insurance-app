import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Trygghet för dig och din familj – när det verkligen behövs
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
          Vi erbjuder försäkringslösningar som ger dig ekonomisk trygghet i livets mest oväntade stunder.
        </p>
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="En leende familj i ett ljust och harmoniskt hem"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Livförsäkring */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link href="/livforsakring" className="block mb-4">
            <h2 className="text-xl font-semibold mb-4">Livförsäkring</h2>
            <p className="text-sm text-gray-600 mb-4">
              &quot;Skydda dina närmaste – idag och imorgon&quot;
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Med vår livförsäkring kan du säkerställa att din familj är ekonomiskt tryggad om något oväntat skulle hända dig. Det är en enkel men kraftfull investering i dina nära och käras framtid. Välj den försäkringsnivå som passar din livssituation och skapa ro i sinnet för dig och din familj.
            </p>
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Två händer som håller varandra, symboliserande omsorg och trygghet"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Link>
          <div className="flex space-x-4">
            <Link href="/livforsakring" className="btn-apple">
              Läs mer
            </Link>
            <Link href="/livforsakring/kop" className="btn-apple btn-apple-primary">
              Köp nu
            </Link>
          </div>
        </div>

        {/* Inkomstbortfallsförsäkring */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Link href="/inkomstbortfall" className="block mb-4">
            <h2 className="text-xl font-semibold mb-4">Inkomstbortfallsförsäkring</h2>
            <p className="text-sm text-gray-600 mb-4">
              &quot;Behåll ekonomisk stabilitet – även vid sjukdom eller arbetslöshet&quot;
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Vår inkomstbortfallsförsäkring hjälper dig att täcka upp för uteblivna inkomster när livet tar en oväntad vändning. Med denna försäkring kan du fortsätta leva som vanligt även om du blir sjukskriven eller förlorar jobbet. Trygghet och kontinuitet – när det behövs som mest.
            </p>
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="En arbetsplats hemma, där en kopp kaffe och en laptop symboliserar balans och kontroll i vardagen"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Link>
          <div className="flex space-x-4">
            <Link href="/inkomstbortfall" className="btn-apple">
              Läs mer
            </Link>
            <Link href="/inkomstbortfall/kop" className="btn-apple btn-apple-primary">
              Köp nu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-8 text-center">Vad våra kunder säger</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">
              &quot;Tack vare livförsäkringen kunde vi fokusera på familjen och vår framtid, även efter en svår förlust.&quot;
            </p>
            <p className="text-sm font-semibold">– Anna H., kund sedan 2021</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-4">
              &quot;Inkomstbortfallsförsäkringen räddade vår ekonomi när jag blev sjukskriven. Rekommenderas varmt!&quot;
            </p>
            <p className="text-sm font-semibold">– Erik L., småföretagare</p>
          </div>
        </div>
      </section>
    </div>
  );
}