import Logo from '@/components/(frontend)/header/Logo'

const Header = () => {
  return (
    <div className="bg-orange-400 items-center">
        <div className="flex justify-between">
            <Logo/>
            <div>
              <h1 className="font-bold text-white text-3xl"> Güvenli Ödeme</h1> 
            </div>
            <div className="text-2xl font-bold text-white">
                cart
            </div>
        </div>
    </div>
  )
}

export default Header