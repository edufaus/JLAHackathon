<script lang="ts">
    import AuthManager from "$lib/components/other/AuthManager.svelte";
    import { auth, db } from '$lib/firestuff.js';
    import { doc, setDoc, collection } from 'firebase/firestore';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Card } from "$lib/components/ui/card";

    import { gsap } from 'gsap/dist/gsap.js';
    import { Calendar } from "lucide-svelte";
    import { format } from 'date-fns';

    let user: any;
    let phoneNumber = '';
    let fullName = '';
    let address = '';
    let birthDate = '';
    let loading = false;
    let error = '';



    onDestroy(() => {
        // unsubscribe();
    });

    onMount(() => {
           auth.onAuthStateChanged(async (usr) => { 
                user = usr;
           })

        // Animation setup
        gsap.set(".profile-card", { opacity: 1 });
        gsap.set(".profile-element", {
            opacity: 0,
            y: 20
        });

        gsap.to(".profile-element", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
        });
    });

    async function handleSubmit() {
        try {
            console.log(user)
            loading = true;
            error = '';

            const userDoc = doc(db, 'Users', user.uid);
            await setDoc(userDoc, {
                uid: user.uid,
                email: user.email,
                phoneNumber: phoneNumber,
                fullName: fullName,
                address: address,
                birth: birthDate,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                isAdmin: false
            });

            // Initialize emotions collection structure
            const emotionsDoc = doc(db, 'Emotions', user.uid);
            await setDoc(emotionsDoc, {
                userId: user.uid,
                createdAt: new Date().toISOString()
            });

            goto('/dashboard');
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    // Format phone number as user types
    function formatPhoneNumber(value: string) {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return cleaned;
    }

    $: phoneNumber = formatPhoneNumber(phoneNumber);
</script>

<AuthManager />
<div class="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#8B5CF6] flex items-center justify-center">
    <!-- Interactive background grid -->
    <div
        class="grid-background absolute inset-0 bg-[linear-gradient(to_right,#8B5CF61a_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF61a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transition-transform duration-300"
    ></div>

    <Card class="profile-card w-full max-w-md mx-4 p-8 bg-black/40 backdrop-blur-xl border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all duration-500">
        <div class="text-center mb-8">
            <h2 class="profile-element text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#9f75ff] bg-clip-text text-transparent">
                Complete Your Profile
            </h2>
        </div>

        <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="profile-element relative">
                <Input
                    type="text"
                    bind:value={fullName}
                    placeholder="Full Name"
                    required
                    class="ring-offset-transparent bg-black/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-400 focus:border-[#8B5CF6] hover:border-[#8B5CF6]/40 transition-all"
                />
            </div>

            <div class="profile-element relative">
                <Input
                    type="tel"
                    bind:value={phoneNumber}
                    placeholder="(123) 456-7890"
                    inputmode="numeric"
                    maxlength="14"
                    required
                    class="ring-offset-transparent bg-black/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-400 focus:border-[#8B5CF6] hover:border-[#8B5CF6]/40 transition-all"
                />
            </div>

            <div class="profile-element relative">
                <div class="relative">
                    <Calendar class="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                        type="date"
                        bind:value={birthDate}
                        required
                        class="ring-offset-transparent bg-black/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-400 focus:border-[#8B5CF6] hover:border-[#8B5CF6]/40 transition-all [color-scheme:dark]"
                    />
                </div>
            </div>

            <div class="profile-element relative">
                <Input
                    type="text"
                    bind:value={address}
                    placeholder="Address"
                    required
                    class="ring-offset-transparent bg-black/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-400 focus:border-[#8B5CF6] hover:border-[#8B5CF6]/40 transition-all"
                />
            </div>

            {#if error}
                <div class="profile-element text-red-500 text-sm text-center">{error}</div>
            {/if}

            <Button
                type="submit"
                disabled={loading}
                class="profile-element w-full bg-[#8B5CF6] hover:bg-[#7c4feb] transform hover:scale-105 transition-all duration-300"
            >
                {#if loading}
                    Creating Profile...
                {:else}
                    Create Profile
                {/if}
            </Button>
        </form>
    </Card>
</div>

<style>
    /* Only hide profile elements initially, not the card */
    :global(.profile-element) {
        opacity: 0;
    }

    :global(.profile-card) {
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.1);
    }
    
    /* Add focus styles for input elements */
    :global(.profile-element input:focus) {
        outline: none;
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5);
    }
</style>