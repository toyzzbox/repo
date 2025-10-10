import Logo from '@/components/(frontend)/header/Logo'
import Cart from '../(frontend)/Cart'

const Header = () => {
  return (
    <div className="bg-orange-400">
        <div className="flex justify-around">
            <Logo/>
            <div>
                Güvenli Ödeme
            </div>
            <div>
                <Cart/>
            </div>
        </div>
    </div>
  )
}

export default Header