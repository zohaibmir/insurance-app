import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Min Försäkringsöversikt</h1>
      
      <div className="grid gap-6">
        {/* Livförsäkring Card */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-2">Livförsäkring</CardTitle>
              <CardDescription className="text-lg mb-4">
                Skydda dina närmaste - idag och imorgon.
              </CardDescription>
              <ul className="space-y-4 mb-6">
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Trygghet för din familj: Ge dina nära och kära ekonomisk säkerhet om något skulle hända dig. Vår livförsäkring hjälper till att täcka lån, boendekostnader och andra utgifter.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Flexibla lösningar: Anpassa försäkringen efter dina behov och din livssituation. Välj mellan olika försäkringsbelopp och betalningsplaner som passar dig.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Snabb och enkel ansökan: Ansök online på några minuter och få snabbt besked. Ingen onödig administration – vi gör det enkelt för dig.</span>
                </li>
              </ul>
              <div className="flex gap-4">
                <Button>Ansök nu</Button>
                <Button variant="outline">Mer information</Button>
              </div>
            </CardContent>
            <div className="relative min-h-[300px] bg-purple-100">
              <Image
                src="/placeholder.svg"
                alt="Familj tillsammans"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Card>

        {/* Inkomstbortfallsförsäkring Card */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-2">Inkomstbortfallsförsäkring</CardTitle>
              <CardDescription className="text-lg mb-4">
                Behåll din ekonomiska stabilitet.
              </CardDescription>
              <ul className="space-y-4 mb-6">
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Ekonomisk trygghet vid oväntade händelser: Skydda din inkomst om du skulle bli sjukskriven eller arbetslös. Vår försäkring hjälper dig att behålla din livsstil även i tuffa tider.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Anpassad efter dina behov: Välj själv försäkringsbelopp och omfattning för att skapa en lösning som passar just din ekonomiska situation.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Snabb och smidig ansökan: Teckna försäkringen enkelt online och få ett tydligt besked direkt. Vi gör det tryggt och enkelt att planera för framtiden.</span>
                </li>
              </ul>
              <div className="flex gap-4">
                <Button>Ansök nu</Button>
                <Button variant="outline">Mer information</Button>
              </div>
            </CardContent>
            <div className="relative min-h-[300px] bg-purple-100">
              <Image
                src="/placeholder.svg"
                alt="Kreditkort design"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

