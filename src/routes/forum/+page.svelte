<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { onMount } from "svelte";
    import { db, auth } from '$lib/firestuff.js';
    import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, deleteDoc } from 'firebase/firestore';

    let user: any;
    let posts: any[] = [];
    let newPostTitle = "";
    let newPostContent = "";
    let newPostTags = "";
    let newComments: { [key: string]: string } = {};  // Add this line

    async function loadPosts() {
        try {
            const postsRef = collection(db, "Posts");
            const q = query(postsRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            posts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (usr) => {
            if (usr) {
                try {
                    const docRef = doc(db, "Users", usr.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        user = docSnap.data();
                        user.uid = usr.uid;
                        await loadPosts();
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
                authorName: user.name || 'Anonymous',
                likes: 0,
                comments: [],
                timestamp: new Date().toISOString()
            };

            const postsRef = collection(db, "Posts");
            await setDoc(doc(postsRef), postData);

            // Reset form
            newPostTitle = "";
            newPostContent = "";
            newPostTags = "";

            // Reload posts
            await loadPosts();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    async function deletePost(postId: string) {
        try {
            if (!user || !user.uid) return;
            const postRef = doc(db, "Posts", postId);
            await deleteDoc(postRef);
            await loadPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    async function addComment(postId: string) {
        try {
            if (!user || !user.uid || !newComments[postId]) {
                console.error('Missing required fields');
                return;
            }

            const postRef = doc(db, "Posts", postId);
            const postDoc = await getDoc(postRef);
            
            if (postDoc.exists()) {
                const postData = postDoc.data();
                const comments = postData.comments || [];
                
                comments.push({
                    content: newComments[postId],
                    authorId: user.uid,
                    authorName: user.fullName || user.name || 'Anonymous',
                    timestamp: new Date().toISOString()
                });

                await setDoc(postRef, { ...postData, comments });
                newComments[postId] = '';
                await loadPosts();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-slate-900 to-[#110033] p-8">
    <div class="max-w-4xl mx-auto bg-black/20 border border-[#8B5CF6]/20 rounded-lg p-6 backdrop-blur-md">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#cc99ff] to-[#7733ff] bg-clip-text text-transparent">
                Student Forum
            </h1>
            <div class="space-x-4">
                <Button
                    class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                    onclick={() => window.location.href = '/forum/create'}
                >
                    Create Post
                </Button>
                <Button
                    class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]"
                    onclick={() => window.location.href = '/dashboard'}
                >
                    Back to Dashboard
                </Button>
            </div>
        </div>

        <!-- Posts List -->
        <div class="space-y-6">
            {#each posts as post}
                <div class="bg-black/30 p-6 rounded-lg border border-[#8B5CF6]/20">
                    <div class="flex justify-between items-start">
                        <h2 class="text-2xl font-bold text-white">{post.title}</h2>
                        {#if post.authorId === user?.uid}
                            <button
                                class="text-red-500 hover:text-red-400 px-2"
                                on:click={() => deletePost(post.id)}
                            >
                                ×
                            </button>
                        {/if}
                    </div>
                    <p class="text-white/80 mt-4 whitespace-pre-wrap">{post.content}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        {#each post.tags as tag}
                            <span class="bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded-full text-sm">
                                #{tag}
                            </span>
                        {/each}
                    </div>
                    <div class="flex justify-between items-center mt-4 text-sm">
                        <span class="text-white/60">Posted by {post.authorName}</span>
                        <span class="text-[#8B5CF6]">{new Date(post.timestamp).toLocaleString()}</span>
                    </div>
                    
                    <!-- Comments Section -->
                    <div class="mt-6 border-t border-[#8B5CF6]/20 pt-4">
                        <h3 class="text-lg font-semibold text-white mb-4">Comments</h3>
                        
                        <!-- Comment List -->
                        <div class="space-y-4 mb-4">
                            {#each post.comments || [] as comment}
                                <div class="bg-black/40 p-3 rounded">
                                    <p class="text-white/80">{comment.content}</p>
                                    <div class="flex justify-between items-center mt-2 text-sm">
                                        <span class="text-white/60">By {comment.authorName}</span>
                                        <span class="text-[#8B5CF6]">{new Date(comment.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>

                        <!-- Add Comment Form -->
                        <form class="flex gap-2" on:submit|preventDefault={() => addComment(post.id)}>
                            <Input
                                type="text"
                                placeholder="Write a comment..."
                                bind:value={newComments[post.id]}
                                required
                                class="flex-1 bg-black/30 border-[#8B5CF6]/20 text-white"
                            />
                            <Button type="submit" class="bg-[#8B5CF6] text-white hover:bg-[#7c4ddb]">
                                Comment
                            </Button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
