import { Profile } from "@/atoms/demoProfileAtom";
import lightenColor from "@/utils/functions/demoFunctions";

// color is against the light background: FBFDFA
// darkColor is against the dark background: 1E2D22

const profilesData: Profile[] = [
  {
    name: "Isabella the Bold Foodie",
    gifSrc: "/images/DemoProfile_Dark_Isabella.gif",
    photoSrc: "/images/TheFoodie.png",
    // color: "#F0A401",
    color: "#FFAF00",
    lightBgColor: lightenColor("#FFAF00", 0.6),
    darkBgColor: lightenColor("#FFAF00", 0.3),
    summary: [
      "Loves exploring new restaurants and trying exotic dishes",
      "Enjoys attending food festivals and culinary events",
      "Takes cooking classes to master new recipes",
      "Always on the lookout for the latest food trends",
    ],
  },
  {
    name: "Jade the Thrifty Connoisseur",
    gifSrc: "/images/TheConnoisseur.gif",
    photoSrc: "/images/TheConnoisseur.png",
    color: "#40F6CC",
    lightBgColor: lightenColor("#2fd7b3", 0.58),
    darkBgColor: lightenColor("#2fd7b3", 0.3),
    summary: [
      "Has a keen eye for unique and valuable thrift finds",
      "Loves shopping at flea markets and antique stores",
      "Enjoys upcycling and DIY projects",
      "Passionate about sustainable fashion and home decor",
    ],
  },
  {
    name: "Marcus the Curious Artist",
    gifSrc: "/images/TheArtist.gif",
    photoSrc: "/images/TheArtist.png",
    color: "#fe3737",
    lightBgColor: lightenColor("#fe3737", 0.56),
    darkBgColor: lightenColor("#fe3737", 0.3),
    summary: [
      "Passionate about art and creativity",
      "Frequent visitor of theatres, museums, and art galleries",
      "Enjoys painting, sculpting, and exploring new artistic techniques",
      "Always curious about the cultural and historical aspects of art",
    ],
  },
  {
    name: "Alexi the Energetic Athlete",
    gifSrc: "/images/TheAthlete.gif",
    photoSrc: "/images/TheAthlete.png",
    color: "#58abff",
    lightBgColor: lightenColor("#58abff", 0.5),
    darkBgColor: lightenColor("#58abff", 0.3),
    summary: [
      "Dedicated to maintaining a healthy and active lifestyle",
      "Spends time working out in the gym and running in parks",
      "Enjoys hiking and outdoor adventures",
      "Always looking for new fitness challenges and activities",
    ],
  },
  {
    name: "Ernesto the Caring Dad",
    gifSrc: "/images/TheDad.gif",
    photoSrc: "/images/TheDad.png",
    color: "#ff812c",
    lightBgColor: lightenColor("#ff812c", 0.5),
    darkBgColor: lightenColor("#ff812c", 0.3),
    summary: [
      "Nurturing and deeply family-oriented",
      "Enjoys grocery shopping and planning meals for the family",
      "Loves organizing and participating in family activities",
      "Always prioritizes the well-being and happiness of his children",
    ],
  },
  {
    name: "Leo the Social Engineer",
    gifSrc: "/images/TheSocialite.gif",
    photoSrc: "/images/TheSocialite.png",
    color: "#AF4CFF",
    lightBgColor: lightenColor("#AF4CFF", 0.55),
    darkBgColor: lightenColor("#AF4CFF", 0.3),
    summary: [
      "Extremely outgoing and enjoys networking at work and social events",
      "Thoroughly enjoys attending festivals, conferences, and social gatherings",
      "Skilled at connecting with new people and building relationships",
      "Always in the know about the latest social events and trends",
      "Part of the tech community and enjoys attending hackathons",
    ],
  },
];

export default profilesData;
