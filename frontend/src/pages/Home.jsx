import Banner from "../components/Banner.jsx";
import Header from "../components/Header.jsx";
import SpecialityMenu from "../components/specialityMenu.jsx";
import TopDoctors from "../components/TopDoctors.jsx";

export default function Home(){
    return(
        <div>
            <Header/>
            <SpecialityMenu/>
            <TopDoctors/>
            <Banner/>
        </div>
    )
}