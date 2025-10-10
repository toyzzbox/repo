import Logo from '@/components/(frontend)/header/Logo'

const Header = () => {
  return (
    <div className="bg-orange-400">
        <div className="flex justify-between">
            <Logo/>
            <div>
                Güvenli Ödeme
            </div>
            <div>
                cart
            </div>
        </div>
    </div>
  )
}

export default Header