import { redirect } from 'next/navigation'

// /malik eski URL — kalıcı olarak /malik-giris adresine yönlendir
export default function MalikRedirect() {
  redirect('/malik-giris')
}
