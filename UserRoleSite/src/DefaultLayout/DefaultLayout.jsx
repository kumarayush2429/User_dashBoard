import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import GlobalProvider from '../GlobalContext/GlobalProvider'

const DefaultLayout = () => {
    return (
        <GlobalProvider>
            <Header />
            <main className='min-vh-100'>
                <Outlet />
            </main>
            <Footer />
        </GlobalProvider>
    )
}

export default DefaultLayout
