<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
    import { ArrowLeft } from 'lucide-svelte';
    import { goto } from '$app/navigation';

    let currentMood = 5;
    let journalEntries = {
        feeling: "",
        grateful: "",
        tomorrow: ""
    };
    let hasLoggedToday = false;
    let previousEntries: any[] = [];
    let allUsersEntries: any[] = [];
    let user: any;

    const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
    const journalPrompts = [
        { id: "feeling", text: "What made you feel this way today?" },
        { id: "grateful", text: "What's one thing you're grateful for today?" },
        { id: "tomorrow", text: "What would make tomorrow better?" }
    ];

    async function checkTodayEntry(userId: string) {
        const today = new Date().toISOString().split('T')[0];
        const entriesRef = collection(db, "Emotions", userId, "entries");
        const q = query(entriesRef, where("date", "==", today));
        const querySnapshot = await getDocs(q);
        hasLoggedToday = !querySnapshot.empty;
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

    async function loadAllUsersEntries() {
        const usersRef = collection(db, "Users");
        const usersSnapshot = await getDocs(usersRef);
        
        const entriesByStudent = {};
        for (const userDoc of usersSnapshot.docs) {
            if (!userDoc.data().isAdmin) {
                const entriesRef = collection(db, "Emotions", userDoc.id, "entries");
                const q = query(entriesRef, orderBy("date", "desc"));
                const entriesSnapshot = await getDocs(q);
                
                entriesByStudent[userDoc.id] = {
                    userName: userDoc.data().fullName,
                    entries: entriesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                };
            }
        }
        
        allUsersEntries = entriesByStudent;
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
        await loadAllUsersEntries();
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
                        if (!user.isAdmin) {
                            location.href = "/dashboard";
                            return;
                        }
                        await checkTodayEntry(usr.uid);
                        await loadPreviousEntries(usr.uid);
                        await loadAllUsersEntries();
                    } else {
                        location.href = "/auth/createAccount";
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                location.href = "/";
            }
        });
    });
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Back to Dashboard Button -->
        <Button
            class="mb-4 bg-black/30 text-white hover:bg-black/40 border border-[#8B5CF6]/20"
            onclick={() => goto('/admindashboard')}
        >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Dashboard
        </Button>

        <!-- Admin's Personal Mood Logger -->
        <div class="bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md mb-8">
            <h1 class="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
                Admin Mood Logger
            </h1>

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

            <!-- Admin's Previous Entries -->
            <div class="mt-8">
                <h2 class="text-2xl font-bold text-white mb-4">Your Previous Entries</h2>
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

        <!-- All Users' Emotions Section -->
        <div class="bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-white mb-6">Students' Emotions</h2>
            <div class="space-y-8">
                {#each Object.entries(allUsersEntries) as [userId, studentData]}
                    <div class="bg-black/40 p-6 rounded-lg border border-[#8B5CF6]/20">
                        <h3 class="text-2xl font-semibold text-[#8B5CF6] mb-4">{studentData.userName}</h3>
                        <div class="space-y-4">
                            {#each studentData.entries as entry}
                                <div class="bg-black/30 p-4 rounded-lg border border-[#8B5CF6]/20">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-white/60">{entry.date}</span>
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
                {/each}
            </div>
        </div>
    </div>
</div>