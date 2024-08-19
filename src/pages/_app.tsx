import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import Layout from "../components/Layout/Layout";
import { RecoilRoot } from "recoil";
import "@/styles/global.css";
import { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Represents the root component of the application, every page will be rendered inside this component
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["core", "maps", "marker", "places"],
    });

    loader.importLibrary("maps").then((google) => {
      console.log("Google Maps API loaded");
    });
    loader.importLibrary("marker").then((google) => {
      console.log("Google Maps Marker API loaded");
    });
  }, []);

  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
