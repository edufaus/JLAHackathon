<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { ChevronRight, Brain, Sparkles, Zap } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { gsap } from 'gsap/dist/gsap.js';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';


    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Permanent animations for hero elements
        gsap.to(".hero-title", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });

        gsap.to(".hero-description", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });



    });
</script>

<div class="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#8B5CF6] " >
    <!-- Interactive background grid -->
    <div
        class="grid-background absolute inset-0 bg-[linear-gradient(to_right,#8B5CF61a_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF61a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transition-transform duration-300"
    ></div>

    <div class="relative">
        <!-- Navigation -->
        <nav class="container mx-auto p-6 fixed top-0 left-0 right-0 z-50">
            <div class="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-black/20 border border-white/10">
                <div class="flex items-center">
                    <img src="ReflectEd.png" alt="Learnique" class="h-12 w-auto mr-4"/>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <div class="space-x-8">
                        <a href="#features" class="text-gray-300 hover:text-[#8B5CF6] transition-colors relative group">
                            <span>Features</span>
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="#pricing" class="text-gray-300 hover:text-[#8B5CF6] transition-colors relative group">
                            <span>Pricing</span>
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="#about" class="text-gray-300 hover:text-[#8B5CF6] transition-colors relative group">
                            <span>About</span>
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            class="text-gray-300 bg-black/20 border-gray-500 hover:bg-black/40 hover:text-gray-300 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                            onclick={() => goto('/auth/login')}
                        >
                            Log in
                        </Button>
                        <Button
                            class="bg-[#8B5CF6] hover:bg-[#7c4feb]"
                            onclick={() => goto('/auth/signup')}
                        >
                            Sign up for free
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Content -->
        <div class="container mx-auto px-6 pt-64 pb-24">
            <div class="text-center">
                <h1
                    class="py-2 hero-title opacity-0 translate-y-8 text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#9f75ff] to-[#8B5CF6] bg-clip-text text-transparent"
                >
                Foster mental health through collaboration.
                <!-- Foster emotional intelligence/genuises through collaboration and reflection -->
                <!-- a Mental  -->
                </h1>
                <p
                    class="hero-description opacity-0 translate-y-8 text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                >
                    The mental health first app designed to help you be more productive and efficiency in your educational journey
                <!-- The easy-to-use AI-powered suite of applications designed to enhance your workflow, not replace it. -->
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        class="bg-[#8B5CF6] hover:bg-[#7c4feb] text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300"
                        onclick={() => goto('/auth/signup')}
                    >
                        Get Started <ChevronRight class="ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        class="text-lg px-8 py-6 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[black/50] hover:text-[#8B5CF6] bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                        onclick="location.href='https://www.canva.com/design/DAGeViTfEwc/7dHpTjMtQQnIE4lBrGfXhg/edit?utm_content=DAGeViTfEwc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton';"
                    >
                        View Presentation
                        <!-- keep? -->
                    </Button>
                </div>
            </div>
        </div>

        <!-- Features Section with hover effects -->
        <div id="features" class="container mx-auto px-6 py-24 scroll-mt-20">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each [
                    { icon: Brain, title: "Mood Tracking", desc: "Develop emotional intelligence through daily reflections." },
                    { icon: Sparkles, title: "Intuitive Interface", desc: "Clean, modern design that makes productivity tools accessible to everyone." },
                    { icon: Zap, title: "Collaboration", desc: "Foster collaboration and productivity through shared notes and reminders." }
                ] as feature}
                <div
                    class="feature-card p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#8B5CF6]/20 backdrop-blur-sm hover:border-[#8B5CF6] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(219,74,43,0.2)]"
                >
                    <svelte:component this={feature.icon} class="w-12 h-12 text-[#8B5CF6] mb-4" />
                    <h3 class="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p class="text-gray-400">{feature.desc}</p>
                </div>
                {/each}
            </div>
        </div>


        <div id="about" class="container mx-auto px-6 py-24 scroll-mt-20">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold mb-12 bg-gradient-to-r from-[#8B5CF6] to-[#9f75ff] bg-clip-text text-transparent text-center">
                    Why Choose ReflectEd?
                </h2>
                <div class="grid md:grid-cols-2 gap-12">
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-white">Revolutionizing Organization</h3>
                        <p class="text-gray-400">
                            We're not just another to-do list. ReflectEd combines porductivity and mental health with collaborative elements such as reminders, to-do lists, notes, and a modd tracker.
                        </p>
                    </div>
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-white">Built for Everyone</h3>
                        <p class="text-gray-400">
                            Whether you're a student, or educator, our platform adapts to your needs, making it easy to collaborate together and track mental health.
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div id="pricing" class="container mx-auto px-6 py-24 border-t border-[#8B5CF6]/20 scroll-mt-20">
            <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#8B5CF6] to-[#9f75ff] bg-clip-text text-transparent">
                Plans
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Free Plan -->
                <div class="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#8B5CF6]/20 backdrop-blur-sm hover:border-[#8B5CF6]/40 transition-colors">
                    <h3 class="text-2xl font-bold text-white mb-4">Student</h3>
                    <div class="text-4xl font-bold text-gray-400 mb-6">$0</div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Daily mood reflection</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Recieve reminders</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Collaborate with others</li>
                    </ul>
                    <!-- <Button variant="outline" class="w-full border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10">Get Started</Button> -->
                </div>

                <!-- Credits Plan -->
                <div class="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#8B5CF6]/20 backdrop-blur-sm hover:border-[#8B5CF6]/40 transition-colors">
                    <h3 class="text-2xl font-bold text-white mb-4">Educator</h3>
                    <div class="text-4xl font-bold text-[#8B5CF6] mb-6">$5<span class="text-lg text-gray-400">/500</span></div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Track student moods</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Send reminders</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Chat with students</li>
                    </ul>
                    <!-- <Button class="w-full bg-[#8B5CF6] hover:bg-[#7733ff]">Buy Credits</Button> -->
                </div>

                <!-- Enterprise Plan -->
                <div class="p-8 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[#8B5CF6]/20 backdrop-blur-sm hover:border-[#8B5CF6]/40 transition-colors">
                    <h3 class="text-2xl font-bold text-white mb-4">Admin</h3>
                    <div class="text-4xl font-bold text-[#8B5CF6] mb-6">Custom</div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />School-wide access</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />Student management</li>
                        <li class="flex items-center text-gray-300"><ChevronRight class="w-5 h-5 mr-2 text-[#8B5CF6]" />All features included</li>
                    </ul>
                    <!-- <Button variant="outline" class="w-full border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10">Contact Sales</Button> -->
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="container mx-auto px-6 py-12 border-t border-[#8B5CF6]/20">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="text-gray-400 mb-4 md:mb-0">
                    © 2025 ReflectEd. All rights reserved.
                </div>
                <div class="text-[#8B5CF6]">
                    Developers: Eduard Faus, Dylan Paucar, Jose Zequeira, Pablo Castro
                </div>
            </div>
        </footer>
    </div>
</div>

<style>


    /* Hover effects for interactive elements */
    a, button {
        position: relative;
        overflow: hidden;
    }

    /* Add a semi-transparent background to buttons */
    button {
        backdrop-filter: blur(8px);
    }
</style>
