<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Card } from "$lib/components/ui/card";
    import {Alert, AlertDescription, AlertTitle,} from "$lib/components/ui/alert"

    import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-svelte";
    import { onMount } from "svelte";
    import { gsap } from 'gsap/dist/gsap.js';
    import { auth } from "$lib/firestuff.js";
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
    import { GAUTH } from "$lib/verify.js";



    interface emailRequestError {
        code: String
    }
    let email = $state("");
    let password = $state("");
    let errorMessage: emailRequestError = $state({code:""});

    async function signUpWithEmail() {
        errorMessage = {code:""}; // Reset error message
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = {code:"Email already in use"};
                    break;
                case 'auth/invalid-email':
                    errorMessage = {code:"Invalid email address"};
                    break;
                case 'auth/weak-password':
                    errorMessage = {code:"Password should be at least 6 characters"};
                    break;
                default:
                    errorMessage = {code:error.code};
            }
        }
    }

    onMount(() => {
        // Auth state observer
        auth.onAuthStateChanged((user) => {
            if (user) {
                location.href = "/dashboard";
            }
        });

        // Animation setup
        gsap.set(".login-card", { opacity: 1 });
        gsap.set(".login-element", {
            opacity: 0,
            y: 20
        });

        gsap.to(".login-element", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
        });


    });
</script>

<div class="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#2b1511] flex items-center justify-center" >
    <!-- Interactive background grid -->
    <div 
        class="grid-background absolute inset-0 bg-[linear-gradient(to_right,#db4a2b1a_1px,transparent_1px),linear-gradient(to_bottom,#db4a2b1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transition-transform duration-300"
    ></div>

    <Card class="login-card w-full max-w-md mx-4 p-8 bg-black/40 backdrop-blur-xl border border-[#db4a2b]/20 hover:border-[#db4a2b]/40 transition-all duration-500">
        <div class="text-center mb-8">
            <img src="../Learnique.svg" alt="Learnique" class="login-element h-12 w-auto mx-auto mb-6"/>
            <h2 class="login-element text-2xl font-bold bg-gradient-to-r from-[#db4a2b] to-[#e86547] bg-clip-text text-transparent">
                Welcome Back
            </h2>
        </div>

        <div class="space-y-6">
        
            {#if errorMessage.code}
            <Alert variant="destructive">
                <AlertCircle class="h-4 w-4 " />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>
                    {errorMessage.code}
                </AlertDescription>
              </Alert>
        {/if}
            <div class="login-element relative ">
                <Mail class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                    type="email" 
                    bind:value={email}
                    placeholder="Email" 
                    class="ring-offset-transparent pl-10 bg-black/30 border-[#db4a2b]/20 text-white placeholder:text-gray-400 focus:border-[#db4a2b] hover:border-[#b33a22]/40 transition-all "
                />
            </div>

            <div class="login-element relative ">
                <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                type="password"
                bind:value={password}
                placeholder="Password"
                class="ring-offset-transparent pl-10 bg-black/30 border-[#db4a2b]/20 text-white placeholder:text-gray-400 focus:border-[#db4a2b] hover:border-[#b33a22]/40 transition-all "
            />
            
            </div>

            <Button 
                class="login-element w-full bg-[#db4a2b] hover:bg-[#b33a22] transform hover:scale-105 transition-all duration-300"
                onclick={signUpWithEmail}
            >
                Sign Up <ArrowRight class="ml-2 w-4 h-4" />
            </Button>

            <div class="login-element relative">
                <div class="flex items-center justify-center gap-3 my-4">
                    <div class="h-px flex-1 bg-gray-600/50"></div>
                    <span class="text-sm text-gray-400">or</span>
                    <div class="h-px flex-1 bg-gray-600/50"></div>
                </div>

                <Button 
                variant="outline" 
                onclick={GAUTH}
                class="w-full text-white/75 hover:text-white/95 border-[#db4a2b]/20 hover:border-[#db4a2b]/40 bg-black/30 hover:bg-black/50 transform hover:scale-105 transition-all duration-300"
            >
                <img src="/google.svg" alt="Google" class="w-5 h-5 mr-2" />
                Sign in with Google
            </Button>
            </div>

            <div class="login-element flex justify-between text-sm">
                <a href="/auth/forgot-password" class="text-[#db4a2b] hover:text-[#e86547] transition-colors">
                    Forgot Password?
                </a>
                <a href="/auth/login" class="text-[#db4a2b] hover:text-[#e86547] transition-colors">
                    Login to an existing account
                </a>
            </div>
        </div>
    </Card>
</div>

<style>
  

    /* Only hide login elements initially, not the card */
    :global(.login-element) {
        opacity: 0;
    }

    :global(.login-card) {
        box-shadow: 0 0 40px rgba(219, 74, 43, 0.1);
    }
    
    /* Add focus styles for input elements */
    :global(.login-element input:focus) {
        outline: none; /* Remove default outline */
        box-shadow: 0 0 0 2px rgba(219, 74, 43, 0.5); /* Add a custom focus outline */
    }
</style>
