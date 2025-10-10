import Logo from '@/components/(frontend)/header/Logo'
import CartCount from '@/components/(frontend)/header/CartCount'

const Header = () => {
  return (
    <div className="bg-orange-400">
        <div className="flex justify-between">
            <Logo/>
            <div>
                Güvenli Ödeme
            </div>
            <div>
                <CartCount/>
            </div>
        </div>
    </div>
  )
}

export default Header