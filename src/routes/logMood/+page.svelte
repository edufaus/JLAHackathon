<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

    let currentMood = 5;
    let journalEntries = {
        feeling: "",
        grateful: "",
        tomorrow: ""
    };
    let hasLoggedToday = false;
    let previousEntries: any[] = [];
    let user: any;

    const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
    const journalPrompts = [
        { id: "feeling", text: "What made you feel this way today?" },
        { id: "grateful", text: "What's one thing you're grateful for today?" },
        { id: "tomorrow", text: "What would make tomorrow better?" }
    ];

    async function checkTodayEntry(userId: string) {
        const today = new Date().toISOString().split('T')[0];
        console.log(today)
        const entriesRef = collection(db, "Emotions", userId, "entries");
        const q = query(entriesRef, where("date", "==", today));
        const querySnapshot = await getDocs(q);
        hasLoggedToday = !querySnapshot.empty;
        console.log(hasLoggedToday)
        
        
    }

    async function loadPreviousEntries(userId: string) {
        const entriesRef = collection(db, "Emotions", userId, "entries");
        const q = query(entriesRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        
        previousEntries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async function submitMoodLog() {
        const today = new Date().toISOString().split('T')[0];
        const entryRef = doc(db, "Emotions", user.uid, "entries", today);
        
        await setDoc(entryRef, {
            date: today,
            mood: currentMood,
            journalEntries: journalEntries,
            timestamp: new Date().toISOString()
        });

        hasLoggedToday = true;
        await loadPreviousEntries(user.uid);
        journalEntries = { feeling: "", grateful: "", tomorrow: "" };
    }

    onMount(() => {
        auth.onAuthStateChanged(async (usr) => { 
            if (usr) {
                try {

                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        user = docSnap.data();
                        console.log(user)
                        await checkTodayEntry(usr.uid);
                        await loadPreviousEntries(usr.uid);
                    } else {
                        if (!location.href.includes("/auth/createAccount")) {
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

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-2xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <h1 class="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">Daily Mood Logger</h1>
        <Button
                class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                onclick={() => window.location.href = '/dashboard'}
            >
                Back to Dashboard
            </Button>

        {#if hasLoggedToday}
            <div class="text-white p-4 bg-[#8B5CF6]/20 rounded-lg mb-8">
                You've already logged your mood for today. Check back tomorrow!
            </div>
        {:else}
            <div class="mb-8">
                <h2 class="text-white text-xl mb-4">How are you feeling today?</h2>
                <div class="flex justify-between mb-4">
                    {#each moodEmojis as emoji, i}
                        <button 
                            class="text-4xl p-2 rounded-full transition-transform hover:scale-110 {currentMood === i + 1 ? 'bg-[#8B5CF6]/20' : ''}"
                            on:click={() => currentMood = i + 1}
                        >
                            {emoji}
                        </button>
                    {/each}
                </div>
                
                <div class="space-y-4 mt-8">
                    {#each journalPrompts as prompt}
                        <div class="mb-4">
                            <label class="text-white mb-2 block">{prompt.text}</label>
                            <textarea
                                class="w-full p-2 rounded-lg bg-black/30 text-white border border-[#8B5CF6]/20 focus:border-[#7733ff] transition-all"
                                rows="3"
                                bind:value={journalEntries[prompt.id]}
                            ></textarea>
                        </div>
                    {/each}
                </div>

                <Button 
                    class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb] mt-4 w-full"
                    onclick={submitMoodLog}
                >
                    Log Today's Mood
                </Button>
            </div>
        {/if}

        <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Previous Entries</h2>
            <div class="space-y-4">
                {#each previousEntries as entry}
                    <div class="bg-black/30 p-4 rounded-lg border border-[#8B5CF6]/20">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-white">{entry.date}</span>
                            <span class="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                        </div>
                        <div class="space-y-2">
                            {#each journalPrompts as prompt}
                                <div class="mb-2">
                                    <h4 class="text-white/60 text-sm">{prompt.text}</h4>
                                    <p class="text-white/80">{entry.journalEntries[prompt.id]}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>