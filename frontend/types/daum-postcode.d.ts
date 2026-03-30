interface DaumPostcodeData {
  zonecode: string
  address: string
  addressEnglish: string
  addressType: 'R' | 'J'
  userSelectedType: 'R' | 'J'
  roadAddress: string
  jibunAddress: string
  buildingName: string
  apartment: 'Y' | 'N'
  bname: string
  bname1: string
  bname2: string
  sido: string
  sigungu: string
  sigunguCode: string
  query: string
}

interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void
  width?: string | number
  height?: string | number
}

interface DaumPostcode {
  new (options: DaumPostcodeOptions): { open: () => void }
}

interface Window {
  daum?: {
    Postcode: DaumPostcode
  }
}
