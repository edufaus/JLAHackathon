<script lang="ts">

    import { Button } from "$lib/components/ui/button";
    import { onMount, onDestroy } from "svelte";
    import { gsap } from 'gsap/dist/gsap.js';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';
    import { userStore } from "$lib/stores/userStore";
    import LogoutButton from "$lib/components/other/LogoutButton.svelte";
    import { goto } from "$app/navigation";

    import { doc, getDoc } from 'firebase/firestore';
    import { db,auth } from '$lib/firestuff.js';
    // import Navbar from "$lib/components/navigation/Navbar.svelte";
    let user: any;
    let isLoading = true;



    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
          auth.onAuthStateChanged(async (usr) => { 
                
                  if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    // console.log(docSnap)
                    if (docSnap.exists()) {
                        user = docSnap.data();
                        if (!user.isAdmin) {
                            location.href = "/dashboard/"
                        }
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




<div class="relative min-h-screen  bg-gradient-to-br  from-black via-slate-900 to-[#2b1511] opacity-100  flex flex-col items-center justify-center">
    <LogoutButton/>
    <div class="grid-background absolute inset-0 bg-[linear-gradient(to_right,#db4a2b1a_1px,transparent_1px),linear-gradient(to_bottom,#db4a2b1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transition-transform duration-300"></div>
    <!-- <Navbar isFixed={true} navItems={[]} isGlass/> -->
    <h1 class=" translate-y-8 sm:text-6xl text-4xl font-bold mb-8 bg-gradient-to-r from-[#db4a2b] via-[#e86547] to-[#db4a2b] bg-clip-text text-transparent">Hello, {user?.fullName || 'Loading...'}</h1>

    <div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 mt-16">
        <!-- <div class="transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4 bg-black/20 border border-[#db4a2b]/20 rounded-lg p-6 backdrop-blur-md hover:border-[#db4a2b] transition-all duration-500 w-52">
            <h3 class="text-xl font-bold text-white mb-2">Documents</h3>
            <p class="text-white mb-4">Access your documents and files here.</p>
            <Button class="bg-[#db4a2b] text-white hover:bg-[#b33a22] transition-all duration-300" onclick={()=>{goto("/docs/dashboard")}}>Enter</Button>
        </div> -->

        <div class="transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4 bg-black/20 border border-[#db4a2b]/20 rounded-lg p-6 backdrop-blur-md hover:border-[#db4a2b] transition-all duration-500 w-52">
            <h3 class="text-xl font-bold text-white mb-2">Study</h3>
            <p class="text-white mb-4">Explore study materials and resources.</p>
            <a href="/study">
                <Button class="bg-[#db4a2b] text-white hover:bg-[#b33a22] transition-all duration-300">Enter</Button>
            </a>
            
        </div>
        <div class="transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] h-1/4 bg-black/20 border border-[#db4a2b]/20 rounded-lg p-6 backdrop-blur-md hover:border-[#db4a2b] transition-all duration-500 w-52">
            <h3 class="text-xl font-bold text-white mb-2">Tutoring</h3>
            <p class="text-white mb-4">Get tutored by fellow peers who want to do their best to help you.</p>
            <a href="https://yteach.com"> <Button class="bg-[#db4a2b] text-white hover:bg-[#b33a22] transition-all duration-300">Enter</Button></a>
        </div>
    </div>
</div>