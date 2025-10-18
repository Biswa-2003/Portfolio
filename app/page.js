
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';

import Footer from './components/Footer';

export default function Page(){
  return (
    <>
      <Navbar/>
      <Hero/>
      <Skills/>
      <Projects/>
      <Experience/>
    
      <Footer/>
    </>
  );
}
