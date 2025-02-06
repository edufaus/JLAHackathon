<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
    import { onMount } from "svelte";

    let user: any;
    let newPostTitle = "";
    let newPostContent = "";
    let newPostTags = "";

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (usr) => {
            if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        user = {
                            ...userData,
                            uid: usr.uid
                        };
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                location.href = "/auth/login";
            }
        });

        return () => unsubscribe();
    });

    async function createPost() {
        try {
            if (!user || !user.uid || !newPostTitle || !newPostContent) {
                console.error('Missing required fields');
                return;
            }

            const tags = newPostTags
                .split(',')
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag.length > 0);

            const postData = {
                title: newPostTitle,
                content: newPostContent,
                tags: tags,
                authorId: user.uid,
                authorName: user.fullName || user.name || 'Anonymous', // Try both fullName and name
                likes: 0,
                comments: [],
                timestamp: new Date().toISOString()
            };

            const postsRef = collection(db, "Posts");
            await setDoc(doc(postsRef), postData);

            // Redirect back to forum
            window.location.href = '/forum';
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-4xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
                Create New Post
            </h1>
            <Button
                class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                onclick={() => window.location.href = '/forum'}
            >
                Back to Forum
            </Button>
        </div>

        <form class="space-y-4" on:submit|preventDefault={createPost}>
            <Input
                type="text"
                placeholder="Post title"
                bind:value={newPostTitle}
                required
                class="bg-black/30 border-[#8B5CF6]/20 text-white"
            />
            <textarea
                placeholder="Write your post here..."
                bind:value={newPostContent}
                required
                class="w-full h-32 bg-black/30 border border-[#8B5CF6]/20 rounded-md p-2 text-white resize-none"
            />
            <Input
                type="text"
                placeholder="Tags (comma-separated, e.g.: homework, math, help)"
                bind:value={newPostTags}
                class="bg-black/30 border-[#8B5CF6]/20 text-white"
            />
            <Button type="submit" class="w-full bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]">
                Create Post
            </Button>
        </form>
    </div>
</div>