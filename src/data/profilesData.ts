import { Profile } from "@/atoms/demoProfileAtom";
import lightenColor from "@/utils/functions/demoFunctions";

// color is against the light background: FBFDFA
// darkColor is against the dark background: 1E2D22

const profilesData: Profile[] = [
  {
    name: "Isabella the Bold Foodie",
    lightGifSrc: "/images/DemoGifs/TheFoodie_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheFoodie_Dark.gif",
    photoSrc: "/images/DemoPics/TheFoodie.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
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
    name: "Jade the Thrifty Shopper",
    lightGifSrc: "/images/DemoGifs/TheShopper_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheShopper_Dark.gif",
    photoSrc: "/images/DemoPics/TheShopper.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
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
    lightGifSrc: "/images/DemoGifs/TheArtist_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheArtist_Dark.gif",
    photoSrc: "/images/DemoPics/TheArtist.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
    color: "#fe3737",
    lightBgColor: lightenColor("#fe3737", 0.56),
    darkBgColor: lightenColor("#fe3737", 0.35),
    summary: [
      "Passionate about art and creativity",
      "Frequent visitor of theatres, museums, and art galleries",
      "Enjoys painting, sculpting, and exploring new artistic techniques",
      "Always curious about the cultural and historical aspects of art",
    ],
  },
  {
    name: "Alexi the Energetic Athlete",
    lightGifSrc: "/images/DemoGifs/TheAthlete_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheAthlete_Dark.gif",
    photoSrc: "/images/DemoPics/TheAthlete.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
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
    lightGifSrc: "/images/DemoGifs/TheCaretaker_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheCaretaker_Dark.gif",
    photoSrc: "/images/DemoPics/TheCaretaker.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
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
    lightGifSrc: "/images/DemoGifs/TheSocialite_Light.gif",
    darkGifSrc: "/images/DemoGifs/TheSocialite_Dark.gif",
    photoSrc: "/images/DemoPics/TheSocialite.png",
    pfpSrc: "/images/DemoPics/TheFoodie_PFP.png",
    color: "#AF4CFF",
    lightBgColor: lightenColor("#AF4CFF", 0.55),
    darkBgColor: lightenColor("#AF4CFF", 0.35),
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
