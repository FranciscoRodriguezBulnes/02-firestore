import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../firebaseConfig";
import router from "../router";
import { useDatabaseStore } from "./database";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),
  actions: {
    async registerUser(email, password) {
      this.loadingUser = true;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // this.userData = { email: user.email, uid: user.uid };
        await sendEmailVerification(auth.currentUser);
        router.push("/login");
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async updateUser(displayName, imagen) {
      // console.log(displayName);
      // console.log("Antes:", auth.currentUser.displayName);
      this.loadingUser = true;
      try {
        if (imagen) {
          const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
          await uploadBytes(storageRef, imagen.originFileObj);
          const photoURL = await getDownloadURL(storageRef);
          await updateProfile(auth.currentUser, {
            // displayName: displayName,
            photoURL: photoURL,
          });
        }

        // this.loadingUser = true;
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          // photoURL: photoURL,
        });
        this.setUser(auth.currentUser);
        // console.log("Después:", auth.currentUser.displayName);
        // console.log("Después Todo el Objeto:", auth.currentUser);
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async setUser(user) {
      try {
        const docRef = doc(db, "users", user.uid);
        // const docSnap = await getDoc(docRef);

        this.userData = {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        await setDoc(docRef, this.userData);
      } catch (error) {
        console.log(error);
      }
    },

    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        await this.setUser(user);

        router.push("/");
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
      console.log(
        "Usuario actual:",
        auth.currentUser?.email,
        auth.currentUser?.uid
      );
    },
    async logoutUser() {
      const databaseStore = useDatabaseStore();
      databaseStore.$reset();
      try {
        router.push("/login");
        await signOut(auth);
        // this.userData = null;
      } catch (error) {
        console.log(error);
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          async (user) => {
            if (user) {
              console.log(user);
              // await this.setUser(user);

              this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL || "/ImagenFrancisco.JPG",
              };
            } else {
              this.userData = null;
              const databaseStore = useDatabaseStore();
              databaseStore.$reset();
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        unsuscribe();
      });
    },
  },
});
