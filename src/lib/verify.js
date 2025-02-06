import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { browser } from "$app/environment";
import { auth } from "$lib/database.js";

export async function GAUTH() {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile"); // Access to basic profile info including name
  provider.addScope("email");
  auth.languageCode = "it";
  await signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (browser) {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      return true;
    })
    .catch((error) => {
      return false;
    });
  return true;
}
