// https://web3auth.io/docs/troubleshooting/metro-issues?fbclid=IwZXh0bgNhZW0CMTAAAR1918MuioBRn3SlOqPK9tejqVrsFeKNwjN1_PiWDAE2dcAVC9drPqxdDME_aem_Pkh9J2lWTesmr_gG0YO44A
global.Buffer = require("buffer").Buffer;

import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

renderRootComponent(App);
