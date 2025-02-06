<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, deleteDoc } from 'firebase/firestore';

    let user: any;
    let announcements: any[] = [];
    let newAnnouncement = {
        title: "",
        content: "",
        timestamp: new Date().toISOString()
    };

    async function loadAnnouncements() {
        try {
            const announcementsRef = collection(db, "Announcements");
            const q = query(announcementsRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            announcements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error loading announcements:", error);
        }
    }

    async function addAnnouncement() {
        if (!newAnnouncement.title || !newAnnouncement.content) return;
        if (!user?.isAdmin) {
            console.error("Unauthorized access");
            return;
        }

        try {
            const announcementId = crypto.randomUUID();
            const announcementRef = doc(db, "Announcements", announcementId);
            
            await setDoc(announcementRef, {
                ...newAnnouncement,
                authorId: user.uid,
                authorName: user.fullName,
                timestamp: new Date().toISOString()
            });

            newAnnouncement = {
                title: "",
                content: "",
                timestamp: new Date().toISOString()
            };

            await loadAnnouncements();
        } catch (error) {
            console.error("Error adding announcement:", error);
        }
    }

    async function deleteAnnouncement(id: string) {
        if (!user?.isAdmin) return;
        try {
            await deleteDoc(doc(db, "Announcements", id));
            await loadAnnouncements();
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    }

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (usr) => {
            if (usr) {
                const docRef = doc(db, "Users", usr.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    user = docSnap.data();
                    user.uid = usr.uid;
                    if (!user.isAdmin) {
                        location.href = "/dashboard";
                        return;
                    }
                    await loadAnnouncements();
                }
            } else {
                location.href = "/auth/login";
            }
        });

        return () => unsubscribe();
    });
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-4xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
                Manage Announcements
            </h1>
            <Button
                class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                onclick={() => location.href = '/admindashboard'}
            >
                Back to Dashboard
            </Button>
        </div>

        <div class="mb-8">
            <h2 class="text-white text-xl mb-4">Add New Announcement</h2>
            <div class="space-y-4">
                <Input
                    type="text"
                    placeholder="Announcement title"
                    class="w-full bg-black/30 text-white border-[#8B5CF6]/20"
                    bind:value={newAnnouncement.title}
                />
                <textarea
                    placeholder="Announcement content"
                    class="w-full p-2 rounded-lg bg-black/30 text-white border border-[#8B5CF6]/20 focus:border-[#7733ff] transition-all"
                    rows="4"
                    bind:value={newAnnouncement.content}
                />
                <Button 
                    class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb] w-full"
                    onclick={addAnnouncement}
                >
                    Post Announcement
                </Button>
            </div>
        </div>

        <div class="mt-8">
            <h2 class="text-2xl font-bold text-white mb-4">Current Announcements</h2>
            <div class="space-y-4">
                {#each announcements as announcement}
                    <div class="bg-black/30 p-4 rounded-lg border border-[#8B5CF6]/20">
                        <div class="flex justify-between">
                            <h3 class="text-white text-lg font-semibold">{announcement.title}</h3>
                            <button
                                class="text-red-500 hover:text-red-400 px-2"
                                on:click={() => deleteAnnouncement(announcement.id)}
                            >
                                ×
                            </button>
                        </div>
                        <p class="text-white/60 mt-2">{announcement.content}</p>
                        <p class="text-[#8B5CF6] text-sm mt-2">
                            {new Date(announcement.timestamp).toLocaleDateString()}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>