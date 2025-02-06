<script >
    import { userStore } from '$lib/stores/userStore.js';
    import { doc, getDoc } from 'firebase/firestore';
    import { db,auth } from '$lib/firestuff.js';
    import { onMount } from 'svelte';

    onMount(async () => {
        auth.onAuthStateChanged(async (usr) => {


            if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    // console.log(docSnap)
                    if (docSnap.exists()) {

                        userStore.set(docSnap.data());
                    } else {
                        if (!location.href.includes("/auth/createAccount") ) {
                            location.href = "/auth/createAccount";
                        }
                        
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                if (!["/signup", "/login"].includes(location.pathname)) {
                    location.href = "/";
                }
            }
        });
    });

    
</script>