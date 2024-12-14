import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <Link href="/" className="flex items-center mr-auto">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smooother_wordmark_black-b3urxjH5U9cAVB4r8ayAyiKVBnsJtu.svg"
            alt="Smooother Logo"
            width={150}
            height={52}
            priority
          />
          <span className="sr-only">Försäkringsbolaget</span>
        </Link>
        <nav>
          <ul className="flex space-x-8">
            <li><Link href="/" className="hover:text-gray-600 transition-colors">Hem</Link></li>
            <li><Link href="/produkter" className="hover:text-gray-600 transition-colors">Produkter</Link></li>
            <li><Link href="/om-oss" className="hover:text-gray-600 transition-colors">Om oss</Link></li>
            <li><Link href="/kontakt" className="hover:text-gray-600 transition-colors">Kontakt</Link></li>
            <li><Link href="/userdashboard" className="hover:text-gray-600 transition-colors">Dashboard</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

