import Hero from "../components/Hero/Hero";
import Detail from "../components/Detail/Detail";
import About from "../components/About/About";
import Events from "../components/Events/Events";
import Video from "../components/Video/Video";
import Gallery from "../components/Gallery/Gallery";
import Volunteer from '../components/Volunteer/Volunteer';
import AbtVolunteer from "../components/AbtVolunteer/AbtVolunteer";
import Contact from '../components/contact/Contact';

export default function Home() {
  return (
   <>
    <Hero />
    <Detail />
    <About />
    <Events />
    <Video />  
    <Gallery />
    <Volunteer />
    <AbtVolunteer />
    <Contact />
   </>
  );
}
