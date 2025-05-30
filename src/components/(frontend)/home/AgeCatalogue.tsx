import Image from "next/image"


const AgeCatalogue = () => {
  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto pt-3">
         <Image
        src="/0-1yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
       <Image
        src="/1-3yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
       <Image
        src="/3-5yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
       <Image
        src="/5-8yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
       <Image
        src="/8-13yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
       <Image
        src="/13yas.jpg"
        width={190}
        height={190}
        alt="Picture of the author"
      />
    </div>
  )
}

export default AgeCatalogue