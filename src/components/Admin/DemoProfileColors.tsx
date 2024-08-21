import React from "react";
import { useColorMode } from "@chakra-ui/react";
import profilesData from "@/data/profilesData";
import { Profile } from "@/atoms/demoProfileAtom";

const ColorTestDisplay: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2rem",
      }}
    >
      {profilesData.map((profile: Profile) => (
        <div
          key={profile.name}
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          <h2>{profile.name}</h2>
          <div style={{ padding: "2rem" }}>
            <div
              style={{
                backgroundColor:
                  colorMode === "dark" ? profile.color : profile.color,
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            ></div>
          </div>
          <p>{colorMode === "dark" ? "Dark Background" : "Light Background"}</p>
          <p>Color: {colorMode === "dark" ? profile.color : profile.color}</p>
        </div>
      ))}
    </div>
  );
};

export default ColorTestDisplay;
