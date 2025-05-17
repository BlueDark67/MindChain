import { useEffect } from "react";
import './AboutUs.css';
import '../../Global.css';
import Bernardo from '../../../public/Creators/Bernardo.png';
import Gui from '../../../public/Creators/Gui.png';
import Jorge from '../../../public/Creators/Jorge.png';

function AboutUs() {
    useEffect(() => {
            document.title = "About Us";
            document.body.classList.add('gradient_background_BB');

            return () => {
                document.body.classList.remove('gradient_background_BB');
            };
        }, []);



  return (
    <div className="container-wrapperAboutUs">
      <h1 className="h1-aboutus">About Us</h1>
      <div className="Aboutus-pictures">
        <div className="Jorge">
            <img src={Jorge} alt="Jorge" className="Aboutus-picture" />
            <span className="Aboutus-name">Jorge Afonso Rodrigues Santos</span>
            <span className="Aboutus-role">Co-Founder</span>
            <span className="Aboutus-role">Data Analist</span>
            <span className="Aboutus-role">Full Stack Developer</span>
        </div>
        <div className="Gui"> 
            <img src={Gui} alt="Gui" className="Aboutus-picture" />
            <span className="Aboutus-name">Guilherme José Ferraz Pedro</span>
            <span className="Aboutus-role">Co-Founder</span>
            <span className="Aboutus-role">Teach Lead</span>
            <span className="Aboutus-role">Full Stack Developer</span>
        </div>
        <div className="Bernardo">
            <img src={Bernardo} alt="Bernardo" className="Aboutus-picture" />
            <span className="Aboutus-name">Bernardo Duarte Faria Pestana</span>
            <span className="Aboutus-role">Co-Founder</span>
            <span className="Aboutus-role">UX/UI Designer</span>
            <span className="Aboutus-role">Full Stack Developer</span>
        </div>
      </div>
      
      <div className="Aboutus-text">
        <h1 className="h1-aboutus-text">Our Mission</h1>
        <p className="Aboutus-text-paragraph">
            <b>MindChain</b> is more than just a digital platform it is a transformative ecosystem built to redefine the way teams and individuals brainstorm, innovate, and bring ideas to life. At its core, MindChain is designed to bridge creativity and technology, empowering users with powerful tools that streamline the process of ideation, collaboration, and execution. 
        </p>
        <p className="Aboutus-text-paragraph">
            In a world where ideas are the currency of progress, we believe that everyone should have access to a space that encourages open dialogue, structured thinking, and meaningful teamwork. MindChain was born from a desire to eliminate the barriers to creativity, offering a seamless, engaging, and intelligent environment for brainstorming. Whether you're a startup founder planning your next big move, a student working on a group project, or a remote team mapping out a product roadmap, MindChain adapts to your needs intelligently and intuitively.
        </p>
        <p className="Aboutus-text-paragraph">
            Our platform leverages real-time chatrooms for instant communication, AI-powered text generation to spark inspiration, and a thoughtfully designed user interface that prioritizes clarity and ease of use. These features are not mere add-ons; they are deeply integrated into the user experience to ensure that every brainstorming session is not just productive but also enjoyable.
        </p>
        <p className="Aboutus-text-paragraph">
            Behind MindChain is a team of passionate individuals driven by innovation, collaboration, and a relentless pursuit of excellence:
        </p>
        <p className="Aboutus-textname-paragraph">
            <b>Jorge Afonso Rodrigues Santos</b>
        </p>
        <span className="Aboutus-span-paragraph">
            <i>Co-Founder | Data Analyst & Full Stack Developer</i>
        </span>
        <p className="Aboutus-text-paragraph">
            Jorge is a data-driven strategist and an accomplished full stack developer with a sharp analytical mind and a deep understanding of modern technologies. With a strong foundation in data analytics, he brings a methodical and results-oriented approach to problem-solving, ensuring that every decision made within MindChain is informed by data and grounded in logic. His ability to interpret complex datasets and extract actionable insights has been instrumental in shaping the platform’s intelligent features, particularly in areas like AI integration and user behavior analysis. Jorge is also a skilled developer, capable of building both front-end and back-end solutions that are robust, scalable, and efficient. His vision lies in creating systems that are not only powerful, but also intuitive and user-centric.
        </p>
        <p className="Aboutus-textname-paragraph">
            <b>Guilherme José Ferraz Pedro</b>
        </p>
        <span className="Aboutus-span-paragraph">
            <i>Co-Founder | Tech Lead & Full Stack Developer</i>
        </span>
        <p className="Aboutus-text-paragraph">
            Guilherme is a highly versatile full stack developer and the technical backbone of MindChain’s infrastructure. As the Tech Lead, he oversees the platform’s architecture, ensuring that every component from real-time chat functionalities to secure authentication protocols operates seamlessly and efficiently. His deep knowledge of modern development frameworks and cloud technologies allows MindChain to deliver high-performance experiences at scale. Guilherme’s leadership extends beyond coding: he is a meticulous planner, a systems thinker, and a proactive problem-solver who ensures that the platform remains resilient, maintainable, and future-proof. His dedication to clean, sustainable code and long-term scalability is central to the reliability of MindChain.
        </p>
        <p className="Aboutus-textname-paragraph">
            <b>Bernardo Duarte Faria Pestana</b>
        </p>
        <span className="Aboutus-span-paragraph">
            <i>Co-Founder | UX/UI Designer & Full Stack Developer</i>
        </span>
        <p className="Aboutus-text-paragraph">
            Bernardo brings a rare blend of creativity and technical proficiency to MindChain. As both a UX/UI Designer and Full Stack Developer, he bridges the gap between functionality and aesthetics, crafting interfaces that are as beautiful as they are intuitive. His user-first mindset ensures that every element of the platform is designed with clarity, usability, and accessibility in mind. Bernardo’s experience in interaction design and front-end development allows him to translate complex user needs into elegant digital experiences. Beyond visuals, he contributes to the full development cycle, from conceptualization and wireframing to implementation and testing. His work is a testament to the belief that good design is not just how something looks, but how well it works for the user.
        </p>
        <p className="Aboutus-text-paragraph">
            Together, we share a collective vision: to create a tool that doesn't just facilitate brainstorming but elevates it turning abstract thoughts into concrete outcomes, nurturing collaboration across boundaries, and unlocking the full creative potential of every mind that connects through our platform.
        </p>
        <p className="Aboutus-text-paragraph">
            MindChain is not just a product. It’s a movement towards smarter ideation, empowered teams, and a future where the next big idea can come from anyone, anywhere.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;