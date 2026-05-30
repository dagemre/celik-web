import { redirect } from 'next/navigation'

// /malik-giris eski URL — kalıcı olarak /malik adresine yönlendir
export default function MalikGirisRedirect() {
  redirect('/malik')
}
